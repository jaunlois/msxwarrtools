import { getLibrary } from "./store";
import type { ClaimLibraryRecord, LibraryLaborOp, LibraryPart } from "./types";

export interface SuggestionInput {
  ccc?: string;
  customerConcern?: string;
  causalPart?: string;
  model?: string;
}

export interface SuggestionResult {
  laborOps: (LibraryLaborOp & { count: number })[];
  parts: (LibraryPart & { count: number })[];
  matches: { record: ClaimLibraryRecord; score: number }[];
}

function tokens(s?: string): Set<string> {
  if (!s) return new Set();
  return new Set(s.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length >= 4));
}

function overlap(a: Set<string>, b: Set<string>): number {
  let n = 0;
  for (const t of a) if (b.has(t)) n++;
  return n;
}

export function suggestFromLibrary(input: SuggestionInput, top = 5): SuggestionResult {
  const lib = getLibrary();
  const inConcern = tokens(input.customerConcern);

  const scored = lib
    .map((rec) => {
      let score = 0;
      if (input.ccc && rec.ccc && rec.ccc.toLowerCase() === input.ccc.toLowerCase()) score += 3;
      if (input.causalPart && rec.causalPart && rec.causalPart.toLowerCase() === input.causalPart.toLowerCase()) score += 3;
      if (input.model && rec.model && rec.model.toLowerCase().includes(input.model.toLowerCase().split(" ")[0])) score += 1;
      score += Math.min(3, overlap(inConcern, tokens(rec.customerConcern)));
      return { record: rec, score };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, top);

  const opMap = new Map<string, LibraryLaborOp & { count: number }>();
  const partMap = new Map<string, LibraryPart & { count: number }>();

  for (const { record } of scored) {
    for (const op of record.laborOps) {
      const e = opMap.get(op.opCode);
      if (e) e.count++;
      else opMap.set(op.opCode, { ...op, count: 1 });
    }
    for (const p of record.parts) {
      const e = partMap.get(p.code);
      if (e) e.count++;
      else partMap.set(p.code, { ...p, count: 1 });
    }
  }

  return {
    laborOps: Array.from(opMap.values()).sort((a, b) => b.count - a.count),
    parts: Array.from(partMap.values()).sort((a, b) => b.count - a.count),
    matches: scored,
  };
}