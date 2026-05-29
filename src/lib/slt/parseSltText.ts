export interface ParsedSltRow {
  opCode: string;
  description: string;
  time: number;
  section: string;
  notes?: string;
}

// Matches Ford op codes like 1007A, 1007AT, 21456ABA, TWC01, etc.
const OP_CODE_GLOBAL = /\b([A-Z]{0,3}\d{3,5}[A-Z]{0,4}\d{0,2})\b/g;
// qualifier (optional) + op code + time (e.g. "0.4", "1.8")
const VARIANT_RE = /([A-Za-z0-9 ,/&().+\-]*?)\s*\b([A-Z]{0,3}\d{3,5}[A-Z]{0,4}\d{0,2})\b\s+(\d{1,2}\.\d{1,2})(?!\d)/g;
const SECTION_BANNER_RE = /Section\s*:\s*([^()]+?)\s*\(\s*(\d{3,5})\s*-\s*(\d{3,5})\s*\)/i;
const HEADER_VERB_RE = /-\s*(Replace|R\s*&\s*I|R&I|Remove and Install or Replace|Adjust|Inspect|Check|Bleed|Align|Service|Test|Clean|Diagnose|Refinish|Repair|Reprogram|Recalibrate|Flash|Overhaul|Balance|Rotate|Lubricate|Drain (?:and|&) Refill)\s*$/i;
const PART_GROUP_RE = /\(\s*\d{3,5}(?:\s*\/\s*[A-Z0-9]{2,6})+\s*\)/;

function inferSection(opCode: string): string {
  // Ford SLT op codes start with 4-digit numeric base. 0000-1999 = 01, 2000-3999 = 02 etc.
  const m = opCode.match(/(\d{3,5})/);
  if (!m) return "00";
  const n = parseInt(m[1], 10);
  const sectionNum = Math.floor(n / 2000) + 1;
  return sectionNum.toString().padStart(2, "0");
}

function cleanQualifier(q: string): string {
  return q
    .replace(/^[\s.·,;:|\-]+/, "")
    .replace(/[\s.·,;:|\-]+$/, "")
    .replace(/\.{2,}/g, " · ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function isHeaderLine(line: string): boolean {
  if (HEADER_VERB_RE.test(line)) return true;
  if (PART_GROUP_RE.test(line) && !/\d\.\d/.test(line)) return true;
  return false;
}

function stripHeaderTail(header: string): string {
  // Remove trailing "- Remove and Install or Replace" verb if very long.
  return header.replace(/\s+/g, " ").trim();
}

/**
 * Parse pasted SLT rows. Handles three shapes:
 *  1. Tab/pipe separated single rows: "1007A\tTyre Replace\t0.4"
 *  2. PTS-style header lines followed by variant rows that contain multiple
 *     "qualifier opCode time" triples on one line.
 *  3. Section banner lines like "Section: Wheels, Bearings And Hubs (0000 - 1999)".
 */
export function parseSltText(text: string, defaultSection = ""): ParsedSltRow[] {
  const rows: ParsedSltRow[] = [];
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim())
    .filter((l) => l.length > 1);

  let currentHeader = "";
  let sectionFromBanner = "";

  for (const line of lines) {
    // Column-header noise like "Operation Description | Operation Number | Time"
    if (/^(operation\s+description|operation\s+number|description|op\s*code|time|hours)\b/i.test(line)) {
      continue;
    }

    // Section banner — sets default section for following rows.
    const sectionMatch = line.match(SECTION_BANNER_RE);
    if (sectionMatch) {
      const startNum = parseInt(sectionMatch[2], 10);
      sectionFromBanner = (Math.floor(startNum / 2000) + 1).toString().padStart(2, "0");
      continue;
    }

    const variantMatches = [...line.matchAll(VARIANT_RE)];
    const hasTime = /\d\.\d/.test(line);

    if (variantMatches.length === 0) {
      // Pure header / description line.
      if (isHeaderLine(line) || (!hasTime && line.length > 4)) {
        currentHeader = stripHeaderTail(line);
      }
      continue;
    }

    // Mixed line: text before first op-code can still be a header fragment.
    const firstStart = variantMatches[0].index ?? 0;
    const preamble = line.slice(0, firstStart).trim();
    if (preamble && isHeaderLine(preamble)) {
      currentHeader = stripHeaderTail(preamble);
    }

    for (const m of variantMatches) {
      const qualifierRaw = m[1] || "";
      const opCode = m[2].toUpperCase();
      const time = parseFloat(m[3]);
      const qualifier = cleanQualifier(qualifierRaw);

      let description = currentHeader;
      if (qualifier) {
        description = description ? `${description} — ${qualifier}` : qualifier;
      }
      if (!description) description = opCode;

      rows.push({
        opCode,
        description,
        time,
        section:
          defaultSection || sectionFromBanner || inferSection(opCode),
        notes: qualifier || undefined,
      });
    }
  }

  // De-dupe identical (opCode, description, time) entries.
  const seen = new Set<string>();
  return rows.filter((r) => {
    const key = `${r.opCode}|${r.description}|${r.time}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}