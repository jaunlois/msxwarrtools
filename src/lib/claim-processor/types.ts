export interface ClaimVehicleInfo {
  customerName: string;
  company: string;
  vin: string;
  regNo: string;
  engineNo: string;
  vehicleModel: string;
  modelCode: string;
  warrantyStartDate: string;
  kilometers: string;
  deliveryDate: string;
  phone: string;
  email: string;
}

export interface ClaimPartLine {
  code: string;
  description: string;
  qty: number;
  unitPrice: number; // FOB / ex VAT
  /** OWS requires exactly one causal part per repair line. */
  causal?: boolean;
}

export interface ClaimLabourLine {
  description: string;
  opCode: string;
  hours: number;
  rate: number; // hourly rate
}

export interface WarrantyRepairLine {
  itemNumber: number;
  opCode: string;
  operationDescription: string;
  paymentMethod: string; // WAR, CSH, etc.
  labourHours: number;
  labourAmount: number;
  parts: ClaimPartLine[];
  subTotal: number;
  vatAmount: number;
  total: number;
  /** OWS claim type code, e.g. "11" Vehicle, "12" Emissions, "13" Powertrain, "14" SRS, "31" FSA. */
  claimType?: string;
  /** OWS sub-code (when claim type requires one, e.g. FSA number for 31). */
  subCode?: string;
}

export interface ParsedQuote {
  bsiJobcardNo: string;
  roNumber: string;
  date: string;
  serviceConsultant: string;
  vehicle: ClaimVehicleInfo;
  repairLines: WarrantyRepairLine[];
  allLines: WarrantyRepairLine[]; // includes CSH
  dealerName: string;
  dealerAddress: string;
  dealerPhone: string;
}

export interface ParsedBackPage {
  lines: {
    lineNumber: number;
    complaint: string;
    cause: string;
    correction: string;
    technicianName: string;
  }[];
}

export interface ParsedFrontPage {
  bsiNumber: string;
  roNumber: string;
  customerName: string;
  vehicleModel: string;
  vin: string;
  regNo: string;
  engineNo: string;
  kilometers: string;
  warrantyStartDate: string;
  checkInDate: string;
  operations: {
    number: number;
    opCode: string;
    paymentType: string;
    description: string;
  }[];
}

export interface ParsedOasis {
  vehicleDescription: string;
  versionSeries: string;
  bodyStyle: string;
  driveType: string;
  engine: string;
  transmission: string;
  fuelType: string;
  warrantyStartDate: string;
  buildDate: string;
  releaseDate: string;
  odometer: string;
  outstandingFSAs: string[];
  espInfo: {
    contractNumber: string;
    expirationDate: string;
    distance: string;
    deductible: string;
    status: string;
  } | null;
  warrantyCoverageMessages: string[];
}

export interface WarrantyHistoryEntry {
  claimKey: string;
  trxCode: string;
  timeInService: number;
  laborHours: number;
  dealership: string;
  distance: string;
  repairDate: string;
  partPrefix: string;
  partBase: string;
  partSuffix: string;
  docNumber: string;
  customerComments: string;
  techComments: string;
}

export interface ParsedWarrantyHistory {
  vin: string;
  warrantyStartDate: string;
  sellingDealer: string;
  entries: WarrantyHistoryEntry[];
}

export interface RepeatRepairWarning {
  currentLine: WarrantyRepairLine;
  previousEntry: WarrantyHistoryEntry;
  reason: string;
}

export interface SLTMatch {
  opCode: string;
  description: string;
  hours: number;
  section: string;
}

export interface CCCMatch {
  code: string;
  description: string;
  conditionCode: string;
  conditionDescription: string;
}

export interface ClaimData {
  // Core identifiers
  bsiNumber: string; // e.g. "B-0012281"
  claimNumber: string; // e.g. "B12281" (normalized)
  roNumber: string;

  // Dealer info
  dealershipName: string;
  branch: string;
  dealerCode: string;
  dealerPhone: string;
  dealerEmail: string;

  // Vehicle/Customer
  vehicle: ClaimVehicleInfo;

  // Parsed data
  warrantyLines: WarrantyRepairLine[];
  backPageData: ParsedBackPage | null;
  oasisData: ParsedOasis | null;
  warrantyHistory: ParsedWarrantyHistory | null;

  // Matched data
  sltMatches: Map<string, SLTMatch>;
  cccSuggestions: CCCMatch[];
  repeatWarnings: RepeatRepairWarning[];

  // Uploaded files for re-download
  uploadedFiles: { name: string; blob: Blob; type: string }[];
}

export function normalizeBsiNumber(bsi: string): string {
  // "B-0012281" → "B12281"
  return bsi.replace(/^B-?0*/, "B");
}
