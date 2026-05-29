import { parseSltText, type ParsedSltRow } from "./parseSltText";

async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  // @ts-ignore - same pattern used in src/lib/report/parsePDF.ts
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const out: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    // Group items by approximate Y to preserve row breaks.
    const lines = new Map<number, string[]>();
    for (const item of content.items as any[]) {
      if (!("str" in item)) continue;
      const y = Math.round(item.transform?.[5] ?? 0);
      if (!lines.has(y)) lines.set(y, []);
      lines.get(y)!.push(item.str);
    }
    const ordered = [...lines.entries()].sort((a, b) => b[0] - a[0]);
    for (const [, parts] of ordered) out.push(parts.join(" "));
    out.push("");
  }
  return out.join("\n");
}

function decodeQuotedPrintable(input: string): string {
  return input
    .replace(/=\r?\n/g, "")
    .replace(/=([0-9A-Fa-f]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function htmlToText(html: string): string {
  // Insert newlines before block-level closers so rows survive textContent.
  const prepped = html
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/(tr|p|div|li|h[1-6])>/gi, "\n</$1>")
    .replace(/<\/(td|th)>/gi, " </$1>");

  if (typeof DOMParser !== "undefined") {
    const doc = new DOMParser().parseFromString(prepped, "text/html");
    return doc.body?.textContent ?? "";
  }
  return prepped.replace(/<[^>]+>/g, " ");
}

function mhtmlToText(raw: string): string {
  // Strip MIME headers, decode body, then HTML-to-text.
  const isQp = /Content-Transfer-Encoding:\s*quoted-printable/i.test(raw);
  const bodyStart = raw.search(/<!DOCTYPE|<html/i);
  const body = bodyStart >= 0 ? raw.slice(bodyStart) : raw;
  const decoded = isQp ? decodeQuotedPrintable(body) : body;
  return htmlToText(decoded);
}

export async function extractSltDocument(
  file: File,
): Promise<{ text: string; rows: ParsedSltRow[] }> {
  const name = file.name.toLowerCase();
  let text = "";

  if (name.endsWith(".pdf")) {
    text = await extractPdfText(await file.arrayBuffer());
  } else if (name.endsWith(".mhtml") || name.endsWith(".mht")) {
    text = mhtmlToText(await file.text());
  } else if (name.endsWith(".html") || name.endsWith(".htm")) {
    text = htmlToText(await file.text());
  } else {
    // Fallback: treat as plain text.
    text = await file.text();
  }

  return { text, rows: parseSltText(text) };
}