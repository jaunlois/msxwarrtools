/**
 * Parse a raw DMS Age Analysis text dump (pipe / tab / multi-space separated)
 * into rows for the DMS Screenshot sheet.
 */
export function parseDmsText(text: string): string[][] {
  const lines = text.split(/\r?\n/);
  const rows: string[][] = [];
  for (const line of lines) {
    if (!line.trim()) {
      rows.push([]);
      continue;
    }
    let cells: string[];
    if (line.includes('|')) {
      cells = line.split('|').map(c => c.trim());
    } else if (line.includes('\t')) {
      cells = line.split('\t').map(c => c.trim());
    } else if (/\s{2,}/.test(line)) {
      cells = line.split(/\s{2,}/).map(c => c.trim());
    } else {
      cells = [line.trim()];
    }
    // strip empty leading/trailing cells from pipe wrappers
    while (cells.length && cells[0] === '') cells.shift();
    while (cells.length && cells[cells.length - 1] === '') cells.pop();
    rows.push(cells);
  }
  return rows;
}