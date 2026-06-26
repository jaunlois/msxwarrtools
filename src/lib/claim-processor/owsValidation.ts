import type { WarrantyRepairLine, ClaimVehicleInfo, SLTMatch } from "./types";
import { OWS_EXCEPTION_CATALOG, exception, type OwsExceptionCode } from "./owsExceptionCodes";
import { getOwsClaimType } from "./owsClaimTypes";

export interface OwsValidationFinding extends OwsExceptionCode {
  lineNumber?: number;
  detail?: string;
}

export interface OwsValidationResult {
  findings: OwsValidationFinding[];
  errorCount: number;
  warningCount: number;
  passes: boolean;
}

export interface OwsValidationInput {
  vehicle: ClaimVehicleInfo;
  lines: WarrantyRepairLine[];
  comments: Record<number, { complaint: string; cause: string; correction: string }>;
  sltMatches: Map<string, SLTMatch>;
  cccByLine?: Record<number, { code: string; conditionCode: string } | undefined>;
  labourRate: number;
  /** Dealer self-approval cap for parts before prior approval needed. ZAF default = R5 000. */
  partsApprovalCap?: number;
  /** Today's date in ISO yyyy-mm-dd, overridable for tests. */
  today?: string;
}

const MIN_COMMENT_LEN = 15;

function asDate(s?: string): Date | null {
  if (!s) return null;
  const t = Date.parse(s);
  if (!Number.isNaN(t)) return new Date(t);
  // dd/mm/yyyy fallback
  const m = s.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/);
  if (m) {
    const [, d, mo, y] = m;
    const yy = y.length === 2 ? 2000 + parseInt(y, 10) : parseInt(y, 10);
    return new Date(yy, parseInt(mo, 10) - 1, parseInt(d, 10));
  }
  return null;
}

export function validateOws(input: OwsValidationInput): OwsValidationResult {
  const findings: OwsValidationFinding[] = [];
  const push = (f: OwsValidationFinding) => findings.push(f);

  const cap = input.partsApprovalCap ?? 5000;
  const today = input.today ? new Date(input.today) : new Date();
  const warrantyStart = asDate(input.vehicle.warrantyStartDate);

  for (const line of input.lines) {
    const ln = line.itemNumber;
    const cmt = input.comments[ln];

    // Claim Type
    const ct = getOwsClaimType(line.claimType);
    if (!ct) push({ ...exception("E-CT01"), lineNumber: ln });
    else if (ct.requiresSubCode && !line.subCode) push({ ...exception("E-CT02"), lineNumber: ln, detail: ct.subCodeLabel });

    // Op code & SLT
    if (!line.opCode) push({ ...exception("E-OP01"), lineNumber: ln });
    else if (line.opCode.toUpperCase() !== "MT" && !input.sltMatches.has(line.opCode)) {
      push({ ...exception("E-OP02"), lineNumber: ln, detail: line.opCode });
    }

    // Labour
    if (line.labourHours <= 0) push({ ...exception("E-LB01"), lineNumber: ln });
    const slt = input.sltMatches.get(line.opCode);
    if (slt && line.labourHours > slt.hours + 0.01) {
      push({ ...exception("E-LB02"), lineNumber: ln, detail: `${line.labourHours}h vs SLT ${slt.hours}h` });
    }

    // MT specific rules
    if (line.opCode?.toUpperCase() === "MT") {
      const hasBasePart = line.parts.some((p) => p.code?.trim());
      if (!hasBasePart) push({ ...exception("E-MT01"), lineNumber: ln });
      const justification = `${cmt?.cause || ""} ${cmt?.correction || ""}`.toLowerCase();
      if (!/(time|hour|min|mt|actual)/.test(justification)) {
        push({ ...exception("E-MT02"), lineNumber: ln });
      }
    }

    // Parts
    const seen = new Set<string>();
    let causalCount = 0;
    let partsTotal = 0;
    for (const p of line.parts) {
      if (p.qty <= 0) push({ ...exception("E-PT01"), lineNumber: ln, detail: p.code });
      if ((p.unitPrice ?? 0) <= 0) push({ ...exception("E-PT02"), lineNumber: ln, detail: p.code });
      if (p.causal) causalCount += 1;
      const key = (p.code || "").toUpperCase();
      if (key && seen.has(key)) push({ ...exception("E-PT04"), lineNumber: ln, detail: p.code });
      seen.add(key);
      partsTotal += (p.qty || 0) * (p.unitPrice || 0);
    }
    if (line.parts.length > 0 && causalCount !== 1) {
      push({ ...exception("E-PT03"), lineNumber: ln, detail: `${causalCount} flagged` });
    }
    if (partsTotal > cap) {
      push({ ...exception("E-PT05"), lineNumber: ln, detail: `R ${partsTotal.toFixed(2)}` });
    }
    const claimTotal = partsTotal + line.labourHours * input.labourRate;
    if (claimTotal > cap * 2) {
      push({ ...exception("E-AP01"), lineNumber: ln, detail: `R ${claimTotal.toFixed(2)}` });
    }

    // CCC + Condition
    const ccc = input.cccByLine?.[ln];
    if (!ccc?.code) push({ ...exception("E-CC01"), lineNumber: ln });
    else if (!ccc.conditionCode) push({ ...exception("E-CC02"), lineNumber: ln });

    // 3C comments
    if (!cmt || !cmt.complaint?.trim() || !cmt.cause?.trim() || !cmt.correction?.trim()) {
      push({ ...exception("E-CM01"), lineNumber: ln });
    } else {
      const tooShort = [cmt.complaint, cmt.cause, cmt.correction].some((s) => s.trim().length < MIN_COMMENT_LEN);
      if (tooShort) push({ ...exception("E-CM02"), lineNumber: ln });
    }

    // Dates / odometer
    if (warrantyStart && warrantyStart > today) {
      push({ ...exception("E-DT02"), lineNumber: ln });
    }
  }

  const errorCount = findings.filter((f) => f.severity === "error").length;
  const warningCount = findings.filter((f) => f.severity === "warning").length;

  return { findings, errorCount, warningCount, passes: errorCount === 0 };
}

export { OWS_EXCEPTION_CATALOG };