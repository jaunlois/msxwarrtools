import * as pdfjsLib from "pdfjs-dist";
import type { ParsedQuote, WarrantyRepairLine, ClaimPartLine, ClaimVehicleInfo } from "./types";

// Set worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

async function extractText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const lines: string[] = [];
    let lastY: number | null = null;
    for (const item of content.items) {
      if ("str" in item) {
        const y = Math.round((item as any).transform[5]);
        if (lastY !== null && Math.abs(y - lastY) > 3) {
          lines.push("\n");
        }
        lines.push(item.str);
        lastY = y;
      }
    }
    fullText += lines.join("") + "\n---PAGE---\n";
  }
  return fullText;
}

function cleanPrice(s: string): number {
  // "R1 555.50" or "R 139.98" or "1555.50"
  const cleaned = s.replace(/[R\s]/g, "").replace(/,/g, "");
  return parseFloat(cleaned) || 0;
}

export async function parseQuote(file: File): Promise<ParsedQuote> {
  const text = await extractText(file);
  const lines = text.split("\n");

  // Extract BSI number
  let bsiJobcardNo = "";
  let roNumber = "";
  let date = "";
  let serviceConsultant = "";
  let dealerName = "";
  let dealerPhone = "";
  let dealerAddress = "";

  const vehicle: ClaimVehicleInfo = {
    customerName: "",
    company: "",
    vin: "",
    regNo: "",
    engineNo: "",
    vehicleModel: "",
    modelCode: "",
    warrantyStartDate: "",
    kilometers: "",
    deliveryDate: "",
    phone: "",
    email: "",
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // BSI Jobcard No
    const bsiMatch = trimmed.match(/BSI\s*Jobcard\s*No\.?\s*:?\s*(B-?\d+)/i);
    if (bsiMatch) bsiJobcardNo = bsiMatch[1];

    // Job Card No / RO
    const roMatch = trimmed.match(/Job\s*Card\s*No\.?\s*:?\s*(\w+)/i);
    if (roMatch && !roNumber) roNumber = roMatch[1];

    // Date
    const dateMatch = trimmed.match(/^Date:\s*(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) date = dateMatch[1];

    // Service Consultant
    const scMatch = trimmed.match(/Service\s*Consultant:\s*(.+?)(?:\s{2,}|$)/i);
    if (scMatch) serviceConsultant = scMatch[1].trim();

    // Customer info
    const firstNameMatch = trimmed.match(/First\s*Name\s*:\s*(.+)/i);
    if (firstNameMatch) vehicle.customerName = firstNameMatch[1].trim();
    const surnameMatch = trimmed.match(/Surname\s*:\s*(.+)/i);
    if (surnameMatch) vehicle.customerName = vehicle.customerName ? `${vehicle.customerName} ${surnameMatch[1].trim()}` : surnameMatch[1].trim();

    const phoneMatch = trimmed.match(/Telephone\s*Mobile\s*:?\s*(\d+)/i);
    if (phoneMatch) vehicle.phone = phoneMatch[1];

    const emailMatch = trimmed.match(/E-mail\s*:\s*(\S+@\S+)/i);
    if (emailMatch) vehicle.email = emailMatch[1];

    // Vehicle info
    const modelMatch = trimmed.match(/Model\s*Code\s*:\s*(.+)/i);
    if (modelMatch) vehicle.modelCode = modelMatch[1].trim();

    const vinMatch = trimmed.match(/VIN\s*:\s*([A-Z0-9]{17})/i);
    if (vinMatch) vehicle.vin = vinMatch[1];

    const engineMatch = trimmed.match(/Engine\s*No\.?\s*:\s*(\S+)/i);
    if (engineMatch) vehicle.engineNo = engineMatch[1];

    const regMatch = trimmed.match(/Reg\s*No\.?\s*:\s*(\S+)/i);
    if (regMatch) vehicle.regNo = regMatch[1];

    const mileageMatch = trimmed.match(/Mileage.*?:\s*(\d+)/i);
    if (mileageMatch) vehicle.kilometers = mileageMatch[1];

    // Dealer info
    if (trimmed.match(/Ford\s+\w+/i) && trimmed.match(/Tel/i)) {
      const dMatch = trimmed.match(/(.+?)\s+Tel\.?\s*:?\s*(\d+)/i);
      if (dMatch) {
        dealerName = dMatch[1].trim();
        dealerPhone = dMatch[2];
      }
    }
  }

  // Parse repair lines - look for item patterns
  const repairLines: WarrantyRepairLine[] = [];
  let currentLine: WarrantyRepairLine | null = null;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    // Match item line: "| 2 | 18124A | Shock Absorber Front... | WAR | ..."
    // Or simpler patterns from raw text
    const itemMatch = trimmed.match(/^\|?\s*(\d+)\s*\|?\s*([\w\/\+\s]*?)\s*\|?\s*(.+?)\s*\|?\s*(WAR|CSH)\s*\|/i);
    if (itemMatch) {
      if (currentLine) repairLines.push(currentLine);
      
      const opCode = itemMatch[2].trim();
      const desc = itemMatch[3].trim();
      const payMethod = itemMatch[4].trim();
      
      // Try to get hours and amount from the rest of the line
      const rest = trimmed.substring(trimmed.indexOf(payMethod) + payMethod.length);
      const nums = rest.match(/[\d.]+/g) || [];
      const hours = parseFloat(nums[0]) || 0;
      const amount = cleanPrice(nums[1] || "0");

      currentLine = {
        itemNumber: parseInt(itemMatch[1]),
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

    // Match part line within current item
    if (currentLine) {
      // Part: "| | MB3Z18124CE | KIT SHOCK ABSORBER | | 2026-03-27 | 1555.50 | | R1 555.50 |"
      const partMatch = trimmed.match(/^\|?\s*\|?\s*([A-Z0-9]{5,})\s*\|?\s*(.+?)\s*\|?\s*(?:\|[^|]*){0,2}\s*(\d+)\s*\|?\s*([\d,.]+)\s*\|/i);
      if (partMatch) {
        currentLine.parts.push({
          code: partMatch[1],
          description: partMatch[2].trim(),
          qty: parseInt(partMatch[3]) || 1,
          unitPrice: cleanPrice(partMatch[4]),
        });
        continue;
      }

      // Also try simpler part pattern
      const simplePart = trimmed.match(/([A-Z0-9]{6,})\s+(.+?)\s+(\d{4}-\d{2}-\d{2})?\s*(\d+)\s+([\d,.]+)/i);
      if (simplePart && !trimmed.match(/^(Sub|Vat|Total)/i)) {
        currentLine.parts.push({
          code: simplePart[1],
          description: simplePart[2].trim(),
          qty: parseInt(simplePart[4]) || 1,
          unitPrice: cleanPrice(simplePart[5]),
        });
        continue;
      }

      // Sub total line
      const subMatch = trimmed.match(/Sub:\s*R?\s*([\d,. ]+)/i);
      if (subMatch) {
        currentLine.subTotal = cleanPrice(subMatch[1]);
      }
      const vatMatch = trimmed.match(/Vat:\s*R?\s*([\d,. ]+)/i);
      if (vatMatch) {
        currentLine.vatAmount = cleanPrice(vatMatch[1]);
      }
      const totalMatch = trimmed.match(/^Total:\s*R?\s*([\d,. ]+)/i);
      if (totalMatch) {
        currentLine.total = cleanPrice(totalMatch[1]);
      }
    }
  }
  if (currentLine) repairLines.push(currentLine);

  const allLines = [...repairLines];
  const warrantyLines = repairLines.filter(l => l.paymentMethod === "WAR");

  if (vehicle.modelCode) {
    vehicle.vehicleModel = vehicle.modelCode;
  }

  return {
    bsiJobcardNo,
    roNumber,
    date,
    serviceConsultant,
    vehicle,
    repairLines: warrantyLines,
    allLines,
    dealerName,
    dealerAddress,
    dealerPhone,
  };
}
