

## Ford Warranty & Service Tool

A comprehensive dealership tool for Ford technicians and service advisors to look up warranty coverage, labor times, customer concern codes, and overlap validation — all in one place.

### Pages & Features

**1. Dashboard / Home**
- Quick-access cards to each tool module (Parts Coverage, SLT Lookup, CCC Codes, Overlap Checker)
- Vehicle selector (model/year/VIN prefix) that persists across modules
- Dark theme matching Ford PTS aesthetic

**2. Ford Protect Parts Coverage Lookup**
- Search by part number or description from the `data.json` dataset (~3,000+ parts)
- Displays coverage across all 4 plans: WearCare, Powertrain Care, Extra Care, Premium Maintenance
- Color-coded coverage indicators (✔ / –)
- Filter by plan tier to show only covered parts
- Shows "highest plan" required for each part

**3. Standard Labour Time (SLT) Lookup**
- Browse by section (01-Wheels through 99-Campaign) matching Ford's section structure
- Search by operation number, description, or part number
- Displays labor times broken down by engine variant (2.0L Panther, 2.0L Pan Bi, 2.3L GTDI, 3.0L DSL)
- Shows drivetrain-specific times (2WD, 4WD Full Time, 4WD Part Time)
- Quantity variants displayed (ONE, BOTH, ALL, LEFT, RIGHT, FRONT, REAR)
- Supplement and combination operations shown as expandable sub-items
- Includes the complete data from `slt.json` (Engine section) plus all sections provided in chat (Wheels/Hubs, Brakes area implied, Transmission, Cooling, Fuel, Electrical, Body, Paint, Scheduled Maintenance)

**4. Overlap Validation Checker**
- Select multiple operation numbers being claimed on a single repair order
- Automatically flags conflicts based on the overlap rules (e.g., "When claiming 1007D: Do not use with 3130A, 5482A...")
- Red/green validation with specific rule citation
- Helps prevent warranty claim rejections

**5. Customer Concern Codes (CCC) Reference**
- Searchable table of ~300 CCC codes with descriptions
- Condition code reference (A through Z)
- Quick-copy functionality for claim forms

**6. Scheduled Maintenance Reference**
- MBASIC operation and all combination maintenance operations
- Fluid change times by drivetrain configuration
- Filter replacement times

### Data Architecture
- All reference data stored as static JSON files in the project (no backend needed initially)
- SLT data structured by vehicle model → section → operations with engine/drivetrain variants
- Overlap rules parsed into a validation engine
- Parts coverage data from existing `data.json`

### UI/UX Design
- Professional dark theme (navy/slate) matching Ford PTS styling
- Responsive sidebar navigation with section icons
- Persistent vehicle context bar at top
- Tables with sorting, filtering, and search
- Collapsible sections for operation details, overlaps, and combinations
- Mobile-friendly for tablet use in service bays

### Technical Approach
- React + TypeScript with Tailwind CSS
- Static JSON data files (no database required)
- React Router for page navigation
- Search implemented with client-side filtering
- Overlap validation logic as a utility module

