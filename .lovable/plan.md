

## Plan: Expand SLT Dataset, Add CCC Codes Page, Verify All Works

### 1. Massively expand SLT data in `src/data/slt-data.ts`

Add all missing operations from the user's provided sections across conversations. Currently ~60 operations exist as a "representative sample." Will expand to include the full detailed operations provided:

**Section 01 (Wheels):** Add 1007A (Tire/Wheel R&I with quantity variants), 1007D (NVH Diagnosis with full combinations for Driveshaft Balance/Replace), 1012A (Wheel Nuts), 1015D (Wheel Balance), 1107A (Front Hub Bolts), 1130A (Hub Cap), 1177A (Rear Wheel Bearing Seal), 1552A (TPMS Sensor), 2134A (Front Hub/Bearing), 1999X5, plus all their overlap rules, supplements, and combinations.

**Section 07 (Transmission):** Expand with 7000A (full R&I with engine/drivetrain variants and many combinations: overhaul, converter, front pump, valve body, cooler flush), 7001D (Diagnosis with combinations), 7003B (Transfer Case/PTU), 7095C (Oil Cooler), 7191A (Pan/Gasket), 7210A (Gear Selector), 7215A (Output Shaft Seal), 7326C (Linkage Adjust), 7395A (Shift Cable), 7453D (4WD Diagnosis with combinations).

**Section 08 (Cooling):** Add 8080A (Expansion Tank), 8100A (Radiator Cap), 8200A (Grille), 8260A (Radiator Hose), 8419A (Electric Water Pump), 8509A (Water Pump Pulley), 8678A (Idler Pulley), 9468B/9469A (Turbo Coolant Lines), 8999X5.

**Section 09 (Fuel):** Add 9002A combinations (Fuel Tank Replace, Electric Fuel Pump), 9030A, 9034A, 9047A, 9278A (Oil Pressure Sending Unit), 9282C/9282E, 9424A combinations (Intake Manifold Replace), 9430A, 9440A (Turbo Oil Supply), 9456A (EGR Cooler), 9470P, 9515A (Turbo Oil Return), 9527B (Injector O-Ring), 9600A, 9601A, 9675A, 9735A, 9936A.

**Section 10 (Electrical):** Add 10654C combinations (Battery Replace/Disconnect), 10732A (Battery Tray), 11572A (Ignition Switch), 11582A, 12222A, 12342D1/D2 (Glow Plugs), 12650D full combinations (PCM, ECT, MAP, MAF, EGR, Throttle Body, Fuel Injectors, Crankshaft/Camshaft sensors, DPF sensors, NOx sensors, Grille Shutters), 12651D full combinations (BCM, SJB, Parking Aid, Door Modules, IPMA, TCU, Gateway, IPC), 12652A/D (SYNC), 13007A (Headlamp Align), 13021A (Bulbs), 13404A, 13465, 13480A, 13550A, 13613A, 13832A (Horn), 14028A (Door Lock Switch), 14056D full combinations (RCM, Sensors, Air Bags, Clockspring, Side Curtain), 14300A/14301A (Battery Cables), 14350A, 14526C, 14529A, 14547A, 14701A, 15200A (Fog Lamps), 15607A/B/C/D (PATS Keys), 15790A (Moon Roof), 17707B (Mirror Glass with Motor combo), 18936A (Satellite Antenna), 19490A (Rear Camera).

**Section 11 (Body & Electrical Aux):** Add 04178A, 16450A, 17526A, 17528A, 17566A, 17593A, 17597A, 17603A/B, 17618A, 17649A, 17664A, 17682C, 17700A, 17835A, 17957A, 18124A/18125A (Shocks with Spring combo), 18472A (Heater Hose), 18476A, 18805E, 18808A (Speakers), 18886A, 19619A (Pollen Filter), 19700A full combinations (A/C Compressor, Condenser, Evaporator, Expansion Valve, Dehydrator, Lines, Flush), 19700D combinations (Climate Control), 19893A (Registers).

**Section 12 (Body):** Add 02010A, 02228A, 02344A, 03100A, 03512A, 04104A, 04320A/B, 04470A, 04536A/B, 06024A, 11582A, 16038A, 16102A, 16612A/B/D, 16700A, 16916B, 17709B, 22050B, 22404A/B, 23943A full combinations (Trim, Latch, Regulator, Motor, Glass, Door Check), 24356A, 27406B full combinations (Rear Door Trim, Latch, Regulator), 27936A, 31002A, 31012A, 40442A, 40526A, 40610A, 42006C, 43121A combinations, 44210A, 46404B combinations, 50026A, 50222A, 50282B, 51916A/B, 51958A, 60044A, 61108A, 61164A, 61168A, 61202A, 62486A, 63100A combinations (Seat Track, Trim Covers, Cushion), 63100B, 63200A, 69000A.

All with complete overlap rules from the provided data.

### 2. Create CCC (Customer Concern Codes) data and page

**New file: `src/data/ccc-data.ts`**
- Define ~300 Customer Concern Codes extracted from the CCC_Jaun-Lois.html data provided earlier
- Include code, description, and condition code categories (A-Z)
- Condition codes reference table

**New file: `src/pages/CCCCodes.tsx`**
- Searchable table of all CCC codes
- Filter by condition code letter
- Quick-copy code to clipboard on click
- Clean dark-themed table matching existing UI

### 3. Update navigation and routing

- Add CCC Codes to `AppSidebar.tsx` nav items (with `FileText` icon)
- Add route in `App.tsx` for `/ccc`
- Add CCC module card to `Index.tsx` dashboard

### 4. Expand parts-data.ts

The uploaded HTML contains ~3,000+ parts in the embedded JSON. Will parse and include the full dataset instead of the current ~55 representative samples.

### Technical Notes
- SLT data file will grow significantly (~3,000+ lines) to accommodate all operations
- Parts data will expand from ~55 to ~3,000+ entries
- All overlap rules will be preserved for the Overlap Checker validation engine
- No new dependencies required

