

## Plan: Warranty Claim Processor — Document Upload, Auto-Extract, Multi-Output Generator

### Overview

Transform the COR Generator into a comprehensive **Warranty Claim Processor** that accepts uploaded BSI documents (Front Page/Quote/Back Page/OASIS/Warranty History), auto-extracts claim data, identifies warranty vs cash lines, checks for repeat repairs, and generates multiple output files — each named with the BSI claim number (e.g. `B12281-Cost of Repair.xlsx`, `B12281-AWA.xlsx`).

### Key Features

1. **Document Upload & Auto-Parse** — Upload Front Page (PDF), Back Page (PDF), Quote (PDF), OASIS Report (PDF), Warranty History (PDF). Parser extracts: BSI claim number, RO number, VIN, customer name, vehicle model, mileage, warranty start date, engine number, reg number, warranty lines (ignoring CSH/cash lines), parts with codes/descriptions/quantities/prices, labor op codes and hours, technician comments (complaint/cause/correction).

2. **Paste-in Parts** — Replace the one-at-a-time parts input with a textarea that accepts pasted tab-delimited or comma-separated parts data (code, description, qty, unit price per line), auto-parsed into the parts table.

3. **SLT Labor Code Matching** — From the quote's operation codes (e.g. `18124A`, `4602AA`, `3010B+3010E`) and the back page tech write-up, automatically look up matching SLT labor codes from the existing `slt-data.ts` dataset.

4. **CCC Code Detection** — From the back page complaint text and quote descriptions, suggest matching Customer Concern Codes and Condition Codes from `ccc-data.ts`.

5. **Warranty History Check** — Parse warranty history PDF and flag any previous repairs with matching part prefixes or similar operation descriptions (repeat repair warning).

6. **Per-Line Output Generation** — Each warranty repair line on the quote generates its own set of files:
   - **COR Excel** — Matching the existing `Cost_of_Repair.xlsx` format exactly (with FOB, Mark Up, Parts Cap columns)
   - **AWA Excel** — Matching `AWA_FORM_MASTER_BETHLEHEM.xlsx` format exactly (3 sheets: form, service history, exclusions)
   - **OWS Claim PDF** — Matching the Ford OWS claim format (Claim Information header, Repair Order section, Comments, Parts/Labor/Misc tables, Repair Line SubTotal)

7. **File Naming** — All downloads named as `B{claimNumber}-{type}` e.g. `B12281-Cost of Repair.xlsx`, `B12281-AWA.xlsx`, `B12281-OWS Claim.pdf`. Uploaded files are also downloadable renamed to the claim.

### Files to Create/Modify

**New files:**
- `src/lib/claim-processor/parseQuote.ts` — Parse BSI quote PDF: extract warranty lines (payment method = WAR), parts per line, labor op codes, customer/vehicle info
- `src/lib/claim-processor/parseBackPage.ts` — Parse back page PDF: extract technician comments (complaint/cause/correction per line)
- `src/lib/claim-processor/parseFrontPage.ts` — Parse front page/jobcard PDF: extract BSI number, RO number
- `src/lib/claim-processor/parseOasis.ts` — Parse OASIS report: vehicle description, warranty dates, ESP coverage, outstanding FSAs
- `src/lib/claim-processor/parseWarrantyHistory.ts` — Parse warranty history: extract all previous claim records, check for repeat repairs
- `src/lib/claim-processor/matchSLT.ts` — Match operation codes against SLT data, suggest CCC codes
- `src/lib/claim-processor/types.ts` — Shared types for parsed claim data
- `src/lib/claim-processor/generateAWA.ts` — Generate AWA Excel matching the master template exactly
- `src/lib/claim-processor/generateOWS.ts` — Generate OWS claim matching the Ford format
- `src/pages/ClaimProcessor.tsx` — New full-page UI replacing the simple COR form

**Modified files:**
- `src/lib/cor-excel-export.ts` — Update COR format to match the uploaded template exactly (add FOB, Mark Up, Parts Cap columns; update layout)
- `src/App.tsx` — Update `/cor` route to use new ClaimProcessor page
- `src/components/AppSidebar.tsx` — Update nav label from "COR Generator" to "Claim Processor"
- `src/pages/Index.tsx` — Update dashboard card

### UI Flow

1. **Upload Zone** — Drop/select files: Quote, Back Page, Front Page, OASIS, Warranty History (all optional but Quote is primary)
2. **Auto-Extract** — On upload, parse PDFs and populate a review form with:
   - Vehicle/customer info (from quote + OASIS)
   - Detected warranty repair lines (ignoring cash lines)
   - Parts per line (with paste-in override)
   - Matched SLT labor codes and suggested CCC codes
   - Warranty history warnings (repeat repairs highlighted in red)
3. **Review & Edit** — User reviews/adjusts extracted data, selects CCC codes, edits tech write-up
4. **Generate** — Buttons to generate per warranty line: COR Excel, AWA Excel, OWS Claim. Also a "Download All" that zips everything.
5. **Renamed Downloads** — All uploaded files available for re-download with claim-number prefix naming

### Technical Notes

- PDF parsing uses `pdfjs-dist` (already installed) for text extraction
- Excel generation uses `exceljs` (already installed)
- OWS PDF generation will use a simple HTML-to-download approach or construct via the existing PDF tools
- The COR Excel must match the uploaded template: PARTS table has columns (PARTS, Description, Qnt, FOB, Mark Up, Total) with the R5000 parts cap note; LABOR table has (Ser, Op. code, Lab Hours, Amount, TOTAL)
- AWA Excel must have 3 sheets matching the master: main form with loyalty questions (Yes/No), service history sheet, CLP exclusions sheet
- Cash lines (Payment Method = CSH) on the quote are filtered out automatically
- File naming extracts BSI number from quote (e.g. `B-0012281` becomes `B12281`)

