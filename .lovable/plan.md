# AWA + Warranty Coverage Intelligence

Combine the new Ford SA AWA template (uploaded `AWA request form.xlsx`) with a coverage analyzer so the Claim Processor only recommends an AWA when no warranty pays the repair. The OASIS PDF in the example shows the 2021 Ranger Raptor is out of factory bumper-to-bumper but has **Ford Premium Care ESP** active, so the fuel-system parts in the quote should route to ESP — not AWA.

## 1. Coverage analyzer — new `src/lib/claim-processor/coverage.ts`

Pure function: `analyzeCoverage(claim: ClaimData): CoverageReport`.

Inputs already in `ClaimData`: `vehicle.warrantyStartDate`, `vehicle.kilometers`, `oasisData.espInfo`, `oasisData.warrantyCoverageMessages`, `warrantyLines`, plus `partsCoverageData` (existing Parts Coverage dataset).

Output:
```ts
type CoverageVerdict = "factory" | "esp" | "partial" | "awa" | "none";
interface LineCoverage {
  line: WarrantyRepairLine;
  parts: { part: ClaimPartLine; covered: "factory"|"esp"|"none"; planMatch?: string }[];
  labour: "factory"|"esp"|"none";
  verdict: CoverageVerdict;
  reason: string;
}
interface CoverageReport {
  factoryStatus: { inWarranty: boolean; ageYears: number; km: number; cap: { years: 4, km: 120000 } };
  espStatus: { active: boolean; plan?: string; expiry?: string; kmCap?: number };
  lines: LineCoverage[];
  overall: CoverageVerdict;
  recommendation: string;   // human summary for UI + AWA justification
  awaJustification: string; // prefilled "Vehicle out of factory warranty (X yrs / Y km). ESP Premium Care active until ... but parts not covered. Goodwill requested to retain loyalty."
}
```

Rules:
- Factory: in-warranty if `ageYears ≤ 4` AND `km ≤ 120000` (memory rule).
- ESP: active if `espInfo.status` matches `ACTIVE|CURRENT` (not `EXPIRED`) and current km ≤ ESP distance cap.
- Per part: match part-number prefix against `partsCoverageData` rows tagged for the active ESP plan (Premium Care covers powertrain + fuel system + many electronics — reuse existing Parts Coverage lookup).
- Verdict: all parts factory → `factory`; all ESP → `esp`; mix → `partial`; none → `awa`.

## 2. Update AWA generator — `src/lib/claim-processor/generateAWA.ts`

Match the uploaded template exactly:
- Worksheet 1 rename: `AWA Request` → `AWA (CLP) Request`.
- Header text → `Ford Motor Company of Southern Africa, International Markets Group (IMG). Customer Resolution Centre (CRC)`.
- Attachments note → `Attach all relevant documentation to this document in the designated Tabs below`.
- Approved-by pre-fill `B. Bezuidenhout`.
- Default assistance split: Actual 100/100, Customer 20/20, Dealer 0/0, Ford 80/80; Rands columns driven by Excel formulas off `partsTotal` / `labourTotal` so the user can tweak %.

New tabs in this order: `AWA (CLP) Request`, `Diagnostics, Photos, Videos` (blank placeholder), `Service History` (existing), `Other Supporting Documents` (blank placeholder), `QUOTE` (auto-filled), `AWA Exclusions` (renamed from `CLP Exclusions`).

**QUOTE tab** is populated from `claim.warrantyLines` (only lines whose `coverage.verdict === "awa"` or `"partial"` — covered lines go to the ESP/Warranty path, not AWA):
- Parts table: Part No | Description | Qty | Unit Price | Line Total `=D*E`; subtotal `=SUM(...)`.
- Labour table: Op Code | Description | Hours | Rate | Line Total `=D*E`; subtotal.
- Grand total = parts + labour. Currency format `"R"#,##0.00`.

Justification cell auto-fills `coverage.awaJustification` when blank.

## 3. Claim Processor UI — `src/pages/ClaimProcessor.tsx`

Add a "Coverage Analysis" card above the existing AWA button, rendered after a quote + OASIS are loaded:
- Factory status badge (In warranty / Out of warranty + age/km).
- ESP status badge (Active Premium Care until {date} / Expired / None).
- Per-line list with colored chip: Factory / ESP / Not covered.
- Recommendation banner: one of
  - "Submit as factory warranty claim — no AWA needed" (disable AWA button)
  - "Submit as ESP claim — covered by Premium Care" (disable AWA button, show "Generate ESP claim" hint)
  - "Partial coverage — file ESP for covered parts, AWA for the rest"
  - "No coverage — AWA goodwill request justified"

AWA dialog: pre-fill `complaint` from back-page concern (already done) and `justification` from `coverage.awaJustification`. Pass only uncovered lines into `generateAWA`.

## 4. Coverage memory

Append to project core memory: "AWA only when no factory + no ESP coverage; ESP Premium Care covers powertrain/fuel system — route to ESP first."

## Out of scope
- No new UI route, no Cloud/backend changes, no changes to OWS/COR generators.
- Photo/Diagnostic embedding stays manual (blank tab).
- ESP plan-to-parts mapping uses the existing Parts Coverage dataset; no new dataset import.

## Files touched
- new: `src/lib/claim-processor/coverage.ts`
- edit: `src/lib/claim-processor/generateAWA.ts`, `src/lib/claim-processor/types.ts` (add `CoverageReport` re-export), `src/pages/ClaimProcessor.tsx`
- memory: `mem://index.md` core line
