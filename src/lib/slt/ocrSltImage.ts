import { parseSltText, type ParsedSltRow } from "./parseSltText";

/**
 * Run Tesseract.js OCR on an image blob in the browser, then parse the text
 * with the regular SLT text parser. Tesseract is dynamically imported so it
 * only ships when the user actually pastes a screenshot.
 */
export async function ocrSltImage(
  source: Blob | string,
  onProgress?: (pct: number) => void,
): Promise<{ text: string; rows: ParsedSltRow[] }> {
  const { default: Tesseract } = await import("tesseract.js");
  const result = await Tesseract.recognize(source as any, "eng", {
    logger: (m: any) => {
      if (onProgress && m.status === "recognizing text") onProgress(Math.round(m.progress * 100));
    },
  });
  const text = result.data.text || "";
  return { text, rows: parseSltText(text) };
}