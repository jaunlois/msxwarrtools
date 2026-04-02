import * as pdfjsLib from "pdfjs-dist";
import type { ParsedQuote, WarrantyRepairLine, ClaimPartLine, ClaimVehicleInfo } from "./types";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface TextItem {
  str: string;
  x: number;
  y: number;
}

async function extractTextItems(file: File): Promise<{ items: TextItem[]; lines: string[] }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const allItems: TextItem[] = [];
  const allLines: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    let currentLine = "";
    let lastY: number | null = null;

    for (const item of content.items) {
      if ("str" in item) {
        const t = item as any;
        const x = Math.round(t.transform[4]);
        const y = Math.round(t.transform[5]);

        if (lastY !== null && Math.abs(y - lastY) > 3) {
          if (currentLine.trim()) allLines.push(currentLine.trim());
          currentLine = "";
        }
        // Add space if there's a gap
        if (currentLine && lastY !== null && Math.abs(y - lastY) <= 3) {
          const lastX = allItems.length > 0 ? allItems[allItems.length - 1].x + (allItems[allItems.length - 1].str.length * 4) : 0;
          if (x - lastX > 8) currentLine += " ";
        }
        currentLine += item.str;
        allItems.push({ str: item.str, x, y });
        lastY = y;
      }
    }
    if (currentLine.trim()) allLines.push(currentLine.trim());
    allLines.push("---PAGE---");
  }
  return { items: allItems, lines: allLines };
}

function cleanPrice(s: string): number {
  const cleaned = s.replace(/[R\s]/g, "").replace(/,/g, "");
  return parseFloat(cleaned) || 0;
}

