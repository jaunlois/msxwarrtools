export interface SLTVariant {
  engine: string;
  drivetrain?: string;
  qualifier?: string;
  opCode: string;
  time: number;
}

export interface SLTSupplement {
  description: string;
  opCode: string;
  time: number;
  overlaps?: string[];
}

export interface SLTCombination {
  description: string;
  variants: SLTVariant[];
  overlaps?: OverlapRule[];
}

export interface OverlapRule {
  claiming: string;
  doNotUseWith: string[];
  condition?: string;
}

export interface SLTOperation {
  description: string;
  opCode: string;
  baseTime?: number;
  notes?: string;
  variants: SLTVariant[];
  overlaps?: OverlapRule[];
  supplements?: SLTSupplement[];
  combinations?: SLTCombination[];
  partNumbers?: string[];
}

export interface SLTSection {
  id: string;
  name: string;
  range: string;
  operations: SLTOperation[];
}

export const sltSections: SLTSection[] = [
  {
    id: "01",
    name: "Wheels, Bearings And Hubs",
    range: "0000 - 1999",
    operations: [
      {
        description: "Tire/Wheel Assembly (1007/ 1015/ P1007) - Remove and Install",
        opCode: "1007A",
        notes: "Includes time for tyre inflation check.",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "1007A", time: 0.3 },
          { engine: "ALL", qualifier: "BOTH FRONT", opCode: "1007AFT", time: 0.4 },
          { engine: "ALL", qualifier: "BOTH REAR", opCode: "1007ART", time: 0.4 },
          { engine: "ALL", qualifier: "ALL", opCode: "1007AT", time: 0.5 },
        ],
        overlaps: [
          { claiming: "1007A", doNotUseWith: ["3130A", "5482A", "2001A", "2140A", "1006D"] },
        ],
      },
      {
        description: "Wheel Assembly (1007/ 1015/ P1007) - Remove and Install (NVH Diagnosis)",
        opCode: "1007D",
        notes: "Includes time for tyre inflation check.",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "1007D", time: 0.3 },
          { engine: "ALL", qualifier: "BOTH FRONT", opCode: "1007DFT", time: 0.4 },
          { engine: "ALL", qualifier: "BOTH REAR", opCode: "1007DRT", time: 0.4 },
          { engine: "ALL", qualifier: "ALL", opCode: "1007DT", time: 0.5 },
        ],
        overlaps: [
          { claiming: "1007D", doNotUseWith: ["3130A", "5482A", "2001A", "2140A", "1006D"] },
        ],
        supplements: [
          { description: "Extra Time For A Post-Repair Road Test", opCode: "1007DXQ", time: 0.2 },
        ],
        combinations: [
          {
            description: "Wheel and Tire Assembly (1007/ P1508) - Balance",
            variants: [
              { engine: "ALL", qualifier: "ONE", opCode: "1007D1", time: 0.2 },
              { engine: "ALL", qualifier: "TWO OR MORE", opCode: "1007D1T", time: 0.3 },
            ],
          },
          {
            description: "Driveshaft Assembly (4602) - Balance",
            variants: [
              { engine: "ALL", opCode: "1007D5", time: 0.3 },
            ],
          },
          {
            description: "Driveshaft Assembly (4602) - Replace",
            variants: [
              { engine: "2.0L Panth", opCode: "1007D6", time: 0.5 },
              { engine: "2.0LPan Bi", opCode: "1007D6", time: 0.5 },
              { engine: "3.0L DSL", opCode: "1007D6", time: 0.5 },
            ],
          },
        ],
      },
      {
        description: "Wheel Nut(s) (1012) - Replace",
        opCode: "1012A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "1012A", time: 0.3 },
          { engine: "ALL", qualifier: "TWO OR MORE", opCode: "1012AT", time: 0.4 },
        ],
        overlaps: [],
      },
      {
        description: "Wheel and Tire Assembly - Balance (1015/ P1508)",
        opCode: "1015D",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "1015D", time: 0.4 },
          { engine: "ALL", qualifier: "TWO OR MORE", opCode: "1015DT", time: 0.5 },
        ],
        overlaps: [],
      },
      {
        description: "Wheel Stud (1107/ 1108) - Replace",
        opCode: "1107A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "1107A", time: 0.5 },
          { engine: "ALL", qualifier: "TWO OR MORE", opCode: "1107AT", time: 0.6 },
        ],
        overlaps: [],
      },
      {
        description: "Hub Cap (1130) - Replace",
        opCode: "1130A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "1130A", time: 0.1 },
          { engine: "ALL", qualifier: "ALL", opCode: "1130AT", time: 0.1 },
        ],
        overlaps: [],
      },
      {
        description: "Hub and Bearing Assembly - Front (1104) - Replace",
        opCode: "1104A",
        variants: [
          { engine: "2.0L Panth", qualifier: "ONE", opCode: "1104A", time: 0.9 },
          { engine: "2.0L Panth", qualifier: "BOTH", opCode: "1104AT", time: 1.5 },
          { engine: "2.0LPan Bi", qualifier: "ONE", opCode: "1104A", time: 0.9 },
          { engine: "2.0LPan Bi", qualifier: "BOTH", opCode: "1104AT", time: 1.5 },
          { engine: "3.0L DSL", qualifier: "ONE", opCode: "1104A", time: 0.9 },
          { engine: "3.0L DSL", qualifier: "BOTH", opCode: "1104AT", time: 1.5 },
        ],
        overlaps: [
          { claiming: "1104A", doNotUseWith: ["1006D", "3130A"] },
        ],
      },
      {
        description: "Rear Wheel Bearing Oil Seal (1177) - Replace",
        opCode: "1177A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "1177A", time: 0.8 },
          { engine: "ALL", qualifier: "BOTH", opCode: "1177AT", time: 1.4 },
        ],
        overlaps: [],
      },
      {
        description: "TPMS Sensor (1552/ P1508) - Replace",
        opCode: "1552A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "1552A", time: 0.3 },
          { engine: "ALL", qualifier: "TWO OR MORE", opCode: "1552AT", time: 0.4 },
        ],
        overlaps: [],
      },
      {
        description: "Hub and Bearing Assembly - Front (2134) - Replace (pressed-in bearing)",
        opCode: "2134A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "2134A", time: 1.2 },
          { engine: "ALL", qualifier: "BOTH", opCode: "2134AT", time: 2.0 },
        ],
        overlaps: [],
      },
      {
        description: "Operations not covered by any of the above - Section 01",
        opCode: "1999X5",
        baseTime: 0.0,
        variants: [{ engine: "ALL", opCode: "1999X5", time: 0.0 }],
        overlaps: [],
      },
    ],
  },
  {
    id: "02",
    name: "Brakes",
    range: "2000 - 2999",
    operations: [
      {
        description: "Brake System - Diagnosis",
        opCode: "2000A",
        baseTime: 0.3,
        notes: "Includes time to hook up scan tool, check for DTCs and visual inspection.",
        variants: [{ engine: "ALL", opCode: "2000A", time: 0.3 }],
        overlaps: [],
        supplements: [
          { description: "Extra Time For A Post-Repair Road Test", opCode: "2000AXQ", time: 0.2 },
        ],
      },
      {
        description: "Front Disc Brake Pads (2001/ 2007) - Replace",
        opCode: "2001A",
        variants: [
          { engine: "2.0L Panth", opCode: "2001A", time: 0.6 },
          { engine: "2.0LPan Bi", opCode: "2001A", time: 0.6 },
          { engine: "3.0L DSL", opCode: "2001A", time: 0.6 },
        ],
        overlaps: [
          { claiming: "2001A", doNotUseWith: ["1007D", "2140A"] },
        ],
      },
      {
        description: "Front Brake Disc (1102/ 2020) - Replace",
        opCode: "2020A",
        variants: [
          { engine: "2.0L Panth", qualifier: "ONE", opCode: "2020A", time: 0.7 },
          { engine: "2.0L Panth", qualifier: "BOTH", opCode: "2020AT", time: 0.8 },
          { engine: "2.0LPan Bi", qualifier: "ONE", opCode: "2020A", time: 0.7 },
          { engine: "2.0LPan Bi", qualifier: "BOTH", opCode: "2020AT", time: 0.8 },
          { engine: "3.0L DSL", qualifier: "ONE", opCode: "2020A", time: 0.7 },
          { engine: "3.0L DSL", qualifier: "BOTH", opCode: "2020AT", time: 0.8 },
        ],
        overlaps: [],
      },
      {
        description: "Rear Disc Brake Pads (2001/ 2007/ 2200) - Replace",
        opCode: "2200A",
        variants: [
          { engine: "2.0L Panth", opCode: "2200A", time: 0.5 },
          { engine: "2.0LPan Bi", opCode: "2200A", time: 0.5 },
          { engine: "3.0L DSL", opCode: "2200A", time: 0.5 },
        ],
        overlaps: [],
      },
      {
        description: "ABS Module (2C219/ 2C405) - Replace",
        opCode: "2219A",
        variants: [{ engine: "ALL", opCode: "2219A", time: 0.6 }],
        overlaps: [],
      },
      {
        description: "Brake Caliper - Front (2B120/ 2B121) - Replace",
        opCode: "2140A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "2140A", time: 0.6 },
          { engine: "ALL", qualifier: "BOTH", opCode: "2140AT", time: 1.0 },
        ],
        overlaps: [
          { claiming: "2140A", doNotUseWith: ["2001A", "1007D"] },
        ],
      },
    ],
  },
  {
    id: "03",
    name: "Front Suspension And Steering",
    range: "3000 - 3999",
    operations: [
      {
        description: "Front Wheel Alignment - Check and Adjust",
        opCode: "3001A",
        variants: [{ engine: "ALL", opCode: "3001A", time: 0.7 }],
        overlaps: [],
        supplements: [
          { description: "Extra Time For A Post-Repair Road Test", opCode: "3001AXQ", time: 0.2 },
        ],
      },
      {
        description: "Ball Joint - Lower Arm (3050/ 3395) - Replace",
        opCode: "3050A",
        variants: [
          { engine: "2.0L Panth", qualifier: "ONE", opCode: "3050A", time: 1.0 },
          { engine: "2.0L Panth", qualifier: "BOTH", opCode: "3050AT", time: 1.7 },
          { engine: "2.0LPan Bi", qualifier: "ONE", opCode: "3050A", time: 1.0 },
          { engine: "2.0LPan Bi", qualifier: "BOTH", opCode: "3050AT", time: 1.7 },
          { engine: "3.0L DSL", qualifier: "ONE", opCode: "3050A", time: 1.0 },
          { engine: "3.0L DSL", qualifier: "BOTH", opCode: "3050AT", time: 1.7 },
        ],
        overlaps: [],
      },
      {
        description: "Stabilizer Bar Link (3C130/ 5493) - Replace",
        opCode: "3130A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "3130A", time: 0.3 },
          { engine: "ALL", qualifier: "BOTH", opCode: "3130AT", time: 0.5 },
        ],
        overlaps: [
          { claiming: "3130A", doNotUseWith: ["1007D", "1104A"] },
        ],
      },
      {
        description: "Power Steering Pump (3A674/ 3A696) - Replace",
        opCode: "3504A",
        variants: [
          { engine: "2.0L Panth", opCode: "3504A", time: 1.2 },
          { engine: "2.0LPan Bi", opCode: "3504A", time: 1.2 },
          { engine: "3.0L DSL", opCode: "3504A", time: 1.5 },
        ],
        overlaps: [],
      },
    ],
  },
  {
    id: "04",
    name: "Rear Axle And Differential",
    range: "4000 - 4999",
    operations: [
      {
        description: "Rear Axle Shaft and/or Oil Seal (4035/ 4234/ 4238/ 4B419) - Replace",
        opCode: "4035A",
        variants: [
          { engine: "2.0L Panth", qualifier: "ONE", opCode: "4035A", time: 0.8 },
          { engine: "2.0L Panth", qualifier: "BOTH", opCode: "4035AT", time: 1.4 },
          { engine: "3.0L DSL", qualifier: "ONE", opCode: "4035A", time: 0.8 },
          { engine: "3.0L DSL", qualifier: "BOTH", opCode: "4035AT", time: 1.4 },
        ],
        overlaps: [],
      },
      {
        description: "Differential - Rear - Diagnosis",
        opCode: "4000D",
        baseTime: 0.3,
        variants: [{ engine: "ALL", opCode: "4000D", time: 0.3 }],
        overlaps: [],
      },
    ],
  },
  {
    id: "05",
    name: "Exhaust System, Springs And Rear Suspension",
    range: "5000 - 5999",
    operations: [
      {
        description: "Exhaust Pipe - Front (5209/ 5246/ 5F233) - Replace",
        opCode: "5212B",
        variants: [
          { engine: "2.0L Panth", opCode: "5212B", time: 1.0 },
          { engine: "2.0LPan Bi", opCode: "5212B", time: 1.0 },
          { engine: "3.0L DSL", opCode: "5212B", time: 1.5 },
        ],
        overlaps: [],
      },
      {
        description: "Diesel Particulate Filter (DPF) (5F240/ 5F297) - Replace",
        opCode: "5221A",
        variants: [
          { engine: "2.0LPan Bi", opCode: "5221A", time: 2.0 },
          { engine: "3.0L DSL", opCode: "5221A", time: 1.5 },
        ],
        overlaps: [],
      },
      {
        description: "Rear Spring (5560/ 5781) - Replace",
        opCode: "5560A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "5560A", time: 0.5 },
          { engine: "ALL", qualifier: "BOTH", opCode: "5560AT", time: 0.8 },
        ],
        overlaps: [],
      },
      {
        description: "Shock Absorber - Rear (5A470/ 18125) - Replace",
        opCode: "5482A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "5482A", time: 0.5 },
          { engine: "ALL", qualifier: "BOTH", opCode: "5482AT", time: 0.7 },
        ],
        overlaps: [
          { claiming: "5482A", doNotUseWith: ["1007D"] },
        ],
      },
    ],
  },
  {
    id: "06",
    name: "Engine",
    range: "6000 - 6999",
    operations: [
      {
        description: "Engine Assembly (6006/ 6007) - Replace",
        opCode: "6007A",
        notes: "Refer to specific engine variant for time.",
        variants: [
          { engine: "2.0L Panth", opCode: "6007A", time: 12.8 },
          { engine: "2.0LPan Bi", opCode: "6007A", time: 13.5 },
          { engine: "3.0L DSL", opCode: "6007A", time: 14.2 },
        ],
        overlaps: [
          { claiming: "6007A", doNotUseWith: ["6051A", "6250A", "6500A", "6584A", "9424A1", "9438A"] },
        ],
        supplements: [
          { description: "Extra Time For A Post-Repair Road Test", opCode: "6007AXQ", time: 0.2 },
        ],
      },
      {
        description: "Cylinder Head Gasket (6051/ 6083) - Replace",
        opCode: "6051A",
        variants: [
          { engine: "2.0L Panth", opCode: "6051A", time: 8.5 },
          { engine: "2.0LPan Bi", opCode: "6051A", time: 9.0 },
          { engine: "3.0L DSL", opCode: "6051A", time: 10.2 },
        ],
        overlaps: [
          { claiming: "6051A", doNotUseWith: ["6007A", "6250A", "9430A"] },
        ],
      },
      {
        description: "Oil Pan Gasket (6675/ 6710/ 6730) - Replace",
        opCode: "6675A",
        variants: [
          { engine: "2.0L Panth", opCode: "6675A", time: 3.5 },
          { engine: "2.0LPan Bi", opCode: "6675A", time: 3.5 },
          { engine: "3.0L DSL", opCode: "6675A", time: 4.2 },
        ],
        overlaps: [],
      },
      {
        description: "Timing Chain/Belt and Tensioner (6256/ 6268/ 6K254) - Replace",
        opCode: "6256A",
        variants: [
          { engine: "2.0L Panth", opCode: "6256A", time: 5.0 },
          { engine: "2.0LPan Bi", opCode: "6256A", time: 5.0 },
          { engine: "3.0L DSL", opCode: "6256A", time: 6.5 },
        ],
        overlaps: [
          { claiming: "6256A", doNotUseWith: ["6007A"] },
        ],
        supplements: [
          { description: "Extra Time For A Post-Repair Road Test", opCode: "6256AXQ", time: 0.2 },
        ],
      },
      {
        description: "Valve Cover Gasket (6584) - Replace",
        opCode: "6584A",
        variants: [
          { engine: "2.0L Panth", opCode: "6584A", time: 1.5 },
          { engine: "2.0LPan Bi", opCode: "6584A", time: 1.5 },
          { engine: "3.0L DSL", opCode: "6584A", time: 2.0 },
        ],
        overlaps: [
          { claiming: "6584A", doNotUseWith: ["6007A"] },
        ],
      },
      {
        description: "Camshaft and Valve Train (6250/ 6500) - Replace",
        opCode: "6250A",
        variants: [
          { engine: "2.0L Panth", opCode: "6250A", time: 6.0 },
          { engine: "2.0LPan Bi", opCode: "6250A", time: 6.5 },
          { engine: "3.0L DSL", opCode: "6250A", time: 7.0 },
        ],
        overlaps: [
          { claiming: "6250A", doNotUseWith: ["6007A", "6051A"] },
        ],
      },
    ],
  },
  {
    id: "07",
    name: "Transmission",
    range: "7000 - 7999",
    operations: [
      {
        description: "Automatic Transmission - Diagnosis",
        opCode: "7001D",
        baseTime: 0.3,
        notes: "Includes time to hook up scan tool, check for DTCs and visual inspection.",
        variants: [{ engine: "ALL", opCode: "7001D", time: 0.3 }],
        overlaps: [],
        supplements: [
          { description: "Extra Time For A Post-Repair Road Test", opCode: "7001DXQ", time: 0.2 },
        ],
        combinations: [
          {
            description: "Transmission Assembly - Remove and Install",
            variants: [
              { engine: "2.0L Panth", opCode: "7001D1", time: 6.2 },
              { engine: "2.0LPan Bi", opCode: "7001D1", time: 6.7 },
              { engine: "3.0L DSL", opCode: "7001D1", time: 7.2 },
            ],
          },
        ],
      },
      {
        description: "Transmission Assembly (7000/ 7003/ 7006) - Remove and Install",
        opCode: "7000A",
        notes: "Includes engine/drivetrain variants.",
        variants: [
          { engine: "2.0L Panth", opCode: "7000A", time: 6.5 },
          { engine: "2.0LPan Bi", drivetrain: "2WD", opCode: "7000A", time: 6.5 },
          { engine: "2.0LPan Bi", drivetrain: "4WD Part Time", opCode: "7000A", time: 7.0 },
          { engine: "3.0L DSL", drivetrain: "4WD Full Time", opCode: "7000A", time: 7.5 },
        ],
        overlaps: [
          { claiming: "7000A", doNotUseWith: ["7191A", "7396A", "7003A"] },
        ],
        supplements: [
          { description: "Extra Time For A Post-Repair Road Test", opCode: "7000AXQ", time: 0.2 },
        ],
        combinations: [
          {
            description: "Transmission Assembly - Overhaul",
            variants: [
              { engine: "2.0L Panth", opCode: "7000A1", time: 8.0 },
              { engine: "2.0LPan Bi", opCode: "7000A1", time: 8.5 },
              { engine: "3.0L DSL", opCode: "7000A1", time: 9.0 },
            ],
          },
          {
            description: "Torque Converter (7902) - Replace",
            variants: [
              { engine: "ALL", opCode: "7000A2", time: 0.3 },
            ],
          },
          {
            description: "Front Pump - Replace",
            variants: [
              { engine: "ALL", opCode: "7000A3", time: 0.5 },
            ],
          },
          {
            description: "Valve Body - Replace",
            variants: [
              { engine: "ALL", opCode: "7000A4", time: 0.8 },
            ],
          },
          {
            description: "Oil Cooler - Flush",
            variants: [
              { engine: "ALL", opCode: "7000A5", time: 0.3 },
            ],
          },
        ],
      },
      {
        description: "Transmission Assembly (7000/ 7003/ 7006) - Replace",
        opCode: "7003A",
        variants: [
          { engine: "2.0L Panth", opCode: "7003A", time: 6.5 },
          { engine: "2.0LPan Bi", opCode: "7003A", time: 7.0 },
          { engine: "3.0L DSL", opCode: "7003A", time: 7.5 },
        ],
        overlaps: [
          { claiming: "7003A", doNotUseWith: ["7191A", "7396A", "7000A"] },
        ],
        supplements: [
          { description: "Extra Time For A Post-Repair Road Test", opCode: "7003AXQ", time: 0.2 },
        ],
      },
      {
        description: "Transfer Case / PTU (7005) - Replace",
        opCode: "7003B",
        variants: [
          { engine: "2.0LPan Bi", drivetrain: "4WD", opCode: "7003B", time: 2.5 },
          { engine: "3.0L DSL", drivetrain: "4WD", opCode: "7003B", time: 3.0 },
        ],
        overlaps: [],
      },
      {
        description: "Oil Cooler - Transmission (7095) - Replace",
        opCode: "7095C",
        variants: [
          { engine: "2.0L Panth", opCode: "7095C", time: 1.2 },
          { engine: "2.0LPan Bi", opCode: "7095C", time: 1.2 },
          { engine: "3.0L DSL", opCode: "7095C", time: 1.5 },
        ],
        overlaps: [],
      },
      {
        description: "Torque Converter (7902) - Replace",
        opCode: "7191A",
        variants: [
          { engine: "2.0L Panth", opCode: "7191A", time: 5.5 },
          { engine: "2.0LPan Bi", opCode: "7191A", time: 6.0 },
          { engine: "3.0L DSL", opCode: "7191A", time: 6.2 },
        ],
        overlaps: [
          { claiming: "7191A", doNotUseWith: ["7003A", "7000A"] },
        ],
      },
      {
        description: "Pan/Gasket - Transmission (7191) - Replace",
        opCode: "7191B",
        variants: [
          { engine: "ALL", opCode: "7191B", time: 0.5 },
        ],
        overlaps: [],
      },
      {
        description: "Gear Selector Lever (7210/ 7E454) - Replace",
        opCode: "7210A",
        variants: [
          { engine: "ALL", opCode: "7210A", time: 0.6 },
        ],
        overlaps: [],
      },
      {
        description: "Output Shaft Seal (7052/ 7215) - Replace",
        opCode: "7215A",
        variants: [
          { engine: "2.0L Panth", opCode: "7215A", time: 1.0 },
          { engine: "2.0LPan Bi", opCode: "7215A", time: 1.0 },
          { engine: "3.0L DSL", opCode: "7215A", time: 1.2 },
        ],
        overlaps: [],
      },
      {
        description: "Linkage - Shift (7326) - Adjust",
        opCode: "7326C",
        variants: [
          { engine: "ALL", opCode: "7326C", time: 0.3 },
        ],
        overlaps: [],
      },
      {
        description: "Shift Cable (7395/ 7E395) - Replace",
        opCode: "7395A",
        variants: [
          { engine: "ALL", opCode: "7395A", time: 0.8 },
        ],
        overlaps: [],
      },
      {
        description: "Transfer Case Assembly (7005) - Replace",
        opCode: "7396A",
        variants: [
          { engine: "2.0LPan Bi", drivetrain: "4WD", opCode: "7396A", time: 3.0 },
          { engine: "3.0L DSL", drivetrain: "4WD", opCode: "7396A", time: 3.5 },
        ],
        overlaps: [
          { claiming: "7396A", doNotUseWith: ["7003A", "7000A"] },
        ],
      },
      {
        description: "4WD System - Diagnosis",
        opCode: "7453D",
        baseTime: 0.3,
        variants: [{ engine: "ALL", opCode: "7453D", time: 0.3 }],
        overlaps: [],
        combinations: [
          {
            description: "Transfer Case Motor (7G360) - Replace",
            variants: [
              { engine: "ALL", opCode: "7453D1", time: 0.5 },
            ],
          },
          {
            description: "Front Axle Actuator (3F558) - Replace",
            variants: [
              { engine: "ALL", opCode: "7453D2", time: 0.8 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "08",
    name: "Cooling System",
    range: "8000 - 8999",
    operations: [
      {
        description: "Radiator Assembly (8005/ 8009) - Replace",
        opCode: "8005A",
        notes: "Includes drain and refill cooling system and transfer of necessary components.",
        variants: [
          { engine: "2.0L Panth", opCode: "8005A", time: 3.7 },
          { engine: "2.0LPan Bi", opCode: "8005A", time: 3.7 },
          { engine: "3.0L DSL", opCode: "8005A", time: 3.3 },
        ],
        overlaps: [],
      },
      {
        description: "Cooling System Pressure Test - Diagnosis",
        opCode: "8005DD",
        variants: [
          { engine: "2.0L Panth", opCode: "8005DD", time: 0.4 },
          { engine: "2.0LPan Bi", opCode: "8005DD", time: 0.4 },
          { engine: "3.0L DSL", opCode: "8005DD", time: 0.4 },
        ],
        overlaps: [],
      },
      {
        description: "Cooling System Draining Filling and Bleeding",
        opCode: "8005E",
        variants: [
          { engine: "2.0L Panth", opCode: "8005E", time: 0.9 },
          { engine: "2.0LPan Bi", opCode: "8005E", time: 0.9 },
        ],
        overlaps: [],
      },
      {
        description: "Expansion Tank (8080/ 8A080) - Replace",
        opCode: "8080A",
        variants: [
          { engine: "2.0L Panth", opCode: "8080A", time: 0.5 },
          { engine: "2.0LPan Bi", opCode: "8080A", time: 0.5 },
          { engine: "3.0L DSL", opCode: "8080A", time: 0.6 },
        ],
        overlaps: [],
      },
      {
        description: "Radiator Cap (8100) - Replace",
        opCode: "8100A",
        variants: [{ engine: "ALL", opCode: "8100A", time: 0.1 }],
        overlaps: [],
      },
      {
        description: "Grille - Radiator (8200/ 8B112) - Replace",
        opCode: "8200A",
        variants: [{ engine: "ALL", opCode: "8200A", time: 0.3 }],
        overlaps: [],
      },
      {
        description: "Hose-Radiator (8260/ 8286) - Replace",
        opCode: "8260A",
        variants: [
          { engine: "2.0L Panth", qualifier: "UPPER", opCode: "8260AUP", time: 1.0 },
          { engine: "2.0L Panth", qualifier: "LOWER", opCode: "8260ALW", time: 1.1 },
          { engine: "2.0L Panth", qualifier: "BOTH", opCode: "8260AT", time: 1.1 },
          { engine: "2.0LPan Bi", qualifier: "UPPER", opCode: "8260AUP", time: 1.0 },
          { engine: "2.0LPan Bi", qualifier: "LOWER", opCode: "8260ALW", time: 1.1 },
          { engine: "2.0LPan Bi", qualifier: "BOTH", opCode: "8260AT", time: 1.1 },
          { engine: "3.0L DSL", qualifier: "UPPER", opCode: "8260AUP", time: 1.1 },
          { engine: "3.0L DSL", qualifier: "LOWER", opCode: "8260ALW", time: 1.0 },
          { engine: "3.0L DSL", qualifier: "BOTH", opCode: "8260AT", time: 1.1 },
        ],
        overlaps: [],
      },
      {
        description: "Thermostat (8255/ 8575/ 8592) - Replace",
        opCode: "8575B1",
        notes: "Includes time to remove and install or replace thermostat.",
        variants: [
          { engine: "2.0LPan Bi", opCode: "8575B1", time: 1.2 },
          { engine: "3.0L DSL", opCode: "8575B1", time: 1.5 },
        ],
        overlaps: [],
      },
      {
        description: "Thermostat-Cooling System - Diagnosis",
        opCode: "8575B",
        baseTime: 0.5,
        variants: [{ engine: "ALL", opCode: "8575B", time: 0.5 }],
        overlaps: [],
      },
      {
        description: "Electric Water Pump (8419/ 8A419) - Replace",
        opCode: "8419A",
        variants: [
          { engine: "2.0LPan Bi", opCode: "8419A", time: 0.8 },
          { engine: "3.0L DSL", opCode: "8419A", time: 1.0 },
        ],
        overlaps: [],
      },
      {
        description: "Water Pump or Gasket (6020/ 8501/ 8507) - Replace",
        opCode: "8501A",
        variants: [
          { engine: "2.0L Panth", opCode: "8501A", time: 1.0 },
          { engine: "2.0LPan Bi", opCode: "8501A", time: 1.0 },
          { engine: "3.0L DSL", opCode: "8501A", time: 1.2 },
        ],
        overlaps: [],
        supplements: [
          { description: "Extra Time For A Post-Repair Road Test", opCode: "8501AXQ", time: 0.2 },
        ],
      },
      {
        description: "Water Pump Pulley (8509) - Replace",
        opCode: "8509A",
        variants: [
          { engine: "2.0L Panth", opCode: "8509A", time: 0.3 },
          { engine: "2.0LPan Bi", opCode: "8509A", time: 0.3 },
        ],
        overlaps: [],
      },
      {
        description: "Belt - Serpentine (6C301/ 6D314/ 8620) - Replace",
        opCode: "8620F",
        variants: [
          { engine: "2.0L Panth", qualifier: "PRIMARY", opCode: "8620F", time: 0.3 },
          { engine: "2.0L Panth", qualifier: "COOLANT PUMP", opCode: "8620FC", time: 0.2 },
          { engine: "2.0L Panth", qualifier: "BOTH", opCode: "8620FT", time: 0.3 },
          { engine: "2.0LPan Bi", qualifier: "PRIMARY", opCode: "8620F", time: 0.3 },
          { engine: "2.0LPan Bi", qualifier: "COOLANT PUMP", opCode: "8620FC", time: 0.2 },
          { engine: "2.0LPan Bi", qualifier: "BOTH", opCode: "8620FT", time: 0.3 },
          { engine: "3.0L DSL", opCode: "8620F", time: 0.2 },
        ],
        overlaps: [],
      },
      {
        description: "Motor-Radiator Cooling Fan (8C607/ 8K621) - Replace",
        opCode: "8621A",
        variants: [
          { engine: "2.0L Panth", opCode: "8621A", time: 0.7 },
          { engine: "2.0LPan Bi", opCode: "8621A", time: 0.7 },
          { engine: "2.3L GTDI", opCode: "8621A", time: 0.5 },
          { engine: "3.0L DSL", opCode: "8621A", time: 0.4 },
        ],
        overlaps: [],
      },
      {
        description: "Idler Pulley (8678/ 6C301) - Replace",
        opCode: "8678A",
        variants: [
          { engine: "2.0L Panth", opCode: "8678A", time: 0.3 },
          { engine: "2.0LPan Bi", opCode: "8678A", time: 0.3 },
          { engine: "3.0L DSL", opCode: "8678A", time: 0.4 },
        ],
        overlaps: [],
      },
      {
        description: "Turbo Coolant Lines (9468B/ 9469A) - Replace",
        opCode: "9468B",
        variants: [
          { engine: "2.0LPan Bi", opCode: "9468B", time: 0.8 },
          { engine: "3.0L DSL", opCode: "9468B", time: 1.0 },
        ],
        overlaps: [
          { claiming: "9468B", doNotUseWith: ["9438A"] },
        ],
      },
      {
        description: "Operations not covered by any of the above - Section 08",
        opCode: "8999X5",
        baseTime: 0.0,
        variants: [{ engine: "ALL", opCode: "8999X5", time: 0.0 }],
        overlaps: [],
      },
    ],
  },
  {
    id: "09",
    name: "Fuel Systems And Manifolds",
    range: "9000 - 9999",
    operations: [
      {
        description: "Fuel Tank (9002/ 9072/ 9076) - Remove and Install",
        opCode: "9002A",
        variants: [
          { engine: "2.0L Panth", opCode: "9002A", time: 1.3 },
          { engine: "2.0LPan Bi", opCode: "9002A", time: 1.3 },
        ],
        overlaps: [
          { claiming: "9002A", doNotUseWith: ["9034A"] },
        ],
        combinations: [
          {
            description: "Electric Fuel Pump (9H307/ 9350) - Replace",
            variants: [
              { engine: "2.0L Panth", opCode: "9002A1", time: 0.3 },
              { engine: "2.0LPan Bi", opCode: "9002A1", time: 0.3 },
            ],
          },
        ],
      },
      {
        description: "Fuel Filler Pipe (9034/ 9092) - Replace",
        opCode: "9034A",
        variants: [
          { engine: "ALL", opCode: "9034A", time: 0.5 },
        ],
        overlaps: [
          { claiming: "9034A", doNotUseWith: ["9002A"] },
        ],
      },
      {
        description: "Fuel Filler Cap (9030) - Replace",
        opCode: "9030A",
        variants: [{ engine: "ALL", opCode: "9030A", time: 0.1 }],
        overlaps: [],
      },
      {
        description: "Fuel Gauge Sending Unit (9047/ 9H307) - Replace",
        opCode: "9047A",
        variants: [
          { engine: "2.0L Panth", opCode: "9047A", time: 0.8 },
          { engine: "2.0LPan Bi", opCode: "9047A", time: 0.8 },
        ],
        overlaps: [],
      },
      {
        description: "Filter Assembly - Fuel (9155/ 9N184) - Replace",
        opCode: "9155A",
        variants: [
          { engine: "2.0L Panth", opCode: "9155A", time: 0.5 },
          { engine: "2.0LPan Bi", opCode: "9155A", time: 0.5 },
          { engine: "3.0L DSL", opCode: "9155A", time: 0.5 },
        ],
        overlaps: [
          { claiming: "9155A", doNotUseWith: ["MBASIC7"] },
        ],
      },
      {
        description: "Oil Pressure Sending Unit (9278) - Replace",
        opCode: "9278A",
        variants: [
          { engine: "2.0L Panth", opCode: "9278A", time: 0.3 },
          { engine: "2.0LPan Bi", opCode: "9278A", time: 0.3 },
          { engine: "3.0L DSL", opCode: "9278A", time: 0.5 },
        ],
        overlaps: [],
      },
      {
        description: "Fuel Rail Assembly - High Pressure (9370/ 9D280) - Replace",
        opCode: "9280C",
        variants: [
          { engine: "2.0LPan Bi", opCode: "9280C", time: 1.5 },
          { engine: "3.0L DSL", qualifier: "RIGHT", opCode: "9280CDR", time: 2.4 },
          { engine: "3.0L DSL", qualifier: "LEFT", opCode: "9280CDL", time: 4.1 },
          { engine: "3.0L DSL", qualifier: "BOTH", opCode: "9280CDT", time: 4.7 },
        ],
        overlaps: [
          { claiming: "9280C", doNotUseWith: ["6007A1", "9280A", "9424A1", "6051A", "6007A34", "9424A", "12650D35", "12650D53", "6007A60"] },
          { claiming: "9280C", doNotUseWith: ["10346A"], condition: "2.0L TC DSL PANTHER, 2.0L CR TC DSL" },
          { claiming: "9280C", doNotUseWith: ["9456A"], condition: "3.0L DIESEL" },
        ],
      },
      {
        description: "Fuel Rail Assembly - Low Pressure (9282) - Replace",
        opCode: "9282C",
        variants: [
          { engine: "2.0LPan Bi", opCode: "9282C", time: 1.0 },
          { engine: "3.0L DSL", opCode: "9282C", time: 1.2 },
        ],
        overlaps: [],
      },
      {
        description: "Fuel Rail Sensor (9282) - Replace",
        opCode: "9282E",
        variants: [
          { engine: "2.0LPan Bi", opCode: "9282E", time: 0.3 },
          { engine: "3.0L DSL", opCode: "9282E", time: 0.3 },
        ],
        overlaps: [],
      },
      {
        description: "Intake Manifold Gaskets (6C653/ 9424) - Replace",
        opCode: "9424A",
        variants: [
          { engine: "2.0L Panth", opCode: "9424AD", time: 0.8 },
          { engine: "2.0LPan Bi", opCode: "9424A", time: 0.8 },
          { engine: "3.0L DSL", opCode: "9424A", time: 1.0 },
        ],
        overlaps: [],
        supplements: [
          { description: "Extra Time For A Post-Repair Road Test", opCode: "9424AXQ", time: 0.2 },
        ],
        combinations: [
          {
            description: "Intake Manifold (9424) - Replace",
            variants: [
              { engine: "2.0L Panth", opCode: "9424A1", time: 1.5 },
              { engine: "2.0LPan Bi", opCode: "9424A1", time: 1.5 },
              { engine: "3.0L DSL", opCode: "9424A1", time: 2.0 },
            ],
          },
        ],
      },
      {
        description: "Exhaust Manifold and/or Gasket (5G232/ 9430) - Replace",
        opCode: "9430A",
        variants: [
          { engine: "2.0L Panth", opCode: "9430A", time: 3.3 },
          { engine: "3.0L DSL", qualifier: "RIGHT", opCode: "9430AR", time: 5.4 },
          { engine: "3.0L DSL", qualifier: "LEFT", opCode: "9430AL", time: 3.1 },
          { engine: "3.0L DSL", qualifier: "BOTH", opCode: "9430AT", time: 6.8 },
        ],
        overlaps: [
          { claiming: "9430AL", doNotUseWith: ["9430AT", "9476A", "9468A", "6051A8L", "6051A8T"] },
          { claiming: "9430AR", doNotUseWith: ["6051A8R", "6051A8T", "9430AT"] },
          { claiming: "9430AT", doNotUseWith: ["9430AL", "9476A", "9468A", "6051A8R", "6051A8T", "9430AR", "6051A8L"] },
        ],
      },
      {
        description: "Turbo Oil Supply Line (9440/ 9T516) - Replace",
        opCode: "9440A",
        variants: [
          { engine: "2.0LPan Bi", opCode: "9440A", time: 0.8 },
          { engine: "3.0L DSL", opCode: "9440A", time: 1.0 },
        ],
        overlaps: [
          { claiming: "9440A", doNotUseWith: ["9438A"] },
        ],
      },
      {
        description: "Turbocharger Assembly (6K682/ 9G438) - Replace",
        opCode: "9438A",
        variants: [
          { engine: "2.0L Panth", opCode: "9438A", time: 2.4 },
          { engine: "2.0LPan Bi", drivetrain: "2WD", opCode: "9438A", time: 5.0 },
          { engine: "2.0LPan Bi", drivetrain: "4WD Part Time", opCode: "9438A", time: 5.1 },
          { engine: "3.0L DSL", drivetrain: "4WD Full Time", opCode: "9438A", time: 4.2 },
        ],
        overlaps: [
          { claiming: "9438A", doNotUseWith: ["6007A", "9438AL", "9438AT", "9440A", "9515A", "6051A", "8005E"] },
          { claiming: "9438A", doNotUseWith: ["9468B"] },
          { claiming: "9438A", doNotUseWith: ["6646AH", "6646AT"] },
        ],
        supplements: [
          { description: "Extra Time For A Post-Repair Road Test", opCode: "9438AXQ", time: 0.2 },
        ],
      },
      {
        description: "EGR Cooler (9456/ 9F464) - Replace",
        opCode: "9456A",
        variants: [
          { engine: "2.0LPan Bi", opCode: "9456A", time: 2.5 },
          { engine: "3.0L DSL", opCode: "9456A", time: 3.0 },
        ],
        overlaps: [],
      },
      {
        description: "EGR Valve (9470/ 9D475) - Replace",
        opCode: "9470P",
        variants: [
          { engine: "2.0LPan Bi", opCode: "9470P", time: 0.5 },
          { engine: "3.0L DSL", opCode: "9470P", time: 0.8 },
        ],
        overlaps: [],
      },
      {
        description: "Turbo Oil Return Line (9515/ 9T517) - Replace",
        opCode: "9515A",
        variants: [
          { engine: "2.0LPan Bi", opCode: "9515A", time: 0.5 },
          { engine: "3.0L DSL", opCode: "9515A", time: 0.7 },
        ],
        overlaps: [
          { claiming: "9515A", doNotUseWith: ["9438A"] },
        ],
      },
      {
        description: "Injector O-Ring (9527/ 9229) - Replace",
        opCode: "9527B",
        variants: [
          { engine: "2.0LPan Bi", qualifier: "ONE", opCode: "9527B", time: 0.5 },
          { engine: "2.0LPan Bi", qualifier: "ALL", opCode: "9527BT", time: 0.8 },
          { engine: "3.0L DSL", qualifier: "ONE", opCode: "9527B", time: 0.6 },
          { engine: "3.0L DSL", qualifier: "ALL", opCode: "9527BT", time: 1.0 },
        ],
        overlaps: [],
      },
      {
        description: "Pump - Fuel Injection (9350/ 9A543) - Replace",
        opCode: "9543A",
        variants: [
          { engine: "2.0L Panth", opCode: "9543A", time: 2.4 },
          { engine: "2.0LPan Bi", opCode: "9543A", time: 2.4 },
          { engine: "3.0L DSL", drivetrain: "4WD Full Time", opCode: "9543A", time: 3.7 },
        ],
        overlaps: [],
      },
      {
        description: "Engine Air Filter Element (9600/ 9601) - Replace",
        opCode: "9600A",
        variants: [{ engine: "ALL", opCode: "9600A", time: 0.1 }],
        overlaps: [],
      },
      {
        description: "Air Cleaner Assembly (9600/ 9601) - Replace",
        opCode: "9601A",
        variants: [
          { engine: "2.0L Panth", opCode: "9601A", time: 0.3 },
          { engine: "2.0LPan Bi", opCode: "9601A", time: 0.3 },
          { engine: "3.0L DSL", opCode: "9601A", time: 0.4 },
        ],
        overlaps: [],
      },
      {
        description: "Throttle Body (9675/ 9E926) - Replace",
        opCode: "9675A",
        variants: [
          { engine: "2.0L Panth", opCode: "9675A", time: 0.5 },
          { engine: "2.0LPan Bi", opCode: "9675A", time: 0.5 },
          { engine: "2.3L GTDI", opCode: "9675A", time: 0.4 },
        ],
        overlaps: [],
      },
      {
        description: "Accelerator Pedal (9735/ 9F836) - Replace",
        opCode: "9735A",
        variants: [{ engine: "ALL", opCode: "9735A", time: 0.3 }],
        overlaps: [],
      },
      {
        description: "Diesel Exhaust Fluid Tank (9936/ 9F937) - Replace",
        opCode: "9936A",
        variants: [
          { engine: "2.0LPan Bi", opCode: "9936A", time: 1.0 },
          { engine: "3.0L DSL", opCode: "9936A", time: 1.2 },
        ],
        overlaps: [],
      },
    ],
  },
  {
    id: "10",
    name: "Electrical",
    range: "10000 - 16999",
    operations: [
      {
        description: "Alternator (10346) - Remove and Install or Replace",
        opCode: "10346A",
        variants: [
          { engine: "2.0L Panth", opCode: "10346A", time: 0.8 },
          { engine: "2.0LPan Bi", opCode: "10346A", time: 0.8 },
          { engine: "3.0L DSL", opCode: "10346A", time: 1.5 },
        ],
        overlaps: [
          { claiming: "10346A", doNotUseWith: ["6007A1", "6007A34", "9456A"] },
          { claiming: "10346A", doNotUseWith: ["16102A"] },
          { claiming: "10346A", doNotUseWith: ["6038AL", "6038AR", "6038AT"], condition: "3.0L DIESEL" },
        ],
      },
      {
        description: "Battery - Test, Charge, and Retest",
        opCode: "10654C",
        baseTime: 0.2,
        variants: [{ engine: "ALL", opCode: "10654C", time: 0.2 }],
        overlaps: [],
        combinations: [
          {
            description: "Battery (10653/ 10654/ 10655) - Replace",
            variants: [{ engine: "ALL", opCode: "10654C1", time: 0.2 }],
          },
          {
            description: "Battery - Disconnect and Reconnect",
            variants: [{ engine: "ALL", opCode: "10654C2", time: 0.1 }],
          },
        ],
      },
      {
        description: "Battery Tray (10732/ 10733) - Replace",
        opCode: "10732A",
        variants: [{ engine: "ALL", opCode: "10732A", time: 0.3 }],
        overlaps: [],
      },
      {
        description: "Starter Motor (11002) - Replace",
        opCode: "11002A",
        variants: [
          { engine: "2.0L Panth", opCode: "11002A", time: 0.6 },
          { engine: "2.0LPan Bi", opCode: "11002A", time: 0.5 },
          { engine: "3.0L DSL", opCode: "11002A", time: 0.7 },
        ],
        overlaps: [],
      },
      {
        description: "Ignition Switch (11572) - Replace",
        opCode: "11572A",
        variants: [{ engine: "ALL", opCode: "11572A", time: 0.4 }],
        overlaps: [],
      },
      {
        description: "Lock Cylinder - Ignition (11582) - Replace and Repin",
        opCode: "11582A",
        variants: [{ engine: "ALL", opCode: "11582A", time: 0.4 }],
        notes: "Refer to 15607B or 15607C if key reprogramming is necessary.",
        overlaps: [],
      },
      {
        description: "Relay (12222/ 12B533) - Replace",
        opCode: "12222A",
        variants: [{ engine: "ALL", opCode: "12222A", time: 0.2 }],
        overlaps: [],
      },
      {
        description: "Glow Plug - Replace",
        opCode: "12342D1",
        variants: [
          { engine: "2.0LPan Bi", qualifier: "ONE", opCode: "12342D1", time: 1.0 },
          { engine: "2.0LPan Bi", qualifier: "TWO OR MORE", opCode: "12342D1T", time: 1.1 },
          { engine: "3.0L DSL", qualifier: "ONE", opCode: "12342D1", time: 0.9 },
          { engine: "3.0L DSL", qualifier: "TWO OR MORE", opCode: "12342D1T", time: 0.9 },
        ],
        overlaps: [],
      },
      {
        description: "Glow Plug Control Module (12342) - Replace",
        opCode: "12342D2",
        variants: [
          { engine: "2.0LPan Bi", opCode: "12342D2", time: 0.3 },
          { engine: "3.0L DSL", opCode: "12342D2", time: 0.3 },
        ],
        overlaps: [],
      },
      {
        description: "EEC System Diagnosis (Quick Test)",
        opCode: "12650DD",
        variants: [
          { engine: "2.0L Panth", opCode: "12650DD", time: 0.2 },
          { engine: "2.0LPan Bi", opCode: "12650DD", time: 0.2 },
          { engine: "3.0L DSL", opCode: "12650DD", time: 0.2 },
        ],
        overlaps: [],
        supplements: [
          { description: "Extra time to repeat Final Quick Test", opCode: "12650DX1", time: 0.1 },
        ],
        combinations: [
          {
            description: "Powertrain Control Module (PCM) - Replace",
            variants: [
              { engine: "2.0L Panth", opCode: "12650D6", time: 0.5 },
              { engine: "2.0LPan Bi", opCode: "12650D6", time: 0.5 },
              { engine: "3.0L DSL", opCode: "12650D6", time: 0.5 },
            ],
          },
          {
            description: "Engine Coolant Temperature (ECT) Sensor - Replace",
            variants: [
              { engine: "2.0LPan Bi", opCode: "12650D7", time: 0.3 },
              { engine: "3.0L DSL", opCode: "12650D7", time: 0.4 },
            ],
          },
          {
            description: "MAP Sensor - Replace",
            variants: [
              { engine: "ALL", opCode: "12650D11", time: 0.2 },
            ],
          },
          {
            description: "MAF Sensor - Replace",
            variants: [
              { engine: "ALL", opCode: "12650D12", time: 0.2 },
            ],
          },
          {
            description: "EGR Valve (9D475) - Replace",
            variants: [
              { engine: "2.0LPan Bi", opCode: "12650D18", time: 0.5 },
              { engine: "3.0L DSL", opCode: "12650D18", time: 0.8 },
            ],
          },
          {
            description: "Throttle Body (9E926) - Replace",
            variants: [
              { engine: "2.0LPan Bi", opCode: "12650D22", time: 0.5 },
              { engine: "2.3L GTDI", opCode: "12650D22", time: 0.4 },
            ],
          },
          {
            description: "Fuel Injector(s) - Replace",
            variants: [
              { engine: "2.0LPan Bi", qualifier: "ONE", opCode: "12650D35", time: 0.7 },
              { engine: "2.0LPan Bi", qualifier: "ALL", opCode: "12650D35T", time: 1.5 },
              { engine: "3.0L DSL", qualifier: "ONE", opCode: "12650D35", time: 0.6 },
              { engine: "3.0L DSL", qualifier: "ALL", opCode: "12650D35T", time: 2.2 },
            ],
          },
          {
            description: "Crankshaft Position Sensor - Replace",
            variants: [
              { engine: "2.0LPan Bi", opCode: "12650D42", time: 0.3 },
              { engine: "3.0L DSL", opCode: "12650D42", time: 0.4 },
            ],
          },
          {
            description: "Camshaft Position Sensor - Replace",
            variants: [
              { engine: "2.0LPan Bi", opCode: "12650D43", time: 0.3 },
              { engine: "3.0L DSL", opCode: "12650D43", time: 0.5 },
            ],
          },
          {
            description: "DPF Differential Pressure Sensor - Replace",
            variants: [
              { engine: "2.0LPan Bi", opCode: "12650D50", time: 0.3 },
              { engine: "3.0L DSL", opCode: "12650D50", time: 0.3 },
            ],
          },
          {
            description: "Injector Assy High Pressure (Fuel) - Replace",
            variants: [
              { engine: "2.0LPan Bi", qualifier: "ONE", opCode: "12650D53D", time: 0.7 },
              { engine: "2.0LPan Bi", qualifier: "TWO OR MORE", opCode: "12650D53DT", time: 1.5 },
              { engine: "3.0L DSL", qualifier: "RIGHT ONE", opCode: "12650D53R", time: 0.6 },
              { engine: "3.0L DSL", qualifier: "LEFT ONE", opCode: "12650D53L", time: 0.7 },
              { engine: "3.0L DSL", qualifier: "ALL BOTH SIDES", opCode: "12650D53T", time: 2.2 },
            ],
          },
          {
            description: "NOx Sensor - Replace",
            variants: [
              { engine: "2.0LPan Bi", qualifier: "ONE", opCode: "12650D55", time: 0.3 },
              { engine: "3.0L DSL", qualifier: "ONE", opCode: "12650D55", time: 0.4 },
            ],
          },
          {
            description: "Grille Shutter Motor - Replace",
            variants: [
              { engine: "ALL", opCode: "12650D60", time: 0.5 },
            ],
          },
        ],
      },
      {
        description: "Engine Module - Diagnostic Pin Point Test",
        opCode: "12650D45",
        baseTime: 0.3,
        variants: [{ engine: "ALL", opCode: "12650D45", time: 0.3 }],
        overlaps: [],
        supplements: [
          { description: "Wire Repair", opCode: "12650D45WR", time: 0.3 },
        ],
      },
      {
        description: "BCM/GEM Module Diagnosis",
        opCode: "12651DD",
        baseTime: 0.2,
        variants: [{ engine: "ALL", opCode: "12651DD", time: 0.2 }],
        overlaps: [],
        combinations: [
          {
            description: "Body Control Module (BCM) - Replace",
            variants: [{ engine: "ALL", opCode: "12651D6", time: 0.5 }],
          },
          {
            description: "Smart Junction Box (SJB) - Replace",
            variants: [{ engine: "ALL", opCode: "12651D7", time: 0.4 }],
          },
          {
            description: "Parking Aid Module - Replace",
            variants: [{ engine: "ALL", opCode: "12651D14", time: 0.3 }],
          },
          {
            description: "Module - Front Door - Replace",
            variants: [
              { engine: "ALL", qualifier: "ONE", opCode: "12651D24", time: 0.4 },
              { engine: "ALL", qualifier: "BOTH", opCode: "12651D24T", time: 0.6 },
            ],
          },
          {
            description: "IPMA (Image Processing Module) - Replace",
            variants: [{ engine: "ALL", opCode: "12651D30", time: 0.5 }],
          },
          {
            description: "TCU (Telematics Control Unit) - Replace",
            variants: [{ engine: "ALL", opCode: "12651D31", time: 0.3 }],
          },
          {
            description: "Gateway Module - Replace",
            variants: [{ engine: "ALL", opCode: "12651D32", time: 0.3 }],
          },
          {
            description: "Instrument Panel Cluster (IPC) - Replace",
            variants: [{ engine: "ALL", opCode: "12651D40", time: 0.4 }],
          },
        ],
      },
      {
        description: "SYNC Module (12652/ 14G371) - Replace",
        opCode: "12652A",
        variants: [{ engine: "ALL", opCode: "12652A", time: 0.5 }],
        overlaps: [],
      },
      {
        description: "SYNC System - Diagnosis",
        opCode: "12652D",
        baseTime: 0.3,
        variants: [{ engine: "ALL", opCode: "12652D", time: 0.3 }],
        overlaps: [],
      },
      {
        description: "Headlamp Assembly (13008) - Align",
        opCode: "13007A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "13007A", time: 0.3 },
          { engine: "ALL", qualifier: "BOTH", opCode: "13007AT", time: 0.4 },
        ],
        overlaps: [],
      },
      {
        description: "Headlamp Assembly (13008) - Replace",
        opCode: "13007C",
        variants: [
          { engine: "ALL", qualifier: "RIGHT", opCode: "13007CR", time: 1.3 },
          { engine: "ALL", qualifier: "LEFT", opCode: "13007CL", time: 1.3 },
          { engine: "ALL", qualifier: "BOTH", opCode: "13007CT", time: 1.4 },
        ],
        overlaps: [],
      },
      {
        description: "Bulbs - Headlamp/Park/Signal (13021) - Replace",
        opCode: "13021A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "13021A", time: 0.2 },
          { engine: "ALL", qualifier: "BOTH", opCode: "13021AT", time: 0.3 },
        ],
        overlaps: [],
      },
      {
        description: "Tail Lamp Assembly (13404) - Replace",
        opCode: "13404A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "13404A", time: 0.2 },
          { engine: "ALL", qualifier: "BOTH", opCode: "13404AT", time: 0.3 },
        ],
        overlaps: [],
      },
      {
        description: "Stop Lamp Switch (13480/ 13A019) - Replace",
        opCode: "13480A",
        variants: [{ engine: "ALL", opCode: "13480A", time: 0.3 }],
        overlaps: [],
      },
      {
        description: "Licence Plate Lamp (13550) - Replace",
        opCode: "13550A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "13550A", time: 0.2 },
          { engine: "ALL", qualifier: "BOTH", opCode: "13550AT", time: 0.2 },
        ],
        overlaps: [],
      },
      {
        description: "Centre High Mounted Stop Lamp (13A613) - Replace",
        opCode: "13613A",
        variants: [{ engine: "ALL", opCode: "13613A", time: 0.3 }],
        overlaps: [],
      },
      {
        description: "Horn (13832/ 13A804) - Replace",
        opCode: "13832A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "13832A", time: 0.2 },
          { engine: "ALL", qualifier: "BOTH", opCode: "13832AT", time: 0.3 },
        ],
        overlaps: [],
      },
      {
        description: "Door Lock Switch (14028/ 14A132) - Replace",
        opCode: "14028A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "14028A", time: 0.3 },
          { engine: "ALL", qualifier: "BOTH", opCode: "14028AT", time: 0.5 },
        ],
        overlaps: [],
      },
      {
        description: "Air Bag Restraint System - Diagnosis",
        opCode: "14056D",
        baseTime: 0.3,
        variants: [{ engine: "ALL", opCode: "14056D", time: 0.3 }],
        overlaps: [],
        combinations: [
          {
            description: "RCM (Restraints Control Module) - Replace",
            variants: [{ engine: "ALL", opCode: "14056D6", time: 0.4 }],
          },
          {
            description: "Impact Sensor - Replace",
            variants: [
              { engine: "ALL", qualifier: "ONE", opCode: "14056D8", time: 0.3 },
              { engine: "ALL", qualifier: "BOTH", opCode: "14056D8T", time: 0.5 },
            ],
          },
          {
            description: "Air Bag - Driver - Replace",
            variants: [{ engine: "ALL", opCode: "14056D10", time: 0.3 }],
          },
          {
            description: "Air Bag - Passenger - Replace",
            variants: [{ engine: "ALL", opCode: "14056D11", time: 0.5 }],
          },
          {
            description: "Clockspring (14A664) - Replace",
            variants: [{ engine: "ALL", opCode: "14056D15", time: 0.5 }],
          },
          {
            description: "Side Curtain Air Bag - Replace",
            variants: [
              { engine: "ALL", qualifier: "ONE", opCode: "14056D20", time: 0.8 },
              { engine: "ALL", qualifier: "BOTH", opCode: "14056D20T", time: 1.4 },
            ],
          },
        ],
      },
      {
        description: "Battery Cable - Positive (14300) - Replace",
        opCode: "14300A",
        variants: [{ engine: "ALL", opCode: "14300A", time: 0.5 }],
        overlaps: [],
      },
      {
        description: "Battery Cable - Negative (14301) - Replace",
        opCode: "14301A",
        variants: [{ engine: "ALL", opCode: "14301A", time: 0.3 }],
        overlaps: [],
      },
      {
        description: "Wiring Harness - Engine (14350/ 12A581) - Replace",
        opCode: "14350A",
        variants: [
          { engine: "2.0L Panth", opCode: "14350A", time: 3.0 },
          { engine: "2.0LPan Bi", opCode: "14350A", time: 3.5 },
          { engine: "3.0L DSL", opCode: "14350A", time: 4.0 },
        ],
        overlaps: [],
      },
      {
        description: "Power Window Switch (14A132/ 14526) - Replace",
        opCode: "14526C",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "14526C", time: 0.2 },
          { engine: "ALL", qualifier: "BOTH", opCode: "14526CT", time: 0.3 },
        ],
        overlaps: [],
      },
      {
        description: "Power Window Motor (14553/ 14A389) - Replace",
        opCode: "14529A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "14529A", time: 0.5 },
          { engine: "ALL", qualifier: "BOTH", opCode: "14529AT", time: 1.0 },
        ],
        overlaps: [],
      },
      {
        description: "Window Regulator (14547/ 23200) - Replace",
        opCode: "14547A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "14547A", time: 0.5 },
          { engine: "ALL", qualifier: "BOTH", opCode: "14547AT", time: 0.9 },
        ],
        overlaps: [],
      },
      {
        description: "Wiper Motor - Rear (14701/ 17404) - Replace",
        opCode: "14701A",
        variants: [{ engine: "ALL", opCode: "14701A", time: 0.3 }],
        overlaps: [],
      },
      {
        description: "Fog Lamp Assembly (15200/ 15A201) - Replace",
        opCode: "15200A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "15200A", time: 0.3 },
          { engine: "ALL", qualifier: "BOTH", opCode: "15200AT", time: 0.5 },
        ],
        overlaps: [],
      },
      {
        description: "Key - PATS (Passive Anti-Theft) - Program Additional Key",
        opCode: "15607A",
        variants: [{ engine: "ALL", opCode: "15607A", time: 0.3 }],
        overlaps: [],
      },
      {
        description: "Key - PATS - Program When All Keys Lost",
        opCode: "15607B",
        variants: [{ engine: "ALL", opCode: "15607B", time: 0.5 }],
        overlaps: [],
      },
      {
        description: "Key - PATS - Remote Head Key Program",
        opCode: "15607C",
        variants: [{ engine: "ALL", opCode: "15607C", time: 0.3 }],
        overlaps: [],
      },
      {
        description: "Key - PATS - Intelligent Access Key Program",
        opCode: "15607D",
        variants: [{ engine: "ALL", opCode: "15607D", time: 0.3 }],
        overlaps: [],
      },
      {
        description: "Motor-Moon Roof (15790) - Replace",
        opCode: "15790A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "15790A", time: 2.8 },
          { engine: "ALL", qualifier: "BOTH", opCode: "15790AT", time: 2.9 },
        ],
        overlaps: [],
      },
      {
        description: "Mirror Glass with Motor (17707/ 17E730) - Replace",
        opCode: "17707B",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "17707B", time: 0.3 },
          { engine: "ALL", qualifier: "BOTH", opCode: "17707BT", time: 0.6 },
        ],
        overlaps: [],
        combinations: [
          {
            description: "Mirror Motor (17E730) - Replace",
            variants: [
              { engine: "ALL", qualifier: "ONE", opCode: "17707B1", time: 0.1 },
              { engine: "ALL", qualifier: "BOTH", opCode: "17707B1T", time: 0.2 },
            ],
          },
        ],
      },
      {
        description: "Satellite Antenna (18936/ 18C869) - Replace",
        opCode: "18936A",
        variants: [{ engine: "ALL", opCode: "18936A", time: 0.3 }],
        overlaps: [],
      },
      {
        description: "Rear Camera (19490/ 19G490) - Replace",
        opCode: "19490A",
        variants: [{ engine: "ALL", opCode: "19490A", time: 0.3 }],
        overlaps: [],
      },
    ],
  },
  {
    id: "11",
    name: "Body & Electrical Auxiliary",
    range: "17000 - 19999",
    operations: [
      {
        description: "Running Board or Bar - OEM Installed (16450) - Replace",
        opCode: "16450A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "16450A", time: 0.5 },
          { engine: "ALL", qualifier: "BOTH", opCode: "16450AT", time: 0.7 },
        ],
        overlaps: [],
      },
      {
        description: "Wiper Motor - Windshield (17504/ 17508) - Replace",
        opCode: "17508A",
        baseTime: 0.5,
        variants: [{ engine: "ALL", opCode: "17508A", time: 0.5 }],
        overlaps: [],
      },
      {
        description: "Wiper Arm - Windshield (17526/ 17528) - Replace",
        opCode: "17526A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "17526A", time: 0.1 },
          { engine: "ALL", qualifier: "BOTH", opCode: "17526AT", time: 0.2 },
        ],
        overlaps: [],
      },
      {
        description: "Wiper Blade - Windshield (17528) - Replace",
        opCode: "17528A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "17528A", time: 0.1 },
          { engine: "ALL", qualifier: "BOTH", opCode: "17528AT", time: 0.1 },
        ],
        overlaps: [],
      },
      {
        description: "Washer Reservoir (17566/ 17618) - Replace",
        opCode: "17566A",
        variants: [{ engine: "ALL", opCode: "17566A", time: 0.5 }],
        overlaps: [],
      },
      {
        description: "Windshield Washer Pump (17593/ 17664) - Replace",
        opCode: "17593A",
        variants: [{ engine: "ALL", opCode: "17593A", time: 0.3 }],
        overlaps: [],
      },
      {
        description: "Washer Nozzle - Windshield (17603) - Replace",
        opCode: "17603A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "17603A", time: 0.2 },
          { engine: "ALL", qualifier: "BOTH", opCode: "17603AT", time: 0.3 },
        ],
        overlaps: [],
      },
      {
        description: "Washer Hose (17603) - Replace",
        opCode: "17603B",
        variants: [{ engine: "ALL", opCode: "17603B", time: 0.2 }],
        overlaps: [],
      },
      {
        description: "Wiper Linkage (17618/ 17504) - Replace",
        opCode: "17618A",
        variants: [{ engine: "ALL", opCode: "17618A", time: 0.8 }],
        overlaps: [],
      },
      {
        description: "Rear Washer Motor (17649/ 17664) - Replace",
        opCode: "17649A",
        variants: [{ engine: "ALL", opCode: "17649A", time: 0.3 }],
        overlaps: [],
      },
      {
        description: "Rear Wiper Motor (17404/ 17508) - Replace",
        opCode: "17664A",
        variants: [{ engine: "ALL", opCode: "17664A", time: 0.3 }],
        overlaps: [],
      },
      {
        description: "Mirror - Rear View Outside Electric - Replace",
        opCode: "17682C",
        variants: [
          { engine: "ALL", qualifier: "RIGHT", opCode: "17682CR", time: 0.5 },
          { engine: "ALL", qualifier: "LEFT", opCode: "17682CL", time: 0.6 },
          { engine: "ALL", qualifier: "BOTH", opCode: "17682CT", time: 0.9 },
        ],
        overlaps: [],
      },
      {
        description: "Mirror - Interior Rear View (17700) - Replace",
        opCode: "17700A",
        variants: [{ engine: "ALL", opCode: "17700A", time: 0.2 }],
        overlaps: [],
      },
      {
        description: "Cover Assembly - Rear Bumper Fascia - Replace",
        opCode: "17835A",
        baseTime: 2.1,
        variants: [{ engine: "ALL", opCode: "17835A", time: 2.1 }],
        overlaps: [],
      },
      {
        description: "Cover Assembly - Front Bumper Fascia - Replace",
        opCode: "17957A",
        baseTime: 3.1,
        variants: [{ engine: "ALL", opCode: "17957A", time: 3.1 }],
        overlaps: [],
      },
      {
        description: "Shock Absorber - Front - Replace",
        opCode: "18124A",
        variants: [
          { engine: "ALL", drivetrain: "2WD", qualifier: "ONE", opCode: "18124A", time: 1.0 },
          { engine: "ALL", drivetrain: "2WD", qualifier: "BOTH", opCode: "18124AT", time: 1.7 },
          { engine: "ALL", drivetrain: "4WD", qualifier: "ONE", opCode: "18124A", time: 1.0 },
          { engine: "ALL", drivetrain: "4WD", qualifier: "BOTH", opCode: "18124AT", time: 1.7 },
        ],
        overlaps: [],
        combinations: [
          {
            description: "Spring - Front (5310/ 5414) - Replace",
            variants: [
              { engine: "ALL", qualifier: "ONE", opCode: "18124A1", time: 0.1 },
              { engine: "ALL", qualifier: "BOTH", opCode: "18124A1T", time: 0.2 },
            ],
          },
        ],
      },
      {
        description: "Shock Absorber - Rear (18125/ 5A470) - Replace",
        opCode: "18125A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "18125A", time: 0.5 },
          { engine: "ALL", qualifier: "BOTH", opCode: "18125AT", time: 0.7 },
        ],
        overlaps: [],
        combinations: [
          {
            description: "Spring - Rear (5560) - Replace",
            variants: [
              { engine: "ALL", qualifier: "ONE", opCode: "18125A1", time: 0.1 },
              { engine: "ALL", qualifier: "BOTH", opCode: "18125A1T", time: 0.2 },
            ],
          },
        ],
      },
      {
        description: "Heater Hose (18472/ 18B539) - Replace",
        opCode: "18472A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "18472A", time: 0.5 },
          { engine: "ALL", qualifier: "BOTH", opCode: "18472AT", time: 0.8 },
        ],
        overlaps: [],
      },
      {
        description: "Core-Heater (18476/ 18B539) - Replace",
        opCode: "18476A",
        variants: [{ engine: "ALL", opCode: "18476A", time: 4.9 }],
        overlaps: [],
      },
      {
        description: "Audio Unit (18806) - Replace",
        opCode: "18805E",
        baseTime: 1.9,
        variants: [{ engine: "ALL", opCode: "18805E", time: 1.9 }],
        overlaps: [],
      },
      {
        description: "Speaker (18808/ 18808A) - Replace",
        opCode: "18808A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "18808A", time: 0.3 },
          { engine: "ALL", qualifier: "BOTH", opCode: "18808AT", time: 0.5 },
        ],
        overlaps: [],
      },
      {
        description: "Antenna (18886/ 18A886) - Replace",
        opCode: "18886A",
        variants: [{ engine: "ALL", opCode: "18886A", time: 0.2 }],
        overlaps: [],
      },
      {
        description: "Pollen Filter (19619/ 6K775) - Replace",
        opCode: "19619A",
        variants: [{ engine: "ALL", opCode: "19619A", time: 0.1 }],
        overlaps: [],
      },
      {
        description: "Pressurize, Leak Test, Discharge, Evacuate and Charge A/C System",
        opCode: "19700A",
        variants: [
          { engine: "2.0L Panth", opCode: "19700A", time: 0.8 },
          { engine: "2.0LPan Bi", opCode: "19700A", time: 0.8 },
          { engine: "3.0L DSL", opCode: "19700A", time: 0.8 },
        ],
        overlaps: [],
        combinations: [
          {
            description: "Compressor Assembly - A/C - Replace",
            variants: [
              { engine: "2.0L Panth", opCode: "19700A4", time: 0.9 },
              { engine: "2.0LPan Bi", opCode: "19700A4", time: 0.9 },
              { engine: "3.0L DSL", opCode: "19700A4", time: 1.4 },
            ],
          },
          {
            description: "Core Assembly - A/C Condenser - Replace",
            variants: [
              { engine: "2.0L Panth", opCode: "19700A7", time: 1.7 },
              { engine: "2.0LPan Bi", opCode: "19700A7", time: 1.7 },
              { engine: "3.0L DSL", opCode: "19700A7", time: 2.9 },
            ],
          },
          {
            description: "Core Assembly - A/C Evaporator - Replace",
            variants: [
              { engine: "ALL", opCode: "19700A8", time: 4.5 },
            ],
          },
          {
            description: "Expansion Valve (19849) - Replace",
            variants: [
              { engine: "ALL", opCode: "19700A10", time: 0.5 },
            ],
          },
          {
            description: "Dehydrator/Drier (19C836) - Replace",
            variants: [
              { engine: "ALL", opCode: "19700A11", time: 0.3 },
            ],
          },
          {
            description: "A/C Lines - Replace",
            variants: [
              { engine: "ALL", qualifier: "ONE", opCode: "19700A14", time: 0.5 },
              { engine: "ALL", qualifier: "TWO OR MORE", opCode: "19700A14T", time: 0.8 },
            ],
          },
          {
            description: "A/C System - Flush",
            variants: [
              { engine: "ALL", opCode: "19700A15", time: 0.5 },
            ],
          },
        ],
      },
      {
        description: "A/C and Heating System - Diagnosis",
        opCode: "19700D",
        baseTime: 0.3,
        variants: [{ engine: "ALL", opCode: "19700D", time: 0.3 }],
        overlaps: [],
        combinations: [
          {
            description: "Climate Control Module - Replace",
            variants: [{ engine: "ALL", opCode: "19700D6", time: 0.3 }],
          },
          {
            description: "Blend Door Actuator - Replace",
            variants: [
              { engine: "ALL", qualifier: "ONE", opCode: "19700D10", time: 0.5 },
              { engine: "ALL", qualifier: "BOTH", opCode: "19700D10T", time: 0.8 },
            ],
          },
        ],
      },
      {
        description: "Register - A/C Vent (19893) - Replace",
        opCode: "19893A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "19893A", time: 0.2 },
          { engine: "ALL", qualifier: "BOTH", opCode: "19893AT", time: 0.3 },
        ],
        overlaps: [],
      },
    ],
  },
  {
    id: "12",
    name: "Body",
    range: "02000 - 69000",
    operations: [
      {
        description: "Cowl Side (02010) - Reseal",
        opCode: "02010A",
        baseTime: 0.5,
        notes: "Use MT (actual time) in accordance to the Warranty & Policy guidelines when additional time is necessary.",
        variants: [{ engine: "ALL", opCode: "02010A", time: 0.5 }],
        overlaps: [],
      },
      {
        description: "Cowl Grille (02228) - Replace",
        opCode: "02228A",
        baseTime: 0.5,
        variants: [{ engine: "ALL", opCode: "02228A", time: 0.5 }],
        overlaps: [],
      },
      {
        description: "Panel - Cowl Side Trim (02344) - Replace",
        opCode: "02344A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "02344A", time: 0.3 },
          { engine: "ALL", qualifier: "BOTH", opCode: "02344AT", time: 0.4 },
        ],
        overlaps: [],
      },
      {
        description: "Glass - Windshield (03100/ A03100) - Replace",
        opCode: "03100A",
        baseTime: 1.2,
        notes: "Includes time to engrave VIS (Vehicle Identifier Section)",
        variants: [{ engine: "ALL", opCode: "03100A", time: 1.2 }],
        overlaps: [],
      },
      {
        description: "Moulding - A Pillar (03598) - Replace",
        opCode: "03512A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "03512A", time: 0.2 },
          { engine: "ALL", qualifier: "BOTH", opCode: "03512AT", time: 0.4 },
        ],
        overlaps: [],
      },
      {
        description: "Sun Visor & Bracket Assembly (04104) - Replace",
        opCode: "04104A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "04104A", time: 0.2 },
          { engine: "ALL", qualifier: "BOTH", opCode: "04104AT", time: 0.3 },
        ],
        overlaps: [],
      },
      {
        description: "Instrument Panel (04320) - Replace",
        opCode: "04320A",
        notes: "Includes: Both Upper & Lower Instrument Panels where Applicable",
        variants: [{ engine: "ALL", opCode: "04320A", time: 4.5 }],
        overlaps: [],
      },
      {
        description: "Instrument Panel (04320) - Access",
        opCode: "04320B",
        notes: "This operation provides access time and is to be used in conjunction with a labor only repair operation.",
        variants: [{ engine: "ALL", opCode: "04320B", time: 3.3 }],
        overlaps: [],
      },
      {
        description: "Finish Panel-Instrument Cluster (044D70) - Replace",
        opCode: "04470A",
        baseTime: 0.4,
        variants: [{ engine: "ALL", opCode: "04470A", time: 0.4 }],
        overlaps: [],
      },
      {
        description: "Console Assembly (045A36/ 045B30) - Replace",
        opCode: "04536A",
        baseTime: 0.9,
        variants: [{ engine: "ALL", opCode: "04536A", time: 0.9 }],
        overlaps: [],
      },
      {
        description: "Console Assembly (045A36/ 045B30) - Access",
        opCode: "04536B",
        variants: [{ engine: "ALL", opCode: "04536B", time: 1.1 }],
        overlaps: [],
      },
      {
        description: "Glove Box (06010/ 06024) - Replace",
        opCode: "06024A",
        variants: [
          { engine: "ALL", qualifier: "LOWER", opCode: "06024ALW", time: 0.2 },
          { engine: "ALL", qualifier: "UPPER", opCode: "06024AUP", time: 0.3 },
          { engine: "ALL", qualifier: "BOTH", opCode: "06024AT", time: 0.4 },
        ],
        overlaps: [],
      },
      {
        description: "Moulding - Front Fender Wheel Opening (16038) - Replace",
        opCode: "16038A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "16038A", time: 0.5 },
          { engine: "ALL", qualifier: "BOTH", opCode: "16038AT", time: 0.7 },
        ],
        overlaps: [],
      },
      {
        description: "Shield-Front Fender Splash (16054/ 16102) - Replace",
        opCode: "16102A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "16102A", time: 0.7 },
          { engine: "ALL", qualifier: "BOTH", opCode: "16102AT", time: 1.1 },
        ],
        overlaps: [],
      },
      {
        description: "Hood Assembly (16612) - Align",
        opCode: "16612A",
        baseTime: 0.4,
        variants: [{ engine: "ALL", opCode: "16612A", time: 0.4 }],
        overlaps: [],
      },
      {
        description: "Hood Assembly (16612) - Replace",
        opCode: "16612B",
        baseTime: 1.1,
        variants: [{ engine: "ALL", opCode: "16612B", time: 1.1 }],
        overlaps: [],
      },
      {
        description: "Hood Insulator (A16746/ N16746) - Replace",
        opCode: "16612D",
        baseTime: 0.2,
        variants: [{ engine: "ALL", opCode: "16612D", time: 0.2 }],
        overlaps: [],
      },
      {
        description: "Latch Assembly-Hood (16700) - Replace",
        opCode: "16700A",
        baseTime: 0.3,
        variants: [{ engine: "ALL", opCode: "16700A", time: 0.3 }],
        overlaps: [],
      },
      {
        description: "Hood Latch Release Handle - Replace",
        opCode: "16916B",
        baseTime: 0.2,
        variants: [{ engine: "ALL", opCode: "16916B", time: 0.2 }],
        overlaps: [],
      },
      {
        description: "Cover - Exterior Mirror (17E730) - Replace",
        opCode: "17709B",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "17709B", time: 0.3 },
          { engine: "ALL", qualifier: "BOTH", opCode: "17709BT", time: 0.6 },
        ],
        overlaps: [],
      },
      {
        description: "Lock Cylinder & Key Set-Ignition (22050) - Replace",
        opCode: "22050B",
        baseTime: 0.7,
        variants: [{ engine: "ALL", opCode: "22050B", time: 0.7 }],
        overlaps: [],
      },
      {
        description: "Handle - Front Door Outside (22404) - Replace",
        opCode: "22404A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "22404A", time: 0.2 },
          { engine: "ALL", qualifier: "BOTH", opCode: "22404AT", time: 0.4 },
        ],
        overlaps: [],
      },
      {
        description: "Handle Assembly - Rear Door Outside (22404) - Replace",
        opCode: "22404B",
        notes: "Refer to operation 27406B6 if trim panel removal is necessary.",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "22404B", time: 0.2 },
          { engine: "ALL", qualifier: "BOTH", opCode: "22404BT", time: 0.3 },
        ],
        overlaps: [],
      },
      {
        description: "Trim Panel - Front Door (23942/ 23943) - Remove and Install",
        opCode: "23943A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "23943A", time: 0.3 },
          { engine: "ALL", qualifier: "BOTH", opCode: "23943AT", time: 0.6 },
        ],
        overlaps: [],
        combinations: [
          {
            description: "Trim Panel - Front Door - Replace",
            variants: [
              { engine: "ALL", qualifier: "ONE", opCode: "23943A1", time: 0.1 },
              { engine: "ALL", qualifier: "BOTH", opCode: "23943A1T", time: 0.2 },
            ],
          },
          {
            description: "Correction of Squeaks & Rattles, or Minor Internal Door Adjustments",
            variants: [{ engine: "ALL", opCode: "23943A2", time: 0.2 }],
          },
          {
            description: "Latch Assembly - Front Door - Replace",
            variants: [
              { engine: "ALL", qualifier: "ONE", opCode: "23943A6", time: 0.7 },
              { engine: "ALL", qualifier: "BOTH", opCode: "23943A6T", time: 1.4 },
            ],
          },
          {
            description: "Regulator Assembly Front Door Window Electric - Replace",
            variants: [
              { engine: "ALL", qualifier: "ONE", opCode: "23943A10", time: 0.5 },
              { engine: "ALL", qualifier: "BOTH", opCode: "23943A10T", time: 0.9 },
            ],
          },
          {
            description: "Motor Assembly - Front Door Electric Window - Replace",
            variants: [
              { engine: "ALL", qualifier: "ONE", opCode: "23943A11", time: 0.5 },
              { engine: "ALL", qualifier: "BOTH", opCode: "23943A11T", time: 1.0 },
            ],
          },
          {
            description: "Actuator - Front Door Electric Latch - Replace",
            variants: [
              { engine: "ALL", qualifier: "ONE", opCode: "23943A12", time: 0.7 },
              { engine: "ALL", qualifier: "BOTH", opCode: "23943A12T", time: 1.4 },
            ],
          },
          {
            description: "Glass - Front Door Window - Replace",
            variants: [
              { engine: "ALL", qualifier: "ONE", opCode: "23943A14", time: 0.4 },
              { engine: "ALL", qualifier: "BOTH", opCode: "23943A14T", time: 0.7 },
            ],
          },
          {
            description: "Run - Front Door Glass Latchside - Replace",
            variants: [
              { engine: "ALL", qualifier: "ONE", opCode: "23943A19", time: 0.2 },
              { engine: "ALL", qualifier: "BOTH", opCode: "23943A19T", time: 0.3 },
            ],
          },
          {
            description: "Door Check Strap (23552) - Replace",
            variants: [
              { engine: "ALL", qualifier: "ONE", opCode: "23943A20", time: 0.2 },
              { engine: "ALL", qualifier: "BOTH", opCode: "23943A20T", time: 0.4 },
            ],
          },
        ],
      },
      {
        description: "Panel-Center Body - B Pillar (24346/ 24356) - Replace",
        opCode: "24356A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "24356A", time: 0.4 },
          { engine: "ALL", qualifier: "BOTH", opCode: "24356AT", time: 0.6 },
        ],
        overlaps: [],
      },
      {
        description: "Trim Panel-Rear Door (27406/ 27407) - Remove and Install",
        opCode: "27406B",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "27406B", time: 0.3 },
          { engine: "ALL", qualifier: "BOTH", opCode: "27406BT", time: 0.5 },
          { engine: "ALL", qualifier: "ONE", opCode: "27406B", time: 0.5, drivetrain: "Super Cab" },
          { engine: "ALL", qualifier: "BOTH", opCode: "27406BT", time: 0.8, drivetrain: "Super Cab" },
        ],
        overlaps: [],
        combinations: [
          {
            description: "Trim Panel-Rear Door - Replace",
            variants: [
              { engine: "ALL", qualifier: "ONE", opCode: "27406B2", time: 0.1 },
              { engine: "ALL", qualifier: "BOTH", opCode: "27406B2T", time: 0.1 },
            ],
          },
          {
            description: "Control and Link Assembly or Inside Door Handle - Replace",
            variants: [
              { engine: "ALL", qualifier: "ONE", opCode: "27406B4", time: 0.1 },
              { engine: "ALL", qualifier: "BOTH", opCode: "27406B4T", time: 0.2 },
            ],
          },
          {
            description: "Latch-Rear Door - Replace",
            variants: [
              { engine: "ALL", qualifier: "ONE", opCode: "27406B5", time: 0.5 },
              { engine: "ALL", qualifier: "BOTH", opCode: "27406B5T", time: 0.8 },
            ],
          },
          {
            description: "Regulator Assembly - Rear Door Window - Replace",
            variants: [
              { engine: "ALL", qualifier: "ONE", opCode: "27406B8", time: 0.3 },
              { engine: "ALL", qualifier: "BOTH", opCode: "27406B8T", time: 0.4 },
            ],
          },
          {
            description: "Door Check Strap (27204) - Replace",
            variants: [
              { engine: "ALL", qualifier: "ONE", opCode: "27406B20", time: 0.1 },
              { engine: "ALL", qualifier: "BOTH", opCode: "27406B20T", time: 0.2 },
            ],
          },
        ],
      },
      {
        description: "Housing- Fuel Filler Pipe (27936) - Replace",
        opCode: "27936A",
        baseTime: 0.5,
        variants: [{ engine: "ALL", opCode: "27936A", time: 0.5 }],
        overlaps: [],
      },
      {
        description: "Moulding-C Pillar Interior - Replace",
        opCode: "31002A",
        variants: [
          { engine: "ALL", qualifier: "LEFT", opCode: "31002AL", time: 0.6 },
          { engine: "ALL", qualifier: "RIGHT", opCode: "31002AR", time: 0.6 },
          { engine: "ALL", qualifier: "BOTH", opCode: "31002AT", time: 0.8 },
        ],
        overlaps: [],
      },
      {
        description: "Panel Assembly - Quarter Trim (31012) - Access or Replace",
        opCode: "31012A",
        notes: "Does not require removal of weathersheet. Includes transfer of necessary parts to new trim panel.",
        variants: [
          { engine: "ALL", qualifier: "LEFT", opCode: "31012AL", time: 0.6 },
          { engine: "ALL", qualifier: "RIGHT", opCode: "31012AR", time: 0.6 },
          { engine: "ALL", qualifier: "BOTH", opCode: "31012AT", time: 0.9 },
        ],
        overlaps: [],
      },
      {
        description: "Striker-Tailgate/Liftgate Latch (40442) - Replace",
        opCode: "40442A",
        baseTime: 0.2,
        variants: [{ engine: "ALL", opCode: "40442A", time: 0.2 }],
        overlaps: [],
      },
      {
        description: "Door-Fuel Filler (405A26) - Replace",
        opCode: "40526A",
        baseTime: 0.2,
        variants: [{ engine: "ALL", opCode: "40526A", time: 0.2 }],
        overlaps: [],
      },
      {
        description: "Hydraulic Lift-Liftgate Assembly (406A10) - Replace",
        opCode: "40610A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "40610A", time: 0.2 },
          { engine: "ALL", qualifier: "BOTH", opCode: "40610AT", time: 0.2 },
        ],
        overlaps: [],
      },
      {
        description: "Heated Backlight Grid (42006) - Repair",
        opCode: "42006C",
        baseTime: 0.3,
        variants: [{ engine: "ALL", opCode: "42006C", time: 0.3 }],
        overlaps: [],
      },
      {
        description: "Panel-Tailgate (40602/ 43121) - Remove And Install Or Replace",
        opCode: "43121A",
        baseTime: 0.3,
        variants: [{ engine: "ALL", opCode: "43121A", time: 0.3 }],
        overlaps: [],
        combinations: [
          {
            description: "Latch-Tailgate (43150) - Replace",
            variants: [
              { engine: "ALL", qualifier: "ONE", opCode: "43121A5", time: 0.1 },
              { engine: "ALL", qualifier: "BOTH", opCode: "43121A5T", time: 0.2 },
            ],
          },
        ],
      },
      {
        description: "Rear Spoiler (44210) - Replace",
        opCode: "44210A",
        baseTime: 0.3,
        variants: [{ engine: "ALL", opCode: "44210A", time: 0.3 }],
        overlaps: [],
      },
      {
        description: "Panel-Liftgate Inside Trim (46404) - Remove And Install",
        opCode: "46404B",
        baseTime: 0.3,
        notes: "Includes time to remove and install weathersheet.",
        variants: [{ engine: "ALL", opCode: "46404B", time: 0.3 }],
        overlaps: [],
        combinations: [
          {
            description: "Panel-Liftgate Inside Trim - Replace",
            variants: [{ engine: "ALL", opCode: "46404B1", time: 0.1 }],
          },
          {
            description: "Wiper Motor-Rear - Replace",
            variants: [{ engine: "ALL", opCode: "46404B3", time: 0.2 }],
          },
          {
            description: "Latch Assembly-Liftgate - Replace",
            variants: [{ engine: "ALL", opCode: "46404B6", time: 0.1 }],
          },
          {
            description: "Applique - Liftgate - Replace",
            variants: [{ engine: "ALL", opCode: "46404B12", time: 0.2 }],
          },
        ],
      },
      {
        description: "Deflector - Wind (500A26) - Replace",
        opCode: "50026A",
        baseTime: 0.2,
        variants: [{ engine: "ALL", opCode: "50026A", time: 0.2 }],
        overlaps: [],
      },
      {
        description: "Frame-Roof Opening Glass (50056/ 51070) - Replace",
        opCode: "50222A",
        baseTime: 3.7,
        variants: [{ engine: "ALL", opCode: "50222A", time: 3.7 }],
        overlaps: [],
      },
      {
        description: "Glass-Moon Roof/Sun Roof (50054/ 500A18) - Remove and Install or Replace",
        opCode: "50282B",
        baseTime: 0.5,
        notes: "Operation is for roof opening only. Front equals glass opening, both equals rear fix glass.",
        variants: [{ engine: "ALL", opCode: "50282B", time: 0.5 }],
        overlaps: [],
      },
      {
        description: "Headlining-Roof (51916/ 51942/ 51944) - Replace",
        opCode: "51916A",
        baseTime: 3.1,
        notes: "Includes time to remove and install glass when required by workshop manual.",
        variants: [{ engine: "ALL", opCode: "51916A", time: 3.1 }],
        overlaps: [],
      },
      {
        description: "Headlining-Roof (51916/ 51942/ 51944) - Access",
        opCode: "51916B",
        notes: "This operation provides access time and is to be used in conjunction with a labor only repair operation.",
        variants: [
          { engine: "ALL", opCode: "51916B", time: 2.4 },
          { engine: "ALL", opCode: "51916B", time: 1.8, drivetrain: "Chassis Double Cab" },
        ],
        overlaps: [],
      },
      {
        description: "Console Assembly - Roof (519A58/ 519A70) - Remove and Install or Replace",
        opCode: "51958A",
        baseTime: 0.2,
        variants: [{ engine: "ALL", opCode: "51958A", time: 0.2 }],
        overlaps: [],
        combinations: [
          {
            description: "Glasses Bin (51916) - Replace",
            variants: [{ engine: "ALL", opCode: "51958A2", time: 0.1 }],
          },
        ],
      },
      {
        description: "Seat Belt Buckle Assy - Rear (60044) - Replace",
        opCode: "60044A",
        variants: [
          { engine: "ALL", qualifier: "RIGHT", opCode: "60044AR", time: 0.5 },
          { engine: "ALL", qualifier: "LEFT", opCode: "60044AL", time: 0.7 },
          { engine: "ALL", qualifier: "BOTH", opCode: "60044AT", time: 1.1 },
        ],
        overlaps: [],
      },
      {
        description: "Seat Belt Retractor Assy - Front (611B08/ 611B09) - Replace",
        opCode: "61108A",
        variants: [
          { engine: "ALL", qualifier: "RIGHT", opCode: "61108AR", time: 0.5 },
          { engine: "ALL", qualifier: "LEFT", opCode: "61108AL", time: 0.5 },
          { engine: "ALL", qualifier: "BOTH", opCode: "61108AT", time: 0.8 },
          { engine: "ALL", qualifier: "RIGHT", opCode: "61108AR", time: 0.8, drivetrain: "Double Cab - LWB" },
          { engine: "ALL", qualifier: "LEFT", opCode: "61108AL", time: 0.9, drivetrain: "Double Cab - LWB" },
          { engine: "ALL", qualifier: "BOTH", opCode: "61108AT", time: 1.5, drivetrain: "Double Cab - LWB" },
          { engine: "ALL", qualifier: "RIGHT", opCode: "61108AR", time: 0.7, drivetrain: "Super Cab" },
          { engine: "ALL", qualifier: "LEFT", opCode: "61108AL", time: 0.7, drivetrain: "Super Cab" },
          { engine: "ALL", qualifier: "BOTH", opCode: "61108AT", time: 1.2, drivetrain: "Super Cab" },
        ],
        overlaps: [],
      },
      {
        description: "Seat Belt Retractor or Lap Belt Assy - Rear Center (611B64/ 611B66/ 611B68) - Replace",
        opCode: "61164A",
        baseTime: 1.0,
        variants: [{ engine: "ALL", opCode: "61164A", time: 1.0 }],
        overlaps: [],
      },
      {
        description: "Seat Belt Retractor Assy - Rear (611B68/ 611B69) - Replace",
        opCode: "61168A",
        notes: "Operation excludes third row seat retractors.",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "61168A", time: 0.8 },
          { engine: "ALL", qualifier: "BOTH", opCode: "61168AT", time: 1.2 },
        ],
        overlaps: [],
      },
      {
        description: "Seat Belt Buckle Assy - Front (61202) - Replace",
        opCode: "61202A",
        variants: [
          { engine: "ALL", qualifier: "RIGHT", opCode: "61202AR", time: 0.5 },
          { engine: "ALL", qualifier: "LEFT", opCode: "61202AL", time: 0.5 },
          { engine: "ALL", qualifier: "BOTH", opCode: "61202AT", time: 0.9 },
        ],
        overlaps: [],
      },
      {
        description: "Front Seat Outer Side Cover (62186) - Replace",
        opCode: "62486A",
        variants: [
          { engine: "ALL", qualifier: "RIGHT", opCode: "62486AR", time: 0.5 },
          { engine: "ALL", qualifier: "LEFT", opCode: "62486AL", time: 0.5 },
          { engine: "ALL", qualifier: "BOTH", opCode: "62486AT", time: 0.7 },
        ],
        overlaps: [],
      },
      {
        description: "Seat Assembly - Front (63100) - Remove and Install",
        opCode: "63100A",
        variants: [
          { engine: "ALL", qualifier: "RIGHT", opCode: "63100AR", time: 0.4 },
          { engine: "ALL", qualifier: "LEFT", opCode: "63100AL", time: 0.4 },
          { engine: "ALL", qualifier: "BOTH", opCode: "63100AT", time: 0.5 },
        ],
        overlaps: [],
        combinations: [
          {
            description: "Track Assembly-Front Seat - Replace",
            variants: [
              { engine: "ALL", qualifier: "RIGHT", opCode: "63100A2R", time: 0.9 },
              { engine: "ALL", qualifier: "LEFT", opCode: "63100A2L", time: 0.7 },
              { engine: "ALL", qualifier: "BOTH", opCode: "63100A2T", time: 1.6 },
            ],
          },
          {
            description: "Trim Cover-Front Seat Cushion - Replace",
            variants: [
              { engine: "ALL", qualifier: "RIGHT", opCode: "63100A5R", time: 0.3 },
              { engine: "ALL", qualifier: "LEFT", opCode: "63100A5L", time: 0.2 },
              { engine: "ALL", qualifier: "BOTH", opCode: "63100A5T", time: 0.5 },
            ],
          },
          {
            description: "Trim Cover-Front Seat Back - Replace",
            variants: [
              { engine: "ALL", qualifier: "RIGHT", opCode: "63100A6R", time: 0.6 },
              { engine: "ALL", qualifier: "LEFT", opCode: "63100A6L", time: 0.6 },
              { engine: "ALL", qualifier: "BOTH", opCode: "63100A6T", time: 1.1 },
            ],
          },
          {
            description: "Pad - Front Seat Back - Replace",
            variants: [
              { engine: "ALL", qualifier: "RIGHT", opCode: "63100A9R", time: 0.6 },
              { engine: "ALL", qualifier: "LEFT", opCode: "63100A9L", time: 0.6 },
              { engine: "ALL", qualifier: "BOTH", opCode: "63100A9T", time: 1.1 },
            ],
          },
          {
            description: "Seat Cushion - Front - Replace",
            variants: [
              { engine: "ALL", qualifier: "LEFT", opCode: "63100A15L", time: 0.5 },
              { engine: "ALL", qualifier: "RIGHT", opCode: "63100A15R", time: 0.5 },
              { engine: "ALL", qualifier: "BOTH", opCode: "63100A15T", time: 0.9 },
            ],
          },
        ],
      },
      {
        description: "Seat Assembly - Rear (60026/ 60032) - Remove and Install",
        opCode: "63100B",
        notes: "Times are for second row seating.",
        variants: [
          { engine: "ALL", opCode: "63100B", time: 0.3 },
          { engine: "ALL", qualifier: "RIGHT", opCode: "63100BR", time: 0.5 },
          { engine: "ALL", qualifier: "LEFT", opCode: "63100BL", time: 0.5 },
          { engine: "ALL", qualifier: "BOTH", opCode: "63100BT", time: 0.8 },
        ],
        overlaps: [],
      },
      {
        description: "Seat Back Blower Motor And Duct (19N550) - Replace",
        opCode: "63200A",
        variants: [
          { engine: "ALL", qualifier: "RIGHT", opCode: "63200AR", time: 0.5 },
          { engine: "ALL", qualifier: "LEFT", opCode: "63200AL", time: 0.5 },
          { engine: "ALL", qualifier: "BOTH", opCode: "63200AT", time: 0.9 },
        ],
        overlaps: [],
      },
      {
        description: "Door and Window - Wind Noise/Water Leaks - Diagnosis",
        opCode: "69000A",
        baseTime: 0.2,
        notes: "Using Rotunda Air/Water Leak Detector, or equivalent.",
        variants: [{ engine: "ALL", opCode: "69000A", time: 0.2 }],
        overlaps: [],
      },
    ],
  },
  {
    id: "13",
    name: "Paint",
    range: "PAINT",
    operations: [
      {
        description: "Front Fender - Complete (DETRIM)",
        opCode: "P10D",
        baseTime: 1.9,
        notes: "This operation may be claimed twice if both left and right sides require refinishing.",
        variants: [{ engine: "ALL", opCode: "P10D", time: 1.9 }],
        overlaps: [],
      },
      {
        description: "Front Door - Complete (DETRIM)",
        opCode: "P18D",
        baseTime: 0.7,
        variants: [{ engine: "ALL", opCode: "P18D", time: 0.7 }],
        overlaps: [],
      },
      {
        description: "Rear/Side Door - Complete (DETRIM)",
        opCode: "P24D",
        baseTime: 0.6,
        variants: [{ engine: "ALL", opCode: "P24D", time: 0.6 }],
        overlaps: [],
      },
      {
        description: "Quarter Panel - Complete (DETRIM)",
        opCode: "P28D",
        baseTime: 5.0,
        variants: [{ engine: "ALL", opCode: "P28D", time: 5.0 }],
        overlaps: [],
      },
      {
        description: "Liftgate - Complete (DETRIM)",
        opCode: "P42D",
        baseTime: 1.6,
        variants: [{ engine: "ALL", opCode: "P42D", time: 1.6 }],
        overlaps: [],
      },
      {
        description: "Roof - Full (DETRIM)",
        opCode: "P44D",
        baseTime: 4.0,
        variants: [{ engine: "ALL", opCode: "P44D", time: 4.0 }],
        overlaps: [],
      },
      {
        description: "Front Bumper/Cover Fascia (DETRIM)",
        opCode: "P46D",
        baseTime: 2.2,
        variants: [{ engine: "ALL", opCode: "P46D", time: 2.2 }],
        overlaps: [],
      },
      {
        description: "Rear Bumper Cover Fascia (DETRIM)",
        opCode: "P47D",
        baseTime: 2.2,
        variants: [{ engine: "ALL", opCode: "P47D", time: 2.2 }],
        overlaps: [],
      },
    ],
  },
  {
    id: "14",
    name: "Scheduled Maintenance",
    range: "MBASIC",
    operations: [
      {
        description: "Basic Maintenance Service",
        opCode: "MBASIC",
        baseTime: 0.8,
        notes: "Includes time to rotate and inspect tires, visually inspect brake system, exhaust system, front end components, and check maintenance requirements. This labor operation will count as one completed maintenance service.",
        variants: [{ engine: "ALL", opCode: "MBASIC", time: 0.8 }],
        overlaps: [],
        combinations: [
          {
            description: "Engine Oil and Oil Filter (6714/ 6731) - Replace",
            variants: [
              { engine: "2.0LPan Bi", opCode: "MBASIC1", time: 0.4 },
              { engine: "2.3L GTDI", opCode: "MBASIC1", time: 0.2 },
              { engine: "3.0L DSL", opCode: "MBASIC1", time: 0.3 },
            ],
          },
          {
            description: "Engine Air Filter (9600/ 9601) - Replace",
            variants: [{ engine: "ALL", opCode: "MBASIC2", time: 0.1 }],
          },
          {
            description: "Cabin Air Filter (19N619/ 6K775/ 9600) - Replace",
            variants: [{ engine: "ALL", opCode: "MBASIC4", time: 0.1 }],
          },
          {
            description: "Filter Assembly - Fuel (9155/ 9N184) - Replace",
            variants: [
              { engine: "2.0LPan Bi", opCode: "MBASIC7", time: 0.3 },
              { engine: "2.3L GTDI", opCode: "MBASIC7", time: 0.4 },
              { engine: "3.0L DSL", opCode: "MBASIC7", time: 0.3 },
            ],
          },
          {
            description: "Spark Plugs (12405) - Replace",
            variants: [{ engine: "2.3L GTDI", opCode: "MBASIC8", time: 0.6 }],
          },
          {
            description: "Coolant (3890183/ 97B49/ FLUID) - Change",
            variants: [
              { engine: "2.0L Panth", opCode: "MBASIC9", time: 0.5 },
              { engine: "2.0LPan Bi", opCode: "MBASIC9", time: 0.5 },
              { engine: "2.3L GTDI", opCode: "MBASIC9", time: 0.5 },
              { engine: "3.0L DSL", opCode: "MBASIC9", time: 0.5 },
            ],
          },
          {
            description: "Accessory Drive Belt(s) (6C301/ 6D314/ 8620) - Replace",
            variants: [
              { engine: "2.0LPan Bi", opCode: "MBASIC10", time: 1.0 },
              { engine: "2.3L GTDI", opCode: "MBASIC10", time: 0.3 },
              { engine: "3.0L DSL", opCode: "MBASIC10", time: 0.2 },
            ],
          },
          {
            description: "Automatic Transmission Fluid (FLUID) - Change",
            variants: [
              { engine: "2.0LPan Bi", drivetrain: "10R80", opCode: "MBASIC11", time: 1.1 },
              { engine: "3.0L DSL", drivetrain: "10R80", opCode: "MBASIC11", time: 1.7 },
            ],
          },
          {
            description: "Transfer Case Fluid (4X4) (FLUID) - Change",
            variants: [
              { engine: "ALL", drivetrain: "4WD Full Time", opCode: "MBASIC12", time: 0.4 },
              { engine: "ALL", drivetrain: "4WD Part Time", opCode: "MBASIC12", time: 0.4 },
            ],
          },
          {
            description: "Rear Axle Fluid (FLUID) - Change",
            variants: [
              { engine: "ALL", drivetrain: "2WD", opCode: "MBASIC13", time: 0.3 },
              { engine: "ALL", drivetrain: "4WD Full Time", opCode: "MBASIC13", time: 0.3 },
              { engine: "ALL", drivetrain: "4WD Part Time", opCode: "MBASIC13", time: 0.3 },
            ],
          },
          {
            description: "Front Axle Fluid (4X4) (FLUID) - Change",
            variants: [
              { engine: "ALL", drivetrain: "4WD Full Time", opCode: "MBASIC14", time: 0.2 },
              { engine: "ALL", drivetrain: "4WD Part Time", opCode: "MBASIC14", time: 0.2 },
            ],
          },
          {
            description: "Timing Belt (6268) - Replace",
            variants: [
              { engine: "2.0LPan Bi", opCode: "MBASIC18", time: 4.0 },
              { engine: "3.0L DSL", opCode: "MBASIC18", time: 5.1 },
            ],
          },
          {
            description: "PTU Fluid (FLUID) - Change",
            variants: [{ engine: "ALL", opCode: "MBASIC20", time: 0.2 }],
          },
          {
            description: "Wiper Blades - Front (17528) - Replace",
            variants: [{ engine: "ALL", opCode: "MBASIC30", time: 0.1 }],
          },
          {
            description: "Brake Fluid (BRAKE) - Change",
            variants: [{ engine: "ALL", opCode: "MBASIC31", time: 0.3 }],
          },
          {
            description: "Wiper Blade - Rear (17528) - Replace",
            variants: [{ engine: "ALL", opCode: "MBASIC38", time: 0.1 }],
          },
          {
            description: "Wheel and Tire Assembly (1007/ P1508) - Balance",
            variants: [{ engine: "ALL", opCode: "MBASIC50", time: 0.2 }],
          },
          {
            description: "Disc and Drum Brakes - Clean",
            variants: [{ engine: "ALL", opCode: "MBASIC51", time: 0.2 }],
          },
          {
            description: "Tensioner Assembly - Timing Belt (6K254) - Replace",
            variants: [
              { engine: "2.0LPan Bi", opCode: "MBASIC52", time: 3.8 },
              { engine: "3.0L DSL", opCode: "MBASIC52", time: 5.1 },
            ],
          },
          {
            description: "Front Brake Pads (2001/ 2007) - Replace",
            variants: [{ engine: "ALL", opCode: "MBASIC53", time: 0.5 }],
          },
          {
            description: "Rear Brake Shoes or Pads (2001/ 2007/ 2200) - Replace",
            variants: [{ engine: "ALL", opCode: "MBASIC54B", time: 0.4 }],
          },
        ],
      },
    ],
  },
  {
    id: "99",
    name: "Campaign, TSB, ESB",
    range: "99",
    operations: [
      {
        description: "Additional - Misc. Repairs",
        opCode: "999A",
        baseTime: 0.2,
        notes: "This time can be used for work done by a third person.",
        variants: [{ engine: "ALL", opCode: "999A", time: 0.2 }],
        overlaps: [],
      },
      {
        description: "Component Replacement - Prior Approval",
        opCode: "PRIOR",
        baseTime: 0.3,
        notes: "Includes time to contact hotline and complete online forms. Cannot be used for ESP claims.",
        variants: [{ engine: "ALL", opCode: "PRIOR", time: 0.3 }],
        overlaps: [],
      },
    ],
  },
];

