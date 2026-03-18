

## Plan: Add Section 99 (Campaign/TSB/ESB) Operations to SLT Data

### What

Replace the placeholder Section 99 entry (currently just 2 operations: "Misc. Repairs" and "Prior Approval") with the full ~150+ Campaign/TSB/ESB operations provided by the user. These include:

- **TSB operations** (22xxxx, 23xxxx, 24xxxx, 25xxxx series) covering software reprogram/configuration updates, component inspections, and specific repair procedures
- **Campaign/FSA operations** (22Bxx, 22Cxx, 22Pxx, 23Bxx, 23Cxx, 23Exx, 23Lxx, 23Pxx, 23Sxx, 24Bxx, 24Cxx, 24Pxx, 25Cxx, 25Nxx, 25Pxx, 25Sxx, 25SCx, 25SFx)
- **Section overflow operations** (1999X5, 2999X5, 3999X5... 9999X5, 10999X5, 11999X5, 12999X5)
- **Heater/AC Register** (19893A variants)
- **Special codes**: RAV (ReAcquired Vehicle), SRVZZ (Software Update Repair Validation)
- Many with engine-specific variants (2.0L Panth, 2.0LPan Bi, 3.0L DSL) and INSPECT/REPAIR/REPLACE tiers

### How

1. **Edit `src/data/slt-data.ts`** — Replace lines 2728-2750 (the current Section 99 block) with the full dataset of ~150 operations, each with proper variants, notes, and op codes. The section will preserve the existing 999A and PRIOR entries and add all the TSB/Campaign operations in order.

2. **No other files need changes** — The SLT Lookup page, Overlap Checker, and navigation already support Section 99 rendering. The search and filtering will automatically include these new operations.

### Technical Notes
- TSB operations with multiple repair tiers (INSPECT/REPAIR/REPLACE) will be modeled as variants with qualifiers like "INSPECT", "REPAIR/REPLACE"
- Engine-specific TSBs will use the existing variant structure
- "Mobile Service" and "Vehicle Pickup and Delivery" supplemental operations will be included as variants of their parent TSB
- Section overflow ops (X999X5 pattern) will be grouped at the end

