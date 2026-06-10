import { partsData, type PartCoverage } from "@/data/parts-data";
import type {
  ClaimPartLine,
  ClaimVehicleInfo,
  ParsedOasis,
  WarrantyRepairLine,
} from "./types";

export type CoverageBucket = "factory" | "esp" | "none";
export type CoverageVerdict = "factory" | "esp" | "partial" | "awa";

export interface PartCoverageResult {
  part: ClaimPartLine;
  covered: CoverageBucket;
  plan?: string;
  baseNumber?: string;
}

export interface LineCoverage {
  line: WarrantyRepairLine;
  parts: PartCoverageResult[];
  labour: CoverageBucket;
  verdict: CoverageVerdict;
  reason: string;
}

export interface CoverageReport {
  factoryStatus: {
    inWarranty: boolean;
    ageYears: number | null;
    km: number | null;
    capYears: number;
    capKm: number;
  };
  espStatus: {
    active: boolean;
    plan?: string; // e.g. "Premium Care"
    expiry?: string;
    distance?: string;
    rawStatus?: string;
  };
  lines: LineCoverage[];
  overall: CoverageVerdict;
  recommendation: string;
  awaJustification: string;
}

const FACTORY_CAP_YEARS = 4;
const FACTORY_CAP_KM = 120_000;

// Map ESP plan name → PartCoverage flag
const ESP_PLAN_FIELDS: Record<string, keyof PartCoverage> = {
  "Premium Care": "premiumCare",
  "Premium Maintenance": "premiumMaintenance",
  "Extra Care": "extraCare",
  "Powertrain Care": "powertrainCare",
  "Wear Care": "wearCare",
};