export async function parseQuote(file: File): Promise<ParsedQuote> {
  const { lines } = await extractTextItems(file);
  const fullText = lines.join("\n");

  let bsiJobcardNo = "";
  let roNumber = "";
  let date = "";
  let serviceConsultant = "";
  let dealerName = "";
  let dealerPhone = "";
  let dealerAddress = "";

  const vehicle: ClaimVehicleInfo = {
    customerName: "", company: "", vin: "", regNo: "", engineNo: "",
    vehicleModel: "", modelCode: "", warrantyStartDate: "", kilometers: "",
    deliveryDate: "", phone: "", email: "",
  };

  // --- Pass 1: Extract header info from all lines ---
  for (const line of lines) {
    // BSI Jobcard No - flexible matching
    if (!bsiJobcardNo) {
      const bsiMatch = line.match(/B-?\d{4,}/);
      if (bsiMatch && (line.toLowerCase().includes("bsi") || line.toLowerCase().includes("jobcard") || line.toLowerCase().includes("job card"))) {
        bsiJobcardNo = bsiMatch[0];
      }
    }
    // Fallback: just find B-NNNNNNN pattern
    if (!bsiJobcardNo) {
      const bMatch = line.match(/\b(B-\d{5,})\b/);
      if (bMatch) bsiJobcardNo = bMatch[1];
    }

    // Job Card / RO number
    if (!roNumber) {
      const roMatch = line.match(/(?:Job\s*Card|RO)\s*(?:No\.?|Number|#)?\s*:?\s*(\w+)/i);
      if (roMatch) roNumber = roMatch[1];
    }

    // Date
    if (!date) {
      const dateMatch = line.match(/(\d{4}-\d{2}-\d{2})/);
      if (dateMatch && line.toLowerCase().includes("date")) date = dateMatch[1];
    }

    // Service Consultant
    if (!serviceConsultant) {
      const scMatch = line.match(/(?:Service\s*Consultant|Advisor)\s*:?\s*(.+?)(?:\s{2,}|$)/i);
      if (scMatch) serviceConsultant = scMatch[1].trim();
    }

    // VIN - 17 character alphanumeric
    if (!vehicle.vin) {
      const vinMatch = line.match(/\b([A-HJ-NPR-Z0-9]{17})\b/);
      if (vinMatch) vehicle.vin = vinMatch[1];
    }

    // Reg No
    if (!vehicle.regNo) {
      const regMatch = line.match(/Reg\.?\s*(?:No\.?|Number)?\s*:?\s*([A-Z]{2,3}\s*\d{2,3}\s*[A-Z]{2,3}\s*(?:GP|WC|KZN|EC|FS|MP|NW|LP|NC)?)/i);
      if (regMatch) vehicle.regNo = regMatch[1].trim();
    }

    // Customer name
    if (!vehicle.customerName) {
      const nameMatch = line.match(/(?:First\s*Name|Customer)\s*:?\s*(.+)/i);
      if (nameMatch) vehicle.customerName = nameMatch[1].trim();
    }
    if (vehicle.customerName && !vehicle.customerName.includes(" ")) {
      const surnameMatch = line.match(/Surname\s*:?\s*(.+)/i);
      if (surnameMatch) vehicle.customerName += " " + surnameMatch[1].trim();
    }

    // Phone
    if (!vehicle.phone) {
      const phoneMatch = line.match(/(?:Tel|Phone|Mobile)\s*:?\s*(\d[\d\s]{8,})/i);
      if (phoneMatch) vehicle.phone = phoneMatch[1].replace(/\s/g, "");
    }

    // Email
    if (!vehicle.email) {
      const emailMatch = line.match(/[\w.+-]+@[\w.-]+\.\w+/);
      if (emailMatch) vehicle.email = emailMatch[0];
    }

    // Model Code
    if (!vehicle.modelCode) {
      const modelMatch = line.match(/Model\s*(?:Code)?\s*:?\s*(.+)/i);
      if (modelMatch && !modelMatch[1].match(/^\s*$/)) vehicle.modelCode = modelMatch[1].trim();
    }

    // Engine No
    if (!vehicle.engineNo) {
      const engineMatch = line.match(/Engine\s*(?:No\.?|Number)\s*:?\s*(\S+)/i);
      if (engineMatch) vehicle.engineNo = engineMatch[1];
    }

    // Mileage/Kilometers
    if (!vehicle.kilometers) {
      const mileageMatch = line.match(/(?:Mileage|Kilometer|Odometer|KM)\s*:?\s*(\d[\d\s]*)/i);
      if (mileageMatch) vehicle.kilometers = mileageMatch[1].replace(/\s/g, "");
    }

    // Dealer name
    if (!dealerName && line.match(/Ford\s+\w+/i) && !line.match(/ford\s+part/i)) {
      const cleaned = line.replace(/Tel.*$/i, "").trim();
      if (cleaned.length > 3) dealerName = cleaned;
    }
  }

  // --- Pass 2: Find warranty repair lines ---
  // Look for patterns like: item# | opCode | description | WAR | hours | amount
  // BSI quotes use table rows. PDF text may merge columns.
  const repairLines: WarrantyRepairLine[] = [];
  let currentLine: WarrantyRepairLine | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match item line: number followed by op code and WAR/CSH
    // Flexible: "1 18124A Shock Absorber Front WAR 2.0 1528.00"
    // Or: "| 1 | 18124A | ... | WAR | ..."
    const stripped = line.replace(/\|/g, " ").replace(/\s+/g, " ").trim();

    // Pattern: starts with a number (item#), has WAR or CSH somewhere
    const warMatch = stripped.match(/^(\d{1,2})\s+(\S+)\s+(.+?)\s+(WAR|CSH)\s+([\d.]+)?\s*([\d,.]+)?/i);
    if (warMatch) {
      if (currentLine && currentLine.paymentMethod === "WAR") repairLines.push(currentLine);

      const itemNum = parseInt(warMatch[1]);
      const opCode = warMatch[2];
      const desc = warMatch[3].trim();
      const payMethod = warMatch[4].toUpperCase();
      const hours = parseFloat(warMatch[5]) || 0;
      const amount = cleanPrice(warMatch[6] || "0");

      currentLine = {
        itemNumber: itemNum,
        opCode,
        operationDescription: desc,
        paymentMethod: payMethod,
        labourHours: hours,
        labourAmount: amount,
        parts: [],
        subTotal: 0,
        vatAmount: 0,
        total: 0,
      };
      continue;
    }

    // Also try: line has WAR but different format
    if (!warMatch && /\bWAR\b/i.test(line) && /\d/.test(line)) {
      const parts = stripped.split(/\s+/);
      const warIdx = parts.findIndex(p => p.toUpperCase() === "WAR");
      if (warIdx > 1) {
        if (currentLine && currentLine.paymentMethod === "WAR") repairLines.push(currentLine);

        const itemNum = parseInt(parts[0]) || (repairLines.length + 1);
        const opCode = parts[1] || "";
        const desc = parts.slice(2, warIdx).join(" ");
        const afterWar = parts.slice(warIdx + 1);
        const hours = parseFloat(afterWar[0]) || 0;
        const amount = cleanPrice(afterWar[1] || "0");

        currentLine = {
          itemNumber: itemNum,
          opCode,
          operationDescription: desc,
          paymentMethod: "WAR",
          labourHours: hours,
          labourAmount: amount,
          parts: [],
          subTotal: 0,
          vatAmount: 0,
          total: 0,
        };
        continue;
      }
    }

    // Skip CSH lines
    if (/\bCSH\b/i.test(line) && /^\d/.test(stripped)) {
      if (currentLine && currentLine.paymentMethod === "WAR") repairLines.push(currentLine);
      currentLine = {
        itemNumber: 0, opCode: "", operationDescription: "", paymentMethod: "CSH",
        labourHours: 0, labourAmount: 0, parts: [], subTotal: 0, vatAmount: 0, total: 0,
      };
      continue;
    }

    // --- Pass 3: Find parts within current warranty line ---
    if (currentLine && currentLine.paymentMethod === "WAR") {
      // Ford part numbers: 2+ letters followed by digits and letters, min 6 chars
      // Examples: MB3Z18124CE, W721979S440, JB3Z18124B, E2GZ9C407H
      const partMatch = stripped.match(/\b([A-Z][A-Z0-9]{5,}[A-Z]?)\b/i);
      if (partMatch && !stripped.match(/^(Sub|Vat|Total|Grand)/i)) {
        const partCode = partMatch[1].toUpperCase();
        // Looks like a Ford part number (mix of letters and digits, 6+ chars)
        if (/[A-Z]/.test(partCode) && /\d/.test(partCode) && partCode.length >= 6) {
          // Extract description: text after part code, before numbers
          const afterCode = stripped.substring(stripped.indexOf(partCode) + partCode.length).trim();
          // Find all numbers in the rest of the line
          const numbers = afterCode.match(/[\d,]+\.?\d*/g) || [];
          // Last number is likely price, second-to-last could be qty
          const allNums = numbers.map(n => cleanPrice(n)).filter(n => n > 0);

          let qty = 1;
          let unitPrice = 0;
          if (allNums.length >= 2) {
            // If first number is small (1-99) it's likely qty
            if (allNums[0] < 100 && Number.isInteger(allNums[0])) {
              qty = allNums[0];
              unitPrice = allNums[allNums.length - 1];
            } else {
              unitPrice = allNums[allNums.length - 1];
            }
          } else if (allNums.length === 1) {
            unitPrice = allNums[0];
          }

          // Description: text between part code and first number
          let description = afterCode.replace(/[\d,.R]+/g, "").replace(/\|/g, "").trim();
          // Also check previous text on the line
          const beforeCode = stripped.substring(0, stripped.indexOf(partCode)).replace(/\|/g, "").trim();
          if (!description && beforeCode) {
            description = beforeCode.replace(/^\d+\s*/, "").trim();
          }

          if (partCode && unitPrice > 0) {
            currentLine.parts.push({ code: partCode, description, qty, unitPrice });
          }
          continue;
        }
      }

      // Sub/Vat/Total lines
      const subMatch = stripped.match(/Sub:?\s*R?\s*([\d,. ]+)/i);
      if (subMatch) currentLine.subTotal = cleanPrice(subMatch[1]);
      const vatMatch = stripped.match(/Vat:?\s*R?\s*([\d,. ]+)/i);
      if (vatMatch) currentLine.vatAmount = cleanPrice(vatMatch[1]);
      const totalMatch = stripped.match(/^Total:?\s*R?\s*([\d,. ]+)/i);
      if (totalMatch) currentLine.total = cleanPrice(totalMatch[1]);
    }
  }
  if (currentLine && currentLine.paymentMethod === "WAR") repairLines.push(currentLine);

  const warrantyLines = repairLines.filter(l => l.paymentMethod === "WAR" && (l.parts.length > 0 || l.labourHours > 0 || l.opCode));

  if (vehicle.modelCode && !vehicle.vehicleModel) {
    vehicle.vehicleModel = vehicle.modelCode;
  }

  return {
    bsiJobcardNo,
    roNumber,
    date,
    serviceConsultant,
    vehicle,
    repairLines: warrantyLines,
    allLines: repairLines,
    dealerName,
    dealerAddress,
    dealerPhone,
  };
}
