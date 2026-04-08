import { sltSections } from "@/data/slt-data";
import { cccCodes, conditionCodes, type CCCCode } from "@/data/ccc-data";
import type { SLTMatch, CCCMatch } from "./types";

export function matchSLTCode(opCode: string): SLTMatch | null {
  const normalizedCode = opCode.replace(/\s+/g, "").toUpperCase();
  
  for (const section of sltSections) {
    for (const op of section.operations) {
      if (op.opCode.replace(/\s+/g, "").toUpperCase() === normalizedCode) {
        const hours = op.variants?.length ? op.variants[0].time : 0;
        return { opCode: op.opCode, description: op.description, hours, section: section.name };
      }
    }
  }
  
  // Partial match
  for (const section of sltSections) {
    for (const op of section.operations) {
      if (op.opCode.includes(normalizedCode) || normalizedCode.includes(op.opCode.replace(/\s+/g, "").toUpperCase())) {
        const hours = op.variants?.length ? op.variants[0].time : 0;
        return { opCode: op.opCode, description: op.description, hours, section: section.name };
      }
    }
  }

  return null;
}

export function matchMultipleSLTCodes(opCodes: string[]): Map<string, SLTMatch> {
  const matches = new Map<string, SLTMatch>();
  for (const code of opCodes) {
    const subCodes = code.split(/[+&]/);
    for (const sub of subCodes) {
      const trimmed = sub.trim();
      if (trimmed) {
        const match = matchSLTCode(trimmed);
        if (match) matches.set(trimmed, match);
      }
    }
  }
  return matches;
}

/**
 * Suggest SLT codes by analyzing description text (complaint/cause/correction)
 * when no op code is provided or the op code doesn't match.
 */
export function suggestSLTFromDescription(description: string): SLTMatch[] {
  const desc = description.toLowerCase();
  const results: SLTMatch[] = [];
  const seen = new Set<string>();

  // Keyword → SLT section range mapping for smarter matching
  const keywordSections: { keywords: string[]; sectionRange: [number, number] }[] = [
    { keywords: ["wheel", "hub", "bearing", "tire", "tyre", "stud"], sectionRange: [0, 1999] },
    { keywords: ["brake", "caliper", "rotor", "pad", "disc"], sectionRange: [2000, 2999] },
    { keywords: ["steering", "rack", "tie rod", "ball joint", "suspension", "shock", "strut", "stabilizer", "sway bar", "control arm"], sectionRange: [3000, 3999] },
    { keywords: ["rear axle", "differential", "diff", "pinion", "ring gear", "axle shaft", "prop shaft", "driveshaft"], sectionRange: [4000, 4999] },
    { keywords: ["exhaust", "muffler", "catalytic", "dpf", "spring", "leaf spring", "coil spring"], sectionRange: [5000, 5999] },
    { keywords: ["engine", "cylinder", "piston", "crankshaft", "camshaft", "valve", "timing", "turbo", "oil pump", "oil pan", "gasket", "head gasket"], sectionRange: [6000, 6999] },
    { keywords: ["transmission", "gearbox", "clutch", "torque converter", "shift", "transfer case"], sectionRange: [7000, 7999] },
    { keywords: ["cooling", "radiator", "thermostat", "water pump", "coolant", "fan", "heater core"], sectionRange: [8000, 8999] },
    { keywords: ["fuel", "injector", "fuel pump", "throttle", "intake", "manifold", "air filter"], sectionRange: [9000, 9999] },
    { keywords: ["electrical", "battery", "alternator", "starter", "wiring", "fuse", "relay", "sensor", "module", "switch", "light", "lamp", "window", "mirror", "lock"], sectionRange: [10000, 16999] },
  ];

  // Find which sections are relevant
  const relevantSections = new Set<string>();
  for (const ks of keywordSections) {
    if (ks.keywords.some(kw => desc.includes(kw))) {
      for (const section of sltSections) {
        for (const op of section.operations) {
          const codeNum = parseInt(op.opCode.replace(/[A-Z]/gi, ""));
          if (!isNaN(codeNum) && codeNum >= ks.sectionRange[0] && codeNum <= ks.sectionRange[1]) {
            relevantSections.add(section.name);
          }
        }
      }
    }
  }

  // Now search within relevant sections for description keyword matches
  for (const section of sltSections) {
    if (relevantSections.size > 0 && !relevantSections.has(section.name)) continue;
    for (const op of section.operations) {
      const opDesc = op.description.toLowerCase();
      // Check if any significant words from the input match the SLT description
      const inputWords = desc.split(/\s+/).filter(w => w.length > 3);
      const matchCount = inputWords.filter(w => opDesc.includes(w)).length;
      if (matchCount >= 2 || (matchCount === 1 && inputWords.length <= 2)) {
        if (!seen.has(op.opCode)) {
          seen.add(op.opCode);
          const hours = op.variants?.length ? op.variants[0].time : 0;
          results.push({ opCode: op.opCode, description: op.description, hours, section: section.name });
        }
      }
    }
  }

  return results.slice(0, 5); // Return top 5
}

