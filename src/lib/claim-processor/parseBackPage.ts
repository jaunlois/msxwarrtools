import * as pdfjsLib from "pdfjs-dist";
import type { ParsedBackPage } from "./types";

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

export async function parseBackPage(file: File): Promise<ParsedBackPage> {
  const text = await extractText(file);
  const result: ParsedBackPage = { lines: [] };

  // Back pages typically have technician write-ups with complaint/cause/correction
  // Try to extract structured sections
  const sections = text.split(/(?:Line|Item|Operation)\s*#?\s*(\d+)/i);
  
  if (sections.length > 1) {
    for (let i = 1; i < sections.length; i += 2) {
      const lineNum = parseInt(sections[i]);
      const content = sections[i + 1] || "";
      
      const complaint = extractSection(content, "complaint") || extractSection(content, "customer states") || "";
      const cause = extractSection(content, "cause") || extractSection(content, "inspection found") || "";
      const correction = extractSection(content, "correction") || extractSection(content, "repair") || "";
      const techMatch = content.match(/(?:Tech(?:nician)?|Foreman)\s*:?\s*([A-Za-z\s]+?)(?:\.|:|,)/i);

      result.lines.push({
        lineNumber: lineNum,
        complaint: complaint.trim(),
        cause: cause.trim(),
        correction: correction.trim(),
        technicianName: techMatch ? techMatch[1].trim() : "",
      });
    }
  }

  // If no structured sections found, treat entire text as single line
  if (result.lines.length === 0) {
    const complaint = extractSection(text, "complaint") || extractSection(text, "customer states") || "";
    const cause = extractSection(text, "cause") || extractSection(text, "inspection") || text.substring(0, 500);
    const correction = extractSection(text, "correction") || extractSection(text, "repair") || "";
    
    result.lines.push({
      lineNumber: 1,
      complaint: complaint.trim(),
      cause: cause.trim(),
      correction: correction.trim(),
      technicianName: "",
    });
  }

  return result;
}

function extractSection(text: string, keyword: string): string {
  const regex = new RegExp(`${keyword}\\s*:?\\s*(.+?)(?=(?:cause|correction|complaint|repair|$))`, "is");
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}
