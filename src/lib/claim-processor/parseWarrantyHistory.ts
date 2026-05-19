import * as pdfjsLib from "pdfjs-dist";
import type { ParsedWarrantyHistory, WarrantyHistoryEntry, RepeatRepairWarning, WarrantyRepairLine } from "./types";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

async function extractText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    for (const item of content.items) {
      if ("str" in item) text += item.str + " ";
    }
    text += "\n";
  }
  return text;
}

export async function parseWarrantyHistory(file: File): Promise<ParsedWarrantyHistory> {
  const text = await extractText(file);
  
  const result: ParsedWarrantyHistory = {
    vin: "",
    warrantyStartDate: "",
    sellingDealer: "",
    entries: [],
  };

  // VIN
  const vinMatch = text.match(/VIN:\s*([A-Z0-9]{17})/i);
  if (vinMatch) result.vin = vinMatch[1];

  // Warranty Start Date
  const wsdMatch = text.match(/Warranty\s*Start\s*Date:\s*([\d\w\-]+)/i);
  if (wsdMatch) result.warrantyStartDate = wsdMatch[1];

  // Selling Dealer
  const sdMatch = text.match(/Selling\s*Dealer:\s*(\d+)/i);
  if (sdMatch) result.sellingDealer = sdMatch[1];

  // Parse entries - look for "Details XXXXXXX" pattern
  const detailsRegex = /Details\s+(\d+)\s+(\S+)\s+(\d+)\s+([\d.]+)\s+(.+?)\s+(\d+)?\s+([\d\-A-Za-z]+)?\s+(\w*)\s+([*\w]*)\s+(\w*)\s+(\w+)/g;
  let match;
  
  // Simpler approach: split by "Details" and parse each
  const blocks = text.split(/Details\s+/i);
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const entry: WarrantyHistoryEntry = {
      claimKey: "",
      trxCode: "",
      timeInService: 0,
      laborHours: 0,
      dealership: "",
      distance: "",
      repairDate: "",
      partPrefix: "",
      partBase: "",
      partSuffix: "",
      docNumber: "",
      customerComments: "",
      techComments: "",
    };

    // First line has the claim details
    const firstLine = block.split("\n")[0] || block.substring(0, 200);
    const numbers = firstLine.match(/(\d+)/g) || [];
    if (numbers.length > 0) entry.claimKey = numbers[0];

    const trxMatch = block.match(/^\d+\s+(\S+)/);
    if (trxMatch) entry.trxCode = trxMatch[1];

    // Part info
    const partMatch = block.match(/(\w+)\s+([\d\w]+)\s+(\w*)\s+(B?\d+|RO\d+)/);
    if (partMatch) {
      entry.partPrefix = partMatch[1];
      entry.partBase = partMatch[2];
      entry.partSuffix = partMatch[3];
      entry.docNumber = partMatch[4];
    }

    // Customer/Tech comments
    const custMatch = block.match(/Customer\s+(?:Comments?\s*:?\s*)?(.+?)(?=Tech|$)/is);
    if (custMatch) entry.customerComments = custMatch[1].trim();

    const techMatch = block.match(/Tech\s*Comments?\s*:?\s*(.+?)(?=Details|$)/is);
    if (techMatch) entry.techComments = techMatch[1].trim();

    // Dealership
    const dealerMatch = block.match(/(MMG\s*FORD|PARK\s*FORD)(?:\s+\w+)*/i);
    if (dealerMatch) entry.dealership = dealerMatch[0].trim();

    // Repair date
    const dateMatch = block.match(/(\d{2}-[A-Z]{3}-\d{4})/i);
    if (dateMatch) entry.repairDate = dateMatch[1];

    result.entries.push(entry);
  }

  return result;
}

export function checkRepeatRepairs(
  warrantyLines: WarrantyRepairLine[],
  history: ParsedWarrantyHistory
): RepeatRepairWarning[] {
  const warnings: RepeatRepairWarning[] = [];

  for (const line of warrantyLines) {
    // Check if any parts in this line have been replaced before
    for (const part of line.parts) {
      const partBase = part.code.replace(/^[A-Z]{2,4}/, "").replace(/[A-Z]+$/, "");
      
      for (const entry of history.entries) {
        // Match on part base number
        if (entry.partBase && partBase.includes(entry.partBase)) {
          warnings.push({
            currentLine: line,
            previousEntry: entry,
            reason: `Part ${part.code} (base: ${partBase}) was previously replaced on ${entry.repairDate || "unknown date"} at ${entry.dealership || "unknown dealer"} (Doc: ${entry.docNumber})`,
          });
        }

        // Match on similar operation description
        const descWords = line.operationDescription.toLowerCase().split(/\s+/);
        const histWords = (entry.customerComments + " " + entry.techComments).toLowerCase();
        const matchCount = descWords.filter(w => w.length > 3 && histWords.includes(w)).length;
        if (matchCount >= 3 && !warnings.find(w => w.previousEntry.claimKey === entry.claimKey && w.currentLine.itemNumber === line.itemNumber)) {
          warnings.push({
            currentLine: line,
            previousEntry: entry,
            reason: `Similar repair description found in history: "${entry.customerComments.substring(0, 80)}..." (Doc: ${entry.docNumber})`,
          });
        }
      }
    }
  }

  return warnings;
}
