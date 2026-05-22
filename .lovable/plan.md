## Warranty Consultant (AI Chat)

A new **Warranty Consultant** page — an in-app chat that reads claim context, looks things up across your local datasets (SLT, CCC, parts coverage, factory warranty, claim library), and can write back to the local custom overrides when you tell it to.

Backend = one streaming edge function calling **Lovable AI** (`google/gemini-3-flash-preview` by default, switchable to `gpt-5-mini` for tougher reasoning). All "database" writes stay client-side in `localStorage` — same model as the existing Bulk SLT Import and Claim Library — so nothing leaves the browser except the chat turn itself. This requires **Lovable Cloud** to be enabled (one click) for the edge function + `LOVABLE_API_KEY`.

---

### What it can do

**Read tools (auto, no confirmation)**
- `lookup_slt(opCodeOrText, section?)` — searches merged SLT (baked-in + custom) and returns op-code, description, time, section.
- `lookup_ccc(query)` — searches CCC dataset by code or symptom text.
- `lookup_part_coverage(partNumber)` — Ford Protect parts-coverage lookup.
- `lookup_factory_warranty(category, kms, monthsInService)` — checks 4yr/120k limit + category rules.
- `search_claim_library(filter)` — finds similar past claims (reuses existing scoring).
- `check_repeat_repairs(vin, ccc?)` — reuses existing parser logic on stored warranty history if present.

**Write tools (require an inline "Apply" confirmation chip in the chat)**
- `upsert_slt_entry({section, opCode, description, time, notes?})` → writes to `slt-custom-entries-v1` via existing `addCustomEntries`.
- `upsert_ccc_entry({code, description, category?, notes?})` → new `ccc-custom-entries-v1` store + merge helper.
- `upsert_part_coverage({partNumber, plan, covered, notes?})` → new `parts-custom-overrides-v1`.
- `save_claim_to_library({...})` → existing `addLibraryRecord`.

Every write tool call is **previewed** in the chat with a Apply / Discard chip before anything is committed, so the model can't silently corrupt data.

---

### How you use it

1. Sidebar → **Warranty Consultant** (new entry, `Bot` icon, route `/consultant`).
2. Optional: click **Pull current claim** to inject the current Claim Processor state (VIN, model, CCC, concern, parts, ops) as system context.
3. Ask things like:
   - "Customer says AC not cold, 38k km, 14 months in service — what's covered and what SLTs apply?"
   - "Op code 12-01-01 took 1.8h on this one, update SLT."
   - "Add CCC F11 = AC compressor noise."
   - "Is part JK4Z-19E708-A covered under PremiumCare?"
4. Replies stream token-by-token, with collapsible **Tool calls** showing exactly what it read/wrote.

A **Pull current claim** button works by reading the same `localStorage` keys the Claim Processor writes, plus an optional cross-tab broadcast via `window.dispatchEvent` so an open Claim Processor tab can push state on demand.

---

### Technical details

**New files**
- `supabase/functions/warranty-consultant/index.ts` — streaming chat endpoint, tool-calling loop. System prompt encodes SA Ford rules (ZAR, R5000 parts cap, R764 default labor, 4yr/120k). Tools are declared as JSON-schema; the edge fn executes only the *read* tools server-side using a copy of the static datasets included as JSON imports, and forwards *write* tool calls back to the client as structured "pending action" SSE events.
- `src/pages/WarrantyConsultant.tsx` — chat UI (messages, streaming, tool-call cards, Apply/Discard chips), built on shadcn `Card`/`ScrollArea`/`Textarea`/`Button`.
- `src/lib/consultant/tools.ts` — client-side executors for write tools + shared schemas.
- `src/lib/consultant/clientLookups.ts` — fallback client-side read implementations (used when the user opts to keep everything browser-only — toggle in header).
- `src/lib/ccc/customCccStore.ts` + `src/lib/ccc/mergedCccData.ts` — mirrors the existing SLT custom-entries pattern.
- `src/lib/parts/customPartsStore.ts` + merger helper — same pattern for parts coverage overrides.

**Edited**
- `src/App.tsx` — add `/consultant` route.
- `src/components/AppSidebar.tsx` — add nav item (`Bot` from lucide).
- `src/pages/CCCCodes.tsx`, `src/pages/PartsCoverage.tsx` — use the new merged accessors so consultant edits show up there too.
- `src/pages/SLTLookup.tsx`, `src/pages/OverlapChecker.tsx` — already use merged SLT; no change.

**Model + streaming**
- Default `google/gemini-3-flash-preview`; user can switch to `openai/gpt-5-mini` from a header dropdown for harder reasoning.
- SSE streaming, line-by-line parsing per the AI gateway pattern; 429/402 surfaced as toasts.

**Safety**
- No raw SQL, no server-side writes — all mutations land in `localStorage` only after explicit Apply.
- Write tool payloads validated with Zod on the client before commit.
- Auto-save toggle (off by default) lets you skip the Apply chip for routine SLT/CCC upserts during heavy data entry.

---

### Out of scope
- Cross-device sync (still browser-only, matches project memory).
- Editing baked-in datasets in place — overrides only, exportable as JSON from each manage panel.
- Voice input.

---

### One question before I build

The consultant needs **Lovable Cloud** enabled (free, one click — provisions the edge function + API key). OK to enable it as part of this task?
