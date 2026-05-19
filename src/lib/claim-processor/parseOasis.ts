import * as pdfjsLib from "pdfjs-dist";
import type { ParsedOasis } from "./types";

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

export async function parseOasis(file: File): Promise<ParsedOasis> {
  const text = await extractText(file);

  const result: ParsedOasis = {
    vehicleDescription: "",
    versionSeries: "",
    bodyStyle: "",
    driveType: "",
    engine: "",
    transmission: "",
    fuelType: "",
    warrantyStartDate: "",
    buildDate: "",
    releaseDate: "",
    odometer: "",
    outstandingFSAs: [],
    espInfo: null,
    warrantyCoverageMessages: [],
  };

  const getField = (label: string): string => {
    const regex = new RegExp(`${label}\\s*:?\\s*(.+?)(?:\\s{2,}|\\n|$)`, "i");
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  };

  result.vehicleDescription = getField("VEHICLE DESCRIPTION");
  result.versionSeries = getField("VERSION/SERIES");
  result.bodyStyle = getField("BODY STYLE");
  result.driveType = getField("DRIVE TYPE");
  result.engine = getField("ENGINE");
  result.transmission = getField("TRANSMISSION");
  result.fuelType = getField("FUEL TYPE");
  result.warrantyStartDate = getField("WARRANTY START DATE");
  result.buildDate = getField("BUILD DATE");
  result.releaseDate = getField("RELEASE DATE");

  const odometerMatch = text.match(/Odometer:\s*([\d,]+)\s*Kilometers/i);
  if (odometerMatch) result.odometer = odometerMatch[1].replace(/,/g, "");

  // Outstanding FSAs
  const fsaSection = text.match(/OUTSTANDING FIELD SERVICE ACTIONS\s*([\s\S]*?)(?=WARNING|GENERAL|$)/i);
  if (fsaSection) {
    const fsaLines = fsaSection[1].trim().split("\n").filter(l => l.trim());
    result.outstandingFSAs = fsaLines;
  }

  // ESP info
  const espMatch = text.match(/(\d{4})\s*-\s*EXPIRED/i);
  if (espMatch) {
    result.espInfo = {
      contractNumber: espMatch[1],
      expirationDate: getField("EXPIRATION DATE"),
      distance: getField("DISTANCE"),
      deductible: getField("STANDARD DEDUCTIBLE"),
      status: "EXPIRED",
    };
  }

  return result;
}
