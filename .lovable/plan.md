

## Plan: Auto-Populate Claim Processor from BSI/Jobcard Text Paste

### Problem
Currently, the user must upload PDF files to populate the claim processor. They want to simply copy text from an open BSI window or jobcard screen and have it auto-populate all claim fields — no file uploads needed.

### Approach
Redesign the PasteExtractor into the **primary data entry method** (not secondary to uploads). Add a prominent "Quick Paste" area at the top of the Claim Processor that:

1. **Accepts multi-block pastes** — user can paste BSI quote text, jobcard text, and OASIS text all in one go or in separate pastes, and data accumulates
2. **Auto-parses on paste** — no need to click "Parse", parsing triggers automatically when text is pasted (via `onPaste` event)
3. **Auto-navigates to Review tab** when data is detected
4. **Handles BSI-specific text layouts** — BSI desktop app copies produce specific patterns (table borders with `|`, fixed-width columns). Enhance regex for these patterns.

### Changes

**1. Upgrade `PasteExtractor.tsx` → `SmartPasteZone.tsx`**
- Rename and redesign as a full-width, always-visible component at top of ClaimProcessor (above tabs)
- Add `onPaste` auto-detect: parse immediately when user pastes (Ctrl+V)
- Add multi-section detection: one paste can contain mixed BSI quote + jobcard + OASIS data
- Add BSI desktop text patterns:
  - Jobcard header block: `Job Card No:`, `Service Advisor:`, `Date Created:`
  - Vehicle block from jobcard: `Vehicle Type:`, `Reg No:`, `Engine No:`, `Chassis No:` (same as VIN)
  - Customer block: `Account Name:`, `Contact:`, `Tel:`
  - Warranty start date: `In Service Date:` or `Delivery Date:`
  - Model code: from jobcard vehicle details
- Show a live "detected data" summary as badges that update in real-time as user pastes
- Add "Clear & Start New Claim" button

**2. Update `ClaimProcessor.tsx`**
- Move SmartPasteZone above the tabs, always visible — it becomes the primary input
- Keep upload tab as secondary/advanced option
- Auto-switch to Review tab when paste populates data
- Accumulate data from multiple pastes (don't overwrite, merge)

**3. Enhanced parsing patterns in the paste parser**
- BSI jobcard text: `Job Card No: 12345`, `Chassis No: WF0...` (17-char VIN)
- BSI quote items with pipe-separated columns
- Account/customer details from jobcard screen copy
- Mileage from `Odometer:` or `Current KM:` patterns
- Model from `Vehicle Type:` or `Vehicle Description:` patterns
- Engine number from `Engine No:` pattern
- Delivery/warranty start from `In Service Date:` or `Warranty Start:`

### Technical Details
- Files modified: `src/components/claim/PasteExtractor.tsx` (rewrite), `src/pages/ClaimProcessor.tsx` (restructure layout)
- No new dependencies needed
- All parsing is client-side regex — no backend required