function parseKm(s: string | undefined | null): number | null {
  if (!s) return null;
  const n = parseInt(String(s).replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function parseAnyDate(s: string | undefined | null): Date | null {
  if (!s) return null;
  const t = s.trim();
  // dd/mm/yyyy
  let m = t.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (m) {
    const d = parseInt(m[1]), mo = parseInt(m[2]) - 1;
    let y = parseInt(m[3]);
    if (y < 100) y += 2000;
    const dt = new Date(y, mo, d);
    return isNaN(dt.getTime()) ? null : dt;
  }
  const dt = new Date(t);
  return isNaN(dt.getTime()) ? null : dt;
}

function yearsBetween(a: Date, b: Date): number {
  return (b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
}

// Extract the Ford "base" part number from a WERS code, e.g.
// "JB3Z9E527D" → "9E527", "HG9Z9324B" → "9324"
export function extractBaseNumber(code: string): string {
  if (!code) return "";
  const c = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
  // Drop leading prefix (3-4 chars ending in Z/T/S/B) and trailing suffix letter(s)
  // Ford convention: <prefix><base><suffix>. Base starts after the prefix and ends before trailing letters.
  const m = c.match(/^[A-Z0-9]{2,5}?([0-9][A-Z0-9]{2,5}?)[A-Z]?$/);
  if (m) {
    // Try common: strip first 4 chars + trailing single letter
    const guess1 = c.slice(4).replace(/[A-Z]+$/, "");
    if (guess1) return guess1;
    return m[1];
  }
  // Fallback: strip trailing letters
  return c.replace(/[A-Z]+$/, "");
}

function findPartCoverage(code: string): PartCoverage | undefined {
  if (!code) return undefined;
  const upper = code.toUpperCase();
  // 1) exact match
  let hit = partsData.find((p) => p.partNumber.toUpperCase() === upper);
  if (hit) return hit;
  // 2) base-number match
  const base = extractBaseNumber(code);
  if (base) {
    hit = partsData.find((p) => p.partNumber.toUpperCase() === base);
    if (hit) return hit;
  }
  return undefined;
}

function detectActiveEspPlan(oasis: ParsedOasis | null): {
  active: boolean;
  plan?: string;
  expiry?: string;
  distance?: string;
  rawStatus?: string;
} {
  if (!oasis) return { active: false };
  const messages = (oasis.warrantyCoverageMessages || []).join(" ");
  const esp = oasis.espInfo;
  const haystack = `${messages} ${esp ? Object.values(esp).join(" ") : ""}`.toLowerCase();

  // Detect plan name
  let plan: string | undefined;
  if (/premium\s*care/.test(haystack)) plan = "Premium Care";
  else if (/premium\s*maintenance/.test(haystack)) plan = "Premium Maintenance";
  else if (/extra\s*care/.test(haystack)) plan = "Extra Care";
  else if (/powertrain\s*care/.test(haystack)) plan = "Powertrain Care";
  else if (/wear\s*care/.test(haystack)) plan = "Wear Care";

  if (!esp) {
    // Coverage messages alone can indicate an active ESP without the contract block
    if (plan && /active|current|in\s*force/.test(haystack)) {
      return { active: true, plan };
    }
    return { active: false, plan };
  }

  const status = (esp.status || "").toUpperCase();
  const isExpired = /EXPIR|CANCEL|VOID/.test(status);
  return {
    active: !isExpired,
    plan: plan || "ESP",
    expiry: esp.expirationDate,
    distance: esp.distance,
    rawStatus: esp.status,
  };
}

export function analyzeCoverage(
  vehicle: ClaimVehicleInfo,
  oasis: ParsedOasis | null,
  warrantyLines: WarrantyRepairLine[],
): CoverageReport {
  // Factory warranty status
  const wsd = parseAnyDate(vehicle.warrantyStartDate);
  const km = parseKm(vehicle.kilometers);
  const ageYears = wsd ? yearsBetween(wsd, new Date()) : null;
  const inWarranty =
    ageYears !== null && km !== null
      ? ageYears <= FACTORY_CAP_YEARS && km <= FACTORY_CAP_KM
      : false;

  // ESP status
  const espStatus = detectActiveEspPlan(oasis);
  const espField = espStatus.plan ? ESP_PLAN_FIELDS[espStatus.plan] : undefined;
  const espKmCap = parseKm(espStatus.distance);
  const espWithinKm = espKmCap && km ? km <= espKmCap : true;
  const espActive = espStatus.active && espWithinKm;

  // Per-line analysis
  const lines: LineCoverage[] = warrantyLines.map((line) => {
    const parts: PartCoverageResult[] = line.parts.map((p) => {
      if (inWarranty) {
        return { part: p, covered: "factory", plan: "Factory Warranty", baseNumber: extractBaseNumber(p.code) };
      }
      const cov = findPartCoverage(p.code);
      if (espActive && espField && cov && cov[espField]) {
        return { part: p, covered: "esp", plan: espStatus.plan, baseNumber: extractBaseNumber(p.code) };
      }
      return { part: p, covered: "none", baseNumber: extractBaseNumber(p.code) };
    });

    let labour: CoverageBucket = "none";
    if (inWarranty) labour = "factory";
    else if (espActive && parts.some((p) => p.covered === "esp")) labour = "esp";

    let verdict: CoverageVerdict = "awa";
    if (parts.length === 0) {
      verdict = labour === "factory" ? "factory" : labour === "esp" ? "esp" : "awa";
    } else {
      const buckets = new Set(parts.map((p) => p.covered));
      if (buckets.size === 1) {
        const only = parts[0].covered;
        verdict = only === "factory" ? "factory" : only === "esp" ? "esp" : "awa";
      } else if (buckets.has("none")) {
        verdict = "partial";
      } else {
        verdict = buckets.has("factory") ? "factory" : "esp";
      }
    }

    const reason =
      verdict === "factory"
        ? "Within factory warranty — submit standard warranty claim."
        : verdict === "esp"
        ? `Covered by active ${espStatus.plan} ESP — submit ESP claim.`
        : verdict === "partial"
        ? `Mixed: some parts covered by ${espStatus.plan ?? "ESP"}, others need AWA.`
        : espStatus.plan
        ? `Out of factory; ${espStatus.plan} does not cover these parts — AWA goodwill required.`
        : "Out of factory and no active ESP — AWA goodwill required.";

    return { line, parts, labour, verdict, reason };
  });

  // Overall verdict
  const verdicts = new Set(lines.map((l) => l.verdict));
  let overall: CoverageVerdict = "awa";
  if (verdicts.size === 1) overall = lines[0]?.verdict ?? "awa";
  else if (verdicts.has("awa") || verdicts.has("partial")) overall = "partial";
  else if (verdicts.has("factory")) overall = "factory";
  else overall = "esp";

  const recommendation =
    overall === "factory"
      ? "Submit as factory warranty claim — no AWA needed."
      : overall === "esp"
      ? `Submit as ESP claim — fully covered by ${espStatus.plan ?? "ESP"}.`
      : overall === "partial"
      ? `Partial coverage — file ESP for ${espStatus.plan ?? "covered"} parts, AWA for the remainder.`
      : "No factory or ESP coverage — AWA goodwill request justified.";

  const ageTxt = ageYears !== null ? `${ageYears.toFixed(1)} yrs` : "unknown age";
  const kmTxt = km !== null ? `${km.toLocaleString()} km` : "unknown km";
  const espTxt = espStatus.active
    ? `${espStatus.plan} ESP active${espStatus.expiry ? ` until ${espStatus.expiry}` : ""}`
    : espStatus.plan
    ? `${espStatus.plan} ESP ${espStatus.rawStatus ?? "not active"}`
    : "no ESP on file";

  const awaJustification =
    overall === "awa"
      ? `Vehicle out of factory warranty (${ageTxt} / ${kmTxt}, cap ${FACTORY_CAP_YEARS}yr/${FACTORY_CAP_KM.toLocaleString()}km). ${espTxt}; quoted parts not covered. Requesting AWA goodwill to retain customer loyalty.`
      : overall === "partial"
      ? `Vehicle out of factory (${ageTxt} / ${kmTxt}). ${espTxt}. Some parts on the quote fall outside ESP coverage — requesting AWA for the uncovered items only.`
      : "";

  return {
    factoryStatus: {
      inWarranty,
      ageYears,
      km,
      capYears: FACTORY_CAP_YEARS,
      capKm: FACTORY_CAP_KM,
    },
    espStatus,
    lines,
    overall,
    recommendation,
    awaJustification,
  };
}