/**
 * Smart CCC code suggestion using the actual ccc-data.ts dataset.
 * Analyzes complaint text, cause, correction, and operation description
 * to find the closest matching CCC codes with condition codes.
 */
export function suggestCCCCodes(description: string): CCCMatch[] {
  const desc = description.toLowerCase();
  if (!desc.trim()) return [];

  // Score each CCC code based on keyword overlap
  const scored: { code: CCCCode; score: number }[] = [];

  for (const ccc of cccCodes) {
    let score = 0;
    const cccDesc = ccc.description.toLowerCase();
    const cccCategory = ccc.category.toLowerCase();

    // Extract meaningful words from CCC description (3+ chars)
    const cccWords = cccDesc.split(/[\s\-\/()]+/).filter(w => w.length > 2);
    const descWords = desc.split(/[\s\-\/(),.]+/).filter(w => w.length > 2);

    // Word overlap scoring
    for (const word of cccWords) {
      if (desc.includes(word)) score += 3;
    }
    for (const word of descWords) {
      if (cccDesc.includes(word)) score += 2;
    }

    // Category match bonus
    if (desc.includes(cccCategory)) score += 5;

    // Specific strong keyword matches
    const strongMatches: { keywords: string[]; categories: string[] }[] = [
      { keywords: ["shock", "absorber", "strut"], categories: ["Steering"] },
      { keywords: ["differential", "diff", "pinion"], categories: ["Drivetrain"] },
      { keywords: ["transmission", "gearbox", "shift"], categories: ["Transmission"] },
      { keywords: ["engine", "motor", "cylinder"], categories: ["Engine"] },
      { keywords: ["brake", "caliper", "rotor"], categories: ["Brakes"] },
      { keywords: ["leak", "leaking", "seepage"], categories: [] },
      { keywords: ["noise", "knocking", "rattle", "clunk"], categories: [] },
      { keywords: ["vibration", "vibrate", "shudder"], categories: [] },
      { keywords: ["warning", "light", "lamp", "illuminat"], categories: [] },
      { keywords: ["prop shaft", "driveshaft", "drive shaft"], categories: ["Drivetrain"] },
      { keywords: ["coolant", "overheating", "radiator"], categories: ["Cooling"] },
      { keywords: ["fuel", "injector", "throttle"], categories: ["Fuel"] },
      { keywords: ["exhaust", "dpf", "muffler"], categories: ["Exhaust"] },
      { keywords: ["a/c", "air con", "hvac", "blower"], categories: ["HVAC"] },
      { keywords: ["sync", "screen", "bluetooth", "navigation"], categories: ["Infotainment"] },
      { keywords: ["door", "window", "lock", "handle"], categories: ["Body"] },
      { keywords: ["water leak", "wind noise"], categories: ["Body"] },
    ];

    for (const sm of strongMatches) {
      const inputHasKeyword = sm.keywords.some(kw => desc.includes(kw));
      const cccHasKeyword = sm.keywords.some(kw => cccDesc.includes(kw));
      if (inputHasKeyword && cccHasKeyword) score += 8;
      if (inputHasKeyword && sm.categories.includes(ccc.category)) score += 4;
    }

    // Condition code alignment: if description mentions leak → condition F, noise → condition A, etc.
    const conditionHints: { keywords: string[]; condCode: string }[] = [
      { keywords: ["leak", "leaking", "seepage"], condCode: "F" },
      { keywords: ["noise", "knocking", "rattle", "squeak", "clunk"], condCode: "A" },
      { keywords: ["vibration", "vibrate", "shudder", "shake"], condCode: "R" },
      { keywords: ["inoperative", "not working", "does not work", "won't", "will not"], condCode: "E" },
      { keywords: ["warning light", "light on", "illuminat"], condCode: "I" },
      { keywords: ["hard shift", "won't shift", "slipping"], condCode: "W" },
      { keywords: ["sticking", "binding", "stuck"], condCode: "B" },
      { keywords: ["overheating", "running hot"], condCode: "O" },
      { keywords: ["pull", "drift", "wander"], condCode: "Q" },
      { keywords: ["worn", "wear", "excessive wear"], condCode: "U" },
      { keywords: ["smell", "odor", "smoke"], condCode: "Y" },
      { keywords: ["crack", "broken", "chip"], condCode: "C" },
      { keywords: ["dent", "damage", "scratch"], condCode: "D" },
      { keywords: ["loose", "play", "sag"], condCode: "K" },
      { keywords: ["intermittent", "sometimes"], condCode: "J" },
      { keywords: ["stall", "dies"], condCode: "S" },
      { keywords: ["rough idle", "misfire"], condCode: "T" },
    ];

    for (const ch of conditionHints) {
      if (ch.keywords.some(kw => desc.includes(kw)) && ccc.conditionCode === ch.condCode) {
        score += 6;
      }
    }

    if (score > 5) {
      scored.push({ code: ccc, score });
    }
  }

  // Sort by score descending, take top matches
  scored.sort((a, b) => b.score - a.score);
  const topMatches = scored.slice(0, 3);

  return topMatches.map(s => {
    const cond = conditionCodes.find(c => c.code === s.code.conditionCode);
    return {
      code: s.code.code,
      description: s.code.description,
      conditionCode: s.code.conditionCode,
      conditionDescription: cond?.description || "",
    };
  });
}

