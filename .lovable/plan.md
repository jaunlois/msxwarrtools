## Plan

Two new features, both client-side, persisted in `localStorage`. AI-powered extraction uses Lovable AI Gateway (via a tiny edge function) so screenshots can be OCR'd without exposing keys.

---

### 1. Bulk SLT Import (paste text + screenshot OCR)

**New page** `src/pages/SLTImport.tsx` (route `/slt/import`, nav entry under SLT Lookup)

Two-tab card:
- **Paste text** — `<Textarea>` accepting tab/space/pipe-separated rows from Ford PTS. Parser `src/lib/slt/parseSltText.ts` detects op-code patterns (`\b\d{2}-\d{2}[A-Z]?\b` or `MT-...`), description, time, and section.
- **Paste screenshot** — paste-from-clipboard `onPaste` handler captures `image/*`, sends base64 to new edge function `extract-slt-from-image` which calls `google/gemini-3-flash-preview` with a strict JSON schema (`{ rows: [{opCode, description, time, section }] }`). Image never persists server-side.

Both feed into a shared **Review table** (editable cells) → user clicks **Merge into SLT dataset** → entries written to `localStorage` key `slt-custom-entries` (deduped by opCode+section).

**Loader change** `src/data/slt-data.ts`: export a `getSltData()` helper that merges baked-in data with `localStorage` overrides. Update `SLTLookup.tsx` (and Overlap Checker) to call this helper.

Manage panel on the same page: list custom entries, delete row, export/import JSON, clear-all.

---

### 2. OWS Claim Learning Library + Auto-suggest

**New page** `src/pages/ClaimLibrary.tsx` (route `/claim-library`, nav entry under Claim Processor)

- Paste OWS claim text → new parser `src/lib/claim-library/parseOwsText.ts` extracts `{ vin, model, ccc, customerConcern, causalPart, laborOps: [], parts: [], notes }`.
- Saved record stored in `localStorage` key `claim-library-v1` with id + timestamp.
- List/search/delete UI; export/import JSON for backup or sharing between devices.
- **Auto-save toggle**: when ON, every COR generated in Claim Processor is silently appended to the library.

**Suggestion engine** `src/lib/claim-library/suggest.ts`:
- Input: `{ ccc?, customerConcern?, causalPart?, model? }` from current Claim Processor state.
- Scores past claims by weighted matches (CCC = 3pts, causal part = 3pts, model = 1pt, fuzzy concern text = 1pt).
- Returns top 5 with aggregated unique labor ops + parts and "used in N similar claims" badge.

**Claim Processor integration** `src/pages/ClaimProcessor.tsx`:
- New **Suggested from past claims** panel below the customer-concern section.
- Each suggested labor op / part has an **Add** button that injects it into the current claim's repair lines (reusing existing add-row handlers).
- Non-intrusive — collapsed by default if no matches scored above threshold.

---

### Backend bit (only for screenshot OCR)

One Supabase edge function `extract-slt-from-image` using Lovable AI Gateway. Requires enabling Lovable Cloud (one-click). Keeps `LOVABLE_API_KEY` server-side. Returns structured JSON via AI SDK `Output.object`. CORS enabled, `verify_jwt = false`.

Text parsing for SLT and OWS stays 100% in-browser — no backend round-trip.

---

### Files to add / edit

**New**
- `src/pages/SLTImport.tsx`
- `src/pages/ClaimLibrary.tsx`
- `src/components/slt/SltPasteText.tsx`
- `src/components/slt/SltPasteImage.tsx`
- `src/components/slt/SltReviewTable.tsx`
- `src/components/claim/SuggestedFromHistory.tsx`
- `src/lib/slt/parseSltText.ts`
- `src/lib/slt/customSltStore.ts` (localStorage CRUD)
- `src/lib/claim-library/parseOwsText.ts`
- `src/lib/claim-library/store.ts`
- `src/lib/claim-library/suggest.ts`
- `supabase/functions/extract-slt-from-image/index.ts`

**Edit**
- `src/data/slt-data.ts` (add `getSltData()` merger)
- `src/pages/SLTLookup.tsx`, `src/pages/OverlapChecker.tsx` (use merged data)
- `src/pages/ClaimProcessor.tsx` (mount Suggested panel + auto-save hook)
- `src/App.tsx` (2 new routes)
- `src/components/AppSidebar.tsx` (2 new nav items)

### Out of scope
- Cross-device sync (browser-only as requested)
- ML model training — suggestion engine is a deterministic scoring function over your saved claims
- Editing baked-in SLT entries (custom entries layered on top only)