// Extract all overlap rules from the SLT data
export function getAllOverlapRules(): OverlapRule[] {
  const rules: OverlapRule[] = [];
  for (const section of sltSections) {
    for (const op of section.operations) {
      if (op.overlaps) {
        rules.push(...op.overlaps);
      }
    }
  }
  return rules;
}

// Check if a set of operations has any conflicts
export interface OverlapConflict {
  claimingOp: string;
  conflictsWith: string;
  rule: OverlapRule;
}

export function checkOverlaps(operationCodes: string[]): OverlapConflict[] {
  const conflicts: OverlapConflict[] = [];
  const allRules = getAllOverlapRules();

  for (const rule of allRules) {
    const claimBase = rule.claiming.replace(/\*$/, '').toUpperCase();
    const matchesClaiming = operationCodes.some(code => 
      code.toUpperCase() === claimBase || code.toUpperCase().startsWith(claimBase)
    );

    if (matchesClaiming) {
      for (const doNotUse of rule.doNotUseWith) {
        const dBase = doNotUse.replace(/\*$/, '').toUpperCase();
        const matchesConflict = operationCodes.some(code =>
          code.toUpperCase() === dBase || code.toUpperCase().startsWith(dBase)
        );
        if (matchesConflict) {
          conflicts.push({
            claimingOp: rule.claiming,
            conflictsWith: doNotUse,
            rule,
          });
        }
      }
    }
  }
  return conflicts;
}
