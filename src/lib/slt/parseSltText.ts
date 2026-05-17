export interface ParsedSltRow {
  opCode: string;
  description: string;
  time: number;
  section: string;
  notes?: string;
}

const OP_CODE_RE = /\b([A-Z]{0,2}\d{3,4}[A-Z]{0,4}\d{0,2})\b/;
const TIME_RE = /\b(\d{1,2}\.\d{1,2})\b/;

function inferSection(opCode: string): string {
  // Ford SLT op codes start with 4-digit numeric base. 0000-1999 = 01, 2000-3999 = 02 etc.
  const m = opCode.match(/(\d{3,4})/);
  if (!m) return "00";
  const n = parseInt(m[1], 10);
  const sectionNum = Math.floor(n / 2000) + 1;
  return sectionNum.toString().padStart(2, "0");
}

/**
 * Parse pasted SLT rows. Accepts tab-, pipe-, multi-space- or comma-separated text.
 * Each row should contain an op code, description, and time (hours).
 */
export function parseSltText(text: string, defaultSection = ""): ParsedSltRow[] {
  const rows: ParsedSltRow[] = [];
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 2);

  for (const line of lines) {
    // Skip obvious headers
    if (/^(op\s*code|description|time|hours|section)\b/i.test(line)) continue;

    const opMatch = line.match(OP_CODE_RE);
    if (!opMatch) continue;
    const opCode = opMatch[1].toUpperCase();

    // Time = last decimal number on the line (avoid grabbing part of op code)
    const timeMatches = [...line.matchAll(/\b(\d{1,2}\.\d{1,2})\b/g)];
    const time = timeMatches.length ? parseFloat(timeMatches[timeMatches.length - 1][1]) : 0;

    // Description = everything between op code and time
    let desc = line
      .replace(opMatch[0], "")
      .replace(/\b\d{1,2}\.\d{1,2}\b/g, "")
      .replace(/[\t|]+/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();

    rows.push({
      opCode,
      description: desc || opCode,
      time,
      section: defaultSection || inferSection(opCode),
    });
  }
  return rows;
}