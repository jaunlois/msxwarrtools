import * as pdfjsLib from "pdfjs-dist";
import type { ParsedFrontPage } from "./types";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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

export async function parseFrontPage(file: File): Promise<ParsedFrontPage> {
  const text = await extractText(file);
  
  const result: ParsedFrontPage = {
    bsiNumber: "",
    roNumber: "",
    customerName: "",
    vehicleModel: "",
    vin: "",
    regNo: "",
    engineNo: "",
    kilometers: "",
    warrantyStartDate: "",
    checkInDate: "",
    operations: [],
  };

  // BSI / Jobcard
  const bsiMatch = text.match(/(?:BSI|JOB\s*CARD)\s*(?:Jobcard\s*No\.?|#?)?\s*:?\s*(B-?\d+)/i);
  if (bsiMatch) result.bsiNumber = bsiMatch[1];

  const roMatch = text.match(/(?:RO|Repair\s*Order)\s*#?\s*:?\s*(\w+)/i);
  if (roMatch) result.roNumber = roMatch[1];

  // Customer
  const nameMatch = text.match(/(?:First\s*Name|Customer)\s*:?\s*([A-Za-z]+(?:\s+[A-Za-z]+)*)/i);
  if (nameMatch) result.customerName = nameMatch[1].trim();

  // Vehicle
  const vinMatch = text.match(/VIN\s*:?\s*([A-Z0-9]{17})/i);
  if (vinMatch) result.vin = vinMatch[1];

  const regMatch = text.match(/Reg\.?\s*No\.?\s*:?\s*([A-Z0-9]+)/i);
  if (regMatch) result.regNo = regMatch[1];

  const engineMatch = text.match(/Engine\s*No\.?\s*:?\s*(\S+)/i);
  if (engineMatch) result.engineNo = engineMatch[1];

  const kmMatch = text.match(/Kilometres?\s*:?\s*(\d+)/i);
  if (kmMatch) result.kilometers = kmMatch[1];

  const modelMatch = text.match(/Vehicle\s*(?:Type|Model)\s*:?\s*(.+?)(?:\s{2,}|\n)/i);
  if (modelMatch) result.vehicleModel = modelMatch[1].trim();

  const warStartMatch = text.match(/Warranty\s*Start\s*Date\s*:?\s*([\d\/\-]+)/i);
  if (warStartMatch) result.warrantyStartDate = warStartMatch[1];

  const checkInMatch = text.match(/Check-?in\s*Date.*?:?\s*([\d\/\-]+)/i);
  if (checkInMatch) result.checkInDate = checkInMatch[1];

  return result;
}
