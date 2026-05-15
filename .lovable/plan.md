## Plan

### 1. Parts Coverage — add Premium Care (5th tier)
The uploaded `Ford_Protect_Coverage_1-2.xlsx` contains 5 sheets: WearCare (1,261), Powertrain (1,233), Extra Care (2,498), Premium Maintenance (6,051), **Premium Care (6,024)**. Currently `src/data/parts-data.ts` only has 4 columns.

- Regenerate `src/data/parts-data.ts` from the xlsx so each part has all 5 boolean flags and a unified description.
- Add `premiumCare: boolean` to the `PartCoverage` interface, to `PlanTier` type, to `planTierLabels`, and to `getHighestPlan` helper.
- Add a 5th "Premium Care" column in `src/pages/PartsCoverage.tsx` table + filter dropdown + badge color.

### 2. New page — Ford Factory Warranty Coverage (4yr/120k)
The PDF `Warranty_Coverage_Table_Final-2.pdf` lists ~150 components with Yes/No coverage, Limited Coverage time/distance, and Comments (e.g. "Brake Pads — 12 months or 15,000km, defects in factory materials covered to 15,000km").

- New file `src/data/factory-warranty.ts` with `{ item, covered: 'yes'|'no', limited?: string, comments?: string }[]` extracted from the PDF.
- New page `src/pages/FactoryWarranty.tsx` — searchable table with columns: Item · Covered (✓/✗ badge) · Limited Coverage · Comments. Reuses Parts Coverage layout/styling. **No** plan-tier filters (it's the basic NVLW only).
- Register route in `src/App.tsx` and add nav entry in `src/components/AppSidebar.tsx` (under Coverage section).

### 3. Weekly Report — 4th upload zone + paste support on all 4
- Add a 4th `DropZone` for **DMS Age Analysis TXT** (raw text dump like `28Jaun-Lois_ReportData.txt`). Accepts `.txt`. Stored in new `dmsTextFiles` state.
- Add a new parser `src/lib/report/parseDmsText.ts` that reads the pipe-delimited raw text and extracts `{ claimNo, roNumber, invoiceNo, invoiceDate, total, ageBuckets }` rows + the header (Run By, Date, Time).
- In `src/lib/report/generateExcel.ts`, replace the `DMS Screenshot` placeholder sheet with a real sheet generated from the parsed DMS text (header banner + tabular rows matching the source layout). Keep placeholder fallback if no TXT supplied.
- Add **paste-from-clipboard** to every drop zone:
  - New shared component `src/components/report/UploadOrPaste.tsx` wrapping each zone with a `Paste raw text` toggle that reveals a `<Textarea>` and "Save as virtual file" button. Pasted text becomes a synthetic `File` (via `new File([text], 'pasted-N.txt', { type: 'text/plain' })`) and is added to that section's file list.
  - For Excel sections (Age, WIP), the paste textarea expects the same kind of text dump as the TXT zone — parsing is delegated to a new text parser that mirrors `parseAgeAnalysisExcel` / `parseWIPExcel` columns.
- Update `handleProcess` to detect `.txt` files in any zone and route them to the new text parser.

### 4. Claim Processor — multi-line parts paste fix
Current bug in `src/components/claim/PasteExtractor.tsx`: `parseQuoteText` reads each input line then runs a single `partMatch` regex per line, but when the user pastes a parts list copied from a single Excel cell or with mixed delimiters it collapses into one part with a long description.

- Pre-split each line on additional delimiters: detect lines containing **multiple** Ford part-number patterns and split into separate parts. New helper `extractAllParts(line)` runs `String.matchAll(/\b([A-Z]{1,3}[A-Z0-9]{4,}[A-Z0-9])\b/g)` and slices the surrounding text per match for description/qty/price.
- When a single pasted block has no newlines but contains 2+ part numbers (very common when copied from BSI parts grid), split on the part-number boundaries before per-line parsing.
- Tab-separated branch: also handle multi-row paste where each row begins with a part code on a new logical line (split on `\r\n` then `\n` then on `;`).
- Add unit-style test by pasting a sample like `MB3Z18124CE Strut 1 1555.50 W721979S440 Bolt 4 22.30` — must produce 2 parts.

### Files touched
- `src/data/parts-data.ts` (regenerated, +1 field)
- `src/pages/PartsCoverage.tsx` (5th column)
- `src/data/factory-warranty.ts` (new)
- `src/pages/FactoryWarranty.tsx` (new)
- `src/App.tsx`, `src/components/AppSidebar.tsx` (route + nav)
- `src/pages/WeeklyReport.tsx` (4th zone, paste UI)
- `src/components/report/UploadOrPaste.tsx` (new)
- `src/lib/report/parseDmsText.ts` (new)
- `src/lib/report/generateExcel.ts` (real DMS sheet)
- `src/components/claim/PasteExtractor.tsx` (multi-part split)

### Out of scope
- OCR of the DMS screenshot image itself (TXT dump only).
- Editing the Factory Warranty list inline (read-only reference).
