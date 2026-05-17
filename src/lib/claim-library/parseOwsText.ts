import type { ClaimLibraryRecord, LibraryLaborOp, LibraryPart } from "./types";

const VIN_RE = /\b([A-HJ-NPR-Z0-9]{17})\b/;
const CCC_RE = /\b(CCC[-:\s]?[A-Z0-9]{2,5}|[A-Z]\d{2,3}[A-Z]?)\b/;
const PART_RE = /\b([A-Z]{1,3}\d[A-Z0-9-]{4,})\b/g;
const OP_RE = /\b(\d{4}[A-Z]{1,4}\d{0,2})\b/g;
const TIME_RE = /\b(\d{1,2}\.\d{1,2})\b/;

export function parseOwsText(text: string): Omit<ClaimLibraryRecord, "id" | "savedAt"> {
  const norm = text.replace(/\r/g, "");
  const vin = norm.match(VIN_RE)?.[1];

  const ccc = pickAfter(norm, /(?:CCC|Customer\s*Concern\s*Code)[:\s-]*([A-Z0-9]{2,8})/i)
    ?? norm.match(CCC_RE)?.[1];

  const customerConcern = pickBlock(norm, /(?:Customer\s*Concern|Complaint)[:\s]+/i);
  const cause = pickBlock(norm, /(?:Cause|Diagnosis)[:\s]+/i);
  const correction = pickBlock(norm, /(?:Correction|Repair|Action\s*Taken)[:\s]+/i);
  const model = pickAfter(norm, /(?:Model|Vehicle)[:\s]+([A-Za-z0-9 .-]{2,40})/i);
  const causalPart = pickAfter(norm, /Causal\s*Part[:\s]+([A-Z0-9-]+)/i);

  const laborOps: LibraryLaborOp[] = [];
  const seenOps = new Set<string>();
  for (const line of norm.split("\n")) {
    for (const m of line.matchAll(OP_RE)) {
      const op = m[1].toUpperCase();
      if (seenOps.has(op)) continue;
      seenOps.add(op);
      const t = line.match(TIME_RE);
      const desc = line
        .replace(m[0], "")
        .replace(/\b\d{1,2}\.\d{1,2}\b/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();
      laborOps.push({ opCode: op, description: desc || op, hours: t ? parseFloat(t[1]) : 0 });
    }
  }

  const parts: LibraryPart[] = [];
  const seenParts = new Set<string>();
  for (const line of norm.split("\n")) {
    for (const m of line.matchAll(PART_RE)) {
      const code = m[1].toUpperCase();
      if (seenOps.has(code)) continue;
      if (seenParts.has(code)) continue;
      seenParts.add(code);
      const qtyMatch = line.match(/\b(\d{1,3})\s*(?:ea|each|pcs?|qty)?\b/i);
      const desc = line.replace(m[0], "").replace(/\s{2,}/g, " ").trim().slice(0, 80);
      parts.push({ code, description: desc || code, qty: qtyMatch ? Math.min(parseInt(qtyMatch[1]), 99) : 1 });
    }
  }

  return {
    source: "paste",
    vin,
    model,
    ccc,
    causalPart,
    customerConcern,
    cause,
    correction,
    laborOps,
    parts,
    notes: norm.length > 4000 ? undefined : norm,
  };
}

function pickAfter(text: string, re: RegExp): string | undefined {
  const m = text.match(re);
  return m?.[1]?.trim();
}

function pickBlock(text: string, header: RegExp): string | undefined {
  const m = text.match(header);
  if (!m) return undefined;
  const start = (m.index ?? 0) + m[0].length;
  const slice = text.slice(start, start + 400);
  const end = slice.search(/\n\s*(?:Cause|Correction|Customer|Concern|Notes|Parts|Labor|Causal|VIN|Model)[:\s]/i);
  return (end > 0 ? slice.slice(0, end) : slice).trim() || undefined;
}