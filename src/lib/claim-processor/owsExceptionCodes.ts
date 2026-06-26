/**
 * Common OWS pre-validation exception code prefixes derived from the
 * ZAF OWS Claiming User Guide v10.5. Used by the local pre-validator
 * to mirror OWS error messaging so users learn the codes.
 */
export interface OwsExceptionCode {
  code: string;
  severity: "error" | "warning" | "info";
  message: string;
}

export const OWS_EXCEPTION_CATALOG: Record<string, OwsExceptionCode> = {
  "E-CT01": { code: "E-CT01", severity: "error", message: "Claim Type is missing or invalid." },
  "E-CT02": { code: "E-CT02", severity: "error", message: "Sub-code is required for the selected Claim Type." },
  "E-CC01": { code: "E-CC01", severity: "error", message: "CCC (Customer Concern Code) is required on every repair line." },
  "E-CC02": { code: "E-CC02", severity: "error", message: "Condition Code is required when a CCC is supplied." },
  "E-OP01": { code: "E-OP01", severity: "error", message: "Op code is missing on a repair line." },
  "E-OP02": { code: "E-OP02", severity: "error", message: "Op code is not found in the published SLT (Standard Labour Times)." },
  "E-LB01": { code: "E-LB01", severity: "error", message: "Labour hours must be greater than zero." },
  "E-LB02": { code: "E-LB02", severity: "warning", message: "Labour hours exceed published SLT — actual time (MT) justification required in comments." },
  "E-MT01": { code: "E-MT01", severity: "error", message: "MT (actual time) op codes must be supported by a base part number or published labour op." },
  "E-MT02": { code: "E-MT02", severity: "error", message: "MT op requires time-keeping justification in the Cause/Correction comment fields." },
  "E-PT01": { code: "E-PT01", severity: "error", message: "Part quantity must be greater than zero." },
  "E-PT02": { code: "E-PT02", severity: "error", message: "Part unit price must be greater than zero." },
  "E-PT03": { code: "E-PT03", severity: "error", message: "Each repair line must have exactly one causal part flagged." },
  "E-PT04": { code: "E-PT04", severity: "warning", message: "Duplicate part code on the same repair line." },
  "E-PT05": { code: "E-PT05", severity: "warning", message: "Parts value exceeds R5 000 — prior approval code required." },
  "E-DT01": { code: "E-DT01", severity: "error", message: "Repair Line Completion Date cannot be in the future." },
  "E-DT02": { code: "E-DT02", severity: "error", message: "Repair Line Completion Date is before the Warranty Start Date." },
  "E-OD01": { code: "E-OD01", severity: "error", message: "Odometer at completion is lower than a prior claim's odometer." },
  "E-CM01": { code: "E-CM01", severity: "error", message: "Complaint / Cause / Correction comments are required (3C format)." },
  "E-CM02": { code: "E-CM02", severity: "warning", message: "Comments are too short — OWS requires meaningful 3C detail." },
  "E-AP01": { code: "E-AP01", severity: "warning", message: "Claim total exceeds Dealer Self-Approval limit — Prior Approval code required." },
  "I-ZAF01": { code: "I-ZAF01", severity: "info", message: "Customer / Dealer Participation is not applicable in ZAF." },
};

export function exception(code: keyof typeof OWS_EXCEPTION_CATALOG, detail?: string): OwsExceptionCode & { detail?: string } {
  const base = OWS_EXCEPTION_CATALOG[code];
  return detail ? { ...base, detail } : base;
}