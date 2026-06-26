/**
 * Ford OWS (ONE Warranty Solution) claim type catalogue for ZAF.
 * Sourced from the ZAF OWS Claiming User Guide v10.5.
 * Sub-codes vary by claim type — `requiresSubCode` flags the ones the
 * pre-validator must enforce.
 */
export interface OwsClaimType {
  code: string;
  label: string;
  description: string;
  requiresSubCode?: boolean;
  subCodeLabel?: string;
}

export const OWS_CLAIM_TYPES: OwsClaimType[] = [
  { code: "11", label: "Vehicle (NVLW)", description: "Standard New Vehicle Limited Warranty repair." },
  { code: "12", label: "Emissions", description: "Emissions / catalytic converter coverage." },
  { code: "13", label: "Powertrain", description: "Powertrain warranty repair." },
  { code: "14", label: "Safety Restraint", description: "Airbags / seat-belt / SRS coverage." },
  { code: "17", label: "Corrosion (Perforation)", description: "Body sheet-metal perforation coverage." },
  { code: "31", label: "FSA / Recall", description: "Field Service Action / safety recall.", requiresSubCode: true, subCodeLabel: "FSA Number" },
  { code: "33", label: "Customer Satisfaction Program", description: "CSP repair authorised by Ford." },
  { code: "40", label: "Accessories", description: "Ford accessory part install / coverage." },
  { code: "50", label: "ESP (Premium / Powertrain / Extra / Wear Care)", description: "Ford Protect Extended Service Plan claim.", requiresSubCode: true, subCodeLabel: "ESP Contract" },
  { code: "AWA", label: "After Warranty Assistance", description: "Goodwill / post-warranty assistance request." },
];

export function getOwsClaimType(code?: string): OwsClaimType | undefined {
  if (!code) return undefined;
  return OWS_CLAIM_TYPES.find((t) => t.code === code.toUpperCase());
}