

## Plan: Fix COR Excel Population & Add Download All Button

### Problem
The COR Excel is generated blank because the PDF quote parser (`parseQuote.ts`) uses rigid regex patterns that likely don't match the actual BSI quote text layout from `pdfjs-dist`. The text extraction concatenates characters without proper spacing, so patterns like `| 2 | 18124A |` never match. Additionally, there's no single "Download All" button that bundles everything (COR, AWA, OWS for each line + renamed uploaded files).

### Changes

**1. Rewrite `src/lib/claim-processor/parseQuote.ts` — robust text parsing**
- Replace brittle pipe-delimited regex with flexible multi-pass parsing:
  - First pass: find repair line headers by matching patterns like item numbers followed by op codes and WAR/CSH payment markers
  - Second pass: find parts by matching Ford part number patterns (e.g., `MB3Z18124CE`, `W721979S440`) with quantities and prices nearby
  - Handle text where spaces may be missing or extra due to PDF text extraction quirks
  - Use looser patterns for vehicle info (VIN as 17 alphanumeric chars, customer name near "Name" keyword, etc.)

**2. Update `src/pages/ClaimProcessor.tsx` — "Download All" with zip**
- Add `jszip` dependency for bundling all files into a single ZIP
- Replace the current `handleGenerateAll` (which triggers multiple individual downloads) with a function that:
  - Generates COR, AWA, OWS for each warranty line as blobs (not individual downloads)
  - Includes renamed uploaded files (Front Page, Back Page, Quote, OASIS, Warranty History)
  - Bundles everything into a ZIP named `{claimNumber}-Claim Pack.zip`
  - Single click downloads the ZIP
- Refactor `generateCOR`, `generateAWA`, `generateOWS` to return blobs instead of auto-saving (add a `returnBlob` option), so they can be collected for the ZIP

**3. Update generators to support blob return**
- `generateCOR.ts` — add optional parameter to return `{blob, fileName}` instead of calling `saveAs`
- `generateAWA.ts` — same
- `generateOWS.ts` — same

**4. Add `jszip` dependency**

### Files Modified
- `src/lib/claim-processor/parseQuote.ts` — rewrite parsing logic
- `src/lib/claim-processor/generateCOR.ts` — add blob return mode
- `src/lib/claim-processor/generateAWA.ts` — add blob return mode
- `src/lib/claim-processor/generateOWS.ts` — add blob return mode
- `src/pages/ClaimProcessor.tsx` — add ZIP download all, update generate handlers