/**
 * Check if a vehicle is within its warranty period (4 years / 120,000 km).
 */
export function checkWarrantyValidity(
  warrantyStartDate: string,
  kilometers: string,
  referenceDate?: Date
): { inWarranty: boolean; reason: string; daysRemaining?: number; kmRemaining?: number } {
  const WARRANTY_YEARS = 4;
  const WARRANTY_KM = 120000;
  const ref = referenceDate || new Date();

  // Parse warranty start date
  let startDate: Date | null = null;
  // Try various formats: YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY, etc.
  const datePatterns = [
    /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
    /(\d{2})\/(\d{2})\/(\d{4})/, // DD/MM/YYYY or MM/DD/YYYY
    /(\d{2})-(\d{2})-(\d{4})/, // DD-MM-YYYY
  ];

  for (const pat of datePatterns) {
    const m = warrantyStartDate.match(pat);
    if (m) {
      if (pat === datePatterns[0]) {
        startDate = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]));
      } else {
        // Assume DD/MM/YYYY for South Africa
        startDate = new Date(parseInt(m[3]), parseInt(m[2]) - 1, parseInt(m[1]));
      }
      break;
    }
  }

  if (!startDate || isNaN(startDate.getTime())) {
    return { inWarranty: false, reason: "Cannot parse warranty start date" };
  }

  const expiryDate = new Date(startDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + WARRANTY_YEARS);

  const daysRemaining = Math.ceil((expiryDate.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24));
  const timeInWarranty = daysRemaining > 0;

  const km = parseInt(kilometers.replace(/[\s,]/g, "")) || 0;
  const kmRemaining = WARRANTY_KM - km;
  const kmInWarranty = km <= WARRANTY_KM;

  if (!timeInWarranty && !kmInWarranty) {
    return { inWarranty: false, reason: `Warranty expired on ${expiryDate.toISOString().split("T")[0]} AND mileage exceeds ${WARRANTY_KM.toLocaleString()} km`, daysRemaining, kmRemaining };
  }
  if (!timeInWarranty) {
    return { inWarranty: false, reason: `Warranty expired on ${expiryDate.toISOString().split("T")[0]} (${Math.abs(daysRemaining)} days ago)`, daysRemaining, kmRemaining };
  }
  if (!kmInWarranty) {
    return { inWarranty: false, reason: `Mileage ${km.toLocaleString()} km exceeds warranty limit of ${WARRANTY_KM.toLocaleString()} km`, daysRemaining, kmRemaining };
  }

  return {
    inWarranty: true,
    reason: `In warranty — ${daysRemaining} days and ${kmRemaining.toLocaleString()} km remaining`,
    daysRemaining,
    kmRemaining,
  };
}
