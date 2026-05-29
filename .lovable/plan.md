# Enhance Bulk SLT Import

The current parser (`src/lib/slt/parseSltText.ts`) only handles one op-code per line and discards the parent operation description. PTS exports look like:

```
Weatherstrip - Front Door Glass Inside (21456/ 21457) - Replace
Double Cab,Single Cab....ONE 21456A 0.3 Double Cab,Single Cab....BOTH 21456AT 0.6
```

…where the header line carries the real description, and the next line packs **multiple** `qualifier + opCode + time` triples on a single line. The same shape comes out of the PTS HTML/PDF/MHTML exports (one table-row per qualifier, but they collapse into one text line on copy/PDF-extract).

## Changes

### 1. Rewrite `src/lib/slt/parseSltText.ts`
- Walk lines top-to-bottom, tracking the most recent **operation header** (a line that has no op-code/time and ends in something like `- Replace`, `- R&I`, `- Adjust`, etc., or contains `(NNNN/ NNNN)` part-code groups).
- For each non-header line, repeatedly match the pattern `((qualifier text)?\s+OPCODE\s+TIME)` across the whole line — produces one `ParsedSltRow` per match.
- Description = `"{parent header} — {qualifier}"` (qualifier cleaned of leading dots/whitespace, e.g. `Double Cab,Single Cab · ONE`). Fallback to parent header only when no qualifier text is present (e.g. single-variant ops like `Tyre- Replace - Two   1007ABA  0.9`).
- Also handle the simple single-line case still in use (`opcode<TAB>desc<TAB>time`) so existing pastes keep working.
- Keep `inferSection` but also accept a section banner line like `Section: Wheels, Bearings And Hubs (0000 - 1999)` to set the default section for subsequent rows.

### 2. Add PDF / HTML / MHTML upload tab
New file `src/lib/slt/extractSltDocument.ts`:
- `.pdf` → use existing `pdfjs-dist` (mirror `src/lib/report/parsePDF.ts` setup) to pull text per page, join with newlines, feed to `parseSltText`.
- `.html` / `.mhtml` → read as text, decode quoted-printable if MHTML, strip tags with `DOMParser`, preserve row breaks by inserting `\n` before block elements, feed to `parseSltText`.

Update `src/pages/SLTImport.tsx`:
- Add a third tab "Upload PDF / HTML" alongside Paste Text and Paste Screenshot.
- Accept `.pdf,.html,.htm,.mhtml` via file input + drag/drop. Show a small spinner while parsing, then drop results into the same review table.

### 3. Review table tweak
- Show a `notes` column / tooltip when the qualifier is preserved separately so the user can spot multi-variant groupings (optional — falls out naturally if we store qualifier in description).

## Out of scope
- No changes to the saved-entry storage format (`CustomSltEntry`) — same shape, just better-populated `description`.
- No backend/Cloud changes.

## Technical notes
- Regex sketch for variant extraction:
  `/([A-Za-z0-9 ,/&().-]*?)\s*([A-Z]{0,2}\d{3,4}[A-Z]{0,4}\d{0,2})\s+(\d{1,2}\.\d)/g`
  Run with `matchAll`, trim leading `.`/whitespace from group 1.
- Header detection: line has no op-code match AND (ends with `- Replace|R&I|R & I|Adjust|Inspect|Check|Bleed|Align|Service|Test|Clean|Diagnose` OR contains `(\d{3,5}[/ ]`).
- MHTML quoted-printable decode: simple `replace(/=\r?\n/g, '').replace(/=([0-9A-F]{2})/g, (_,h)=>String.fromCharCode(parseInt(h,16)))`.
