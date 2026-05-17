export interface LibraryLaborOp {
  opCode: string;
  description: string;
  hours: number;
}

export interface LibraryPart {
  code: string;
  description: string;
  qty: number;
}

export interface ClaimLibraryRecord {
  id: string;
  savedAt: number;
  source: "paste" | "claim-processor";
  vin?: string;
  model?: string;
  ccc?: string;
  causalPart?: string;
  customerConcern?: string;
  cause?: string;
  correction?: string;
  laborOps: LibraryLaborOp[];
  parts: LibraryPart[];
  notes?: string;
}