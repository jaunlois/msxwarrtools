# OWS User Guide → App Improvements

The Ford ZAF OWS Claiming User Guide v10.5 documents the exact field rules, claim types, sub-codes, exception codes and MT/labour rules the warranty admin must satisfy before a claim will pass OWS pre-validation. Today our Claim Processor extracts data and generates an OWS HTML, but it does **not** model OWS's own validation rules. This plan adds an OWS rules layer so claims are pre-validated locally before the admin keys them into OWS.

## Suggested improvements (ranked)

### 1. OWS Pre-Validation engine (highest value)
Mirror the guide's "PreValidation Exceptions / Field Validation Errors / Exception Codes" so the user sees in our UI exactly what OWS would reject.

- New `src/lib/claim-processor/owsValidation.ts` returning `OwsValidationResult { errors[], warnings[], exceptionCodes[] }`.
- Rule set (from guide ch. 2):
  - Claim Type required and matches coverage (11 Vehicle, 12 Emissions, 13 Powertrain, 14 Safety Restraint, 31 FSA, etc.).
  - Sub-code present when claim type requires it.
  - Repair Line Completion Date ≤ today and ≥ warranty start.
  - Odometer at repair completion ≥ delivery odometer and ≥ any prior claim odometer (already partly covered by repeat-repair check — extend).
  - CCC + Condition Code pair required on every repair line (today we suggest CCC but don't block).
  - Causal part flag set on exactly one part per line.
  - Prior-Approval Code present when total > self-approval threshold; Dealer Self-Approval Code present when within limits.
  - MT (actual time) only allowed with a valid base part number OR labour op per the guide's "MT Usage" rules; require comments justifying MT.
  - Parts: qty > 0, unit price > 0, no duplicate causal parts, supersession check stub.
  - Labour: hours > 0, rate matches dealer rate, op code exists in SLT (we already match SLT — surface as a hard error if no match).
  - Comments minimum length per claim type (guide requires 3C: Complaint/Cause/Correction).
- Render as a new "OWS Pre-Validation" card on `ClaimProcessor` above the generate buttons, with red/amber chips and the matching exception-code prefix (e.g. `E-`, `W-`) so users learn the OWS codes.

### 2. Claim Type & Sub-Code picker
Today we hardcode "WAR". Add a dropdown driven by the guide's claim-type table (11–14, 31, plus accessories/MT chapters) and a sub-code field that filters by selected type. Persist per repair line. Feeds into validation and the OWS HTML output.

### 3. Comments builder enforcing 3C format
Guide chapter 2 "Comments" requires Complaint / Cause / Correction. Replace the single textarea in the AWA + OWS dialogs with three labelled fields, auto-stitch into the OWS comments block, and validate min length (e.g. 20 chars each). Back-page extraction already gives us these — auto-fill.

### 4. Causal-part toggle on RepairLineCard
Add a "Causal" radio per part (exactly one per line). Already implied by guide; required by OWS pre-val.

### 5. Accessories & Add-On repair flows (ch. 3)
New repair-line type "Accessories" with the guide's claiming pattern (accessory part + install labour op). Add-On repair: link a secondary line to a primary line so the QUOTE/OWS output groups them.

### 6. Actual-Time (MT) helper
When user selects op code `MT`, require either a base part number or a published labour op reference, and force the comments field to include time-keeping justification (guide ch. 3 "Proper Actual Time Reporting"). Block save otherwise.

### 7. Battery claim helper (ch. "Battery Tester Guidelines GRX-3590")
When a battery part (e.g. `BXT-` prefix) is on the claim, require GRX-3590 tester result fields (state-of-health %, CCA, decision code). Add to Test Results section of OWS output.

### 8. FSA (Claim Type 31) wiring
We already parse Outstanding FSAs from OASIS. Add a one-click "Create FSA claim line" that pre-fills claim type 31 + FSA number + op code from a small FSA→op lookup (manual table to start).

### 9. Exception-code glossary page
New `/ows-codes` route listing all OWS exception-code prefixes from the guide (E-, W-, I-, etc.) with plain-English meaning, so users can self-diagnose OWS rejections. Reuses the same card style as `/ccc`.

### 10. Claim-type-aware OWS HTML output
Extend `generateOWS.ts` to include claim type, sub-code, causal-part flag column, prior-approval/self-approval fields, and structured 3C comments — matching the guide's claim-entry screen layout so the admin can copy field-for-field.

## Out of scope
- No backend changes; everything stays client-side.
- No live OWS API integration (guide is the only source of truth).
- AWA/COR/ESP flows untouched except for the shared 3C comments builder.

## Files (proposed)

- new: `src/lib/claim-processor/owsValidation.ts`, `src/lib/claim-processor/owsClaimTypes.ts`, `src/lib/claim-processor/owsExceptionCodes.ts`, `src/pages/OwsCodes.tsx`, `src/components/claim/OwsValidationCard.tsx`, `src/components/claim/ThreeCCommentsField.tsx`
- edit: `src/pages/ClaimProcessor.tsx`, `src/components/claim/RepairLineCard.tsx`, `src/lib/claim-processor/generateOWS.ts`, `src/lib/claim-processor/types.ts`, `src/App.tsx` (route), `src/components/AppSidebar.tsx` (nav)
- memory: append OWS validation rule to `mem://index.md` core

## Recommended first slice
Ship items **1 + 3 + 4 + 10** together — they form the minimum that makes our generated OWS claim pass pre-validation on the first try. Items 2/5/6/7/8/9 follow as separate slices.
