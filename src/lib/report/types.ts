export interface AgeAnalysisClaim {
  claimStatus: string;
  claimNo: string;
  roNumber: string;
  vinNumber: string;
  jobType: string;
  accountNo: string;
  invoiceNo: string;
  invoiceDate: string;
  days0to30: number;
  days31to60: number;
  days61to90: number;
  days91to120: number;
  days121to150: number;
  days150plus: number;
  total: number;
  totalPD: number | null;
  diff: number | null;
  comment: string;
  matched: boolean;
  matchedSBI: string;
}

export interface SBIClaim {
  repairOrderNo: string;
  claimType: string;
  subCode: string;
  vin: string;
  dateOfRepair: string;
  netAmount: number;
  vatRate: number;
  vatAmount: number;
  totalIncVAT: number;
}

export interface SBIInvoice {
  invoiceNumber: string;
  dateOfIssue: string;
  claims: SBIClaim[];
  grandTotal: number;
}

export interface WIPEntry {
  roNumber: string;
  serviceAdvisor: string;
  dateCreated: string;
  customerName: string;
  invoiceTo: string;
  jobStatus: string;
  jobType: string;
  vinNumber: string;
  engineNumber: string;
  registrationNumber: string;
  daysOutstanding: number;
  comment: string;
}

export interface ReportData {
  ageAnalysisClaims: AgeAnalysisClaim[];
  wipEntries: WIPEntry[];
  sbiInvoices: SBIInvoice[];
  generatedOn: string;
  generatedBy: string;
  dmsRawLines?: string[][];
}

export type AppStep = 'upload' | 'review' | 'download';
