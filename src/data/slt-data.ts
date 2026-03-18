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
      // === Section overflow operations ===
      {
        description: "Operations not covered by any of the above - Section 1 - Wheels",
        opCode: "1999X5",
        baseTime: 0,
        variants: [{ engine: "ALL", opCode: "1999X5", time: 0 }],
      },
      {
        description: "Operations not covered by any of the above - Section 2 - Brakes",
        opCode: "2999X5",
        baseTime: 0,
        variants: [{ engine: "ALL", opCode: "2999X5", time: 0 }],
      },
      {
        description: "Operations not covered by any of the above - Section 3 - Front Suspension and Steering",
        opCode: "3999X5",
        baseTime: 0,
        variants: [{ engine: "ALL", opCode: "3999X5", time: 0 }],
      },
      {
        description: "Operations not covered by any of the above - Section 4 - Rear Axle",
        opCode: "4999X5",
        baseTime: 0,
        variants: [{ engine: "ALL", opCode: "4999X5", time: 0 }],
      },
      {
        description: "Operations not covered by any of the above - Section 5 - Exhaust System and Springs",
        opCode: "5999X5",
        baseTime: 0,
        variants: [{ engine: "ALL", opCode: "5999X5", time: 0 }],
      },
      {
        description: "Operations not covered by any of the above - Section 6 - Engine",
        opCode: "6999X5",
        baseTime: 0,
        variants: [{ engine: "ALL", opCode: "6999X5", time: 0 }],
      },
      {
        description: "Operations not covered by any of the above - Section 7 - Transmission",
        opCode: "7999X5",
        baseTime: 0,
        variants: [{ engine: "ALL", opCode: "7999X5", time: 0 }],
      },
      {
        description: "Operations not covered by any of the above - Section 8 - Cooling",
        opCode: "8999X5",
        baseTime: 0,
        variants: [{ engine: "ALL", opCode: "8999X5", time: 0 }],
      },
      {
        description: "Operations not covered by any of the above - Section 9 - Fuel System and Manifolds",
        opCode: "9999X5",
        baseTime: 0,
        variants: [{ engine: "ALL", opCode: "9999X5", time: 0 }],
      },
      {
        description: "Operations not covered by any of the above - Section 10 - Electrical",
        opCode: "10999X5",
        baseTime: 0,
        variants: [{ engine: "ALL", opCode: "10999X5", time: 0 }],
      },
      {
        description: "Operations not covered by any of the above - Section 11 - Body Electrical and Accessories",
        opCode: "11999X5",
        baseTime: 0,
        variants: [{ engine: "ALL", opCode: "11999X5", time: 0 }],
      },
      {
        description: "Operations not covered by any of the above - Section 12 - Body",
        opCode: "12999X5",
        baseTime: 0,
        variants: [{ engine: "ALL", opCode: "12999X5", time: 0 }],
      },

      // === Heater/AC Register ===
      {
        description: "Register - Heater/Air Conditioner (045C08/045C09/19893) - Replace",
        opCode: "19893A",
        variants: [
          { engine: "ALL", qualifier: "RIGHT", opCode: "19893AR", time: 0.3 },
          { engine: "ALL", qualifier: "LEFT", opCode: "19893AL", time: 0.4 },
          { engine: "ALL", qualifier: "CENTER ONE OR BOTH", opCode: "19893AC", time: 1.5 },
          { engine: "ALL", qualifier: "ALL", opCode: "19893AT", time: 1.6 },
        ],
      },

      // === TSB Operations 22xxxx series ===
      {
        description: "Reconfigure The Gateway Module GWM",
        opCode: "222348A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "222348A", time: 0.3 }],
      },
      {
        description: "Update the Power Fold Seat Module SCMJ to the latest software release using FDRS",
        opCode: "222352A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "222352A", time: 0.3 }],
      },
      {
        description: "Reprogram the BCM",
        opCode: "222379A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "222379A", time: 0.3 }],
      },
      {
        description: "Reprogram the Body Control Module",
        opCode: "222400A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "222400A", time: 0.3 }],
      },
      {
        description: "Automatic Transmission Harsh Engagement When Shifting To DRIVE",
        opCode: "222414A",
        notes: "10R80 transmission",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "222414A", time: 0.4 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "222414B", time: 0.8 },
        ],
      },
      {
        description: "Reprogram the PSCM to the latest service software level using FDRS",
        opCode: "222423A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "222423A", time: 0.3 }],
      },
      {
        description: "Verify the orientation of the front windshield camera coax connection ensuring no tight bend radius - perform the IPMA 360 Degree View Camera alignment",
        opCode: "222425A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "222425A", time: 1.0 }],
      },
      {
        description: "License Plate Lamp Loose or Hanging Down Broken Clip",
        opCode: "222435A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "222435A", time: 0.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "222435B", time: 0.5 },
        ],
      },
      {
        description: "Electric Park Brake Warning Lamp Illuminated When the Parking Brake Has Not Been Activated",
        opCode: "222442A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "222442A", time: 0.2 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "222442B", time: 0.5 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "222442C", time: 0.8 },
        ],
      },
      {
        description: "Front Power Seat Noise Sliding Forward and Backward Loose Housing Cable in the Motor Tray",
        opCode: "222445A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "222445A", time: 0.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "222445B", time: 0.5 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "222445C", time: 0.8 },
        ],
      },
      {
        description: "Reprogram the IPC to latest software level using Ford Diagnostic Scan tool FDRS",
        opCode: "222455A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "222455A", time: 0.3 }],
      },
      {
        description: "Repair the upper glove compartment as per the given service procedure",
        opCode: "222469A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "222469A", time: 0.2 }],
      },
      {
        description: "Reconfigure The Gateway Module GWM - Do Not Use with Any Other Labor Operations",
        opCode: "222476A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "222476A", time: 0.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "222476B", time: 0.2 },
        ],
      },
      {
        description: "Removal and Replace the Receiver Drier Element plug",
        opCode: "222487B",
        variants: [
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "222487B", time: 3.0 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "222487C", time: 3.3 },
        ],
      },
      {
        description: "Transmission Rattle Noise from Under the Vehicle Due to Loose or Missing DPF Bolts",
        opCode: "222498A",
        notes: "2.0L Pan Bi, 10R80",
        variants: [
          { engine: "2.0LPan Bi", qualifier: "INSPECT", opCode: "222498A", time: 0.9 },
          { engine: "2.0LPan Bi", qualifier: "REPAIR/REPLACE", opCode: "222498B", time: 6.4 },
          { engine: "2.0LPan Bi", qualifier: "REPAIR/REPLACE", opCode: "222498C", time: 5.8 },
        ],
      },

      // === Campaign/FSA 22Bxx, 22Cxx, 22Pxx, 22Sxx ===
      {
        description: "IPMA Reprogramming and Configuration update APIM Sync and IPC",
        opCode: "22B29A",
        variants: [{ engine: "ALL", opCode: "22B29A", time: 1.3 }],
      },
      {
        description: "Wiring Modification of LHS and RHS 16way and 3way connectors - Corrosion Inspection",
        opCode: "22B33A",
        variants: [{ engine: "ALL", opCode: "22B33A", time: 1.2 }],
      },
      {
        description: "Inspection and Wiring Modification of LHS and RHS 16way and 4way connector - High series headlamps Only",
        opCode: "22B33B",
        variants: [{ engine: "ALL", opCode: "22B33B", time: 1.2 }],
      },
      {
        description: "Update APIM Sync Configuration using FDRS",
        opCode: "22B41A",
        variants: [{ engine: "ALL", opCode: "22B41A", time: 0.3 }],
      },
      {
        description: "Update ABS Module Configuration using FDRS",
        opCode: "22B42A",
        variants: [{ engine: "ALL", opCode: "22B42A", time: 0.3 }],
      },
      {
        description: "Update PCM Calibration using FDRS and Reset Oil Life Monitor",
        opCode: "22B43A",
        variants: [{ engine: "ALL", opCode: "22B43A", time: 0.3 }],
      },
      {
        description: "Update PCM Calibration using FDRS Reset Oil Life Monitor and Replace Oil and Oil Filter",
        opCode: "22B43B",
        variants: [{ engine: "ALL", opCode: "22B43B", time: 0.5 }],
      },
      {
        description: "Update the Headlamp Control Module HCM Software",
        opCode: "22C34A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "22C34A", time: 0.3 }],
      },
      {
        description: "Update the Body Control Module BCM Configuration",
        opCode: "22C36A",
        variants: [{ engine: "ALL", opCode: "22C36A", time: 0.3 }],
      },
      {
        description: "APIM Sync module PMI Configuration",
        opCode: "22P20A",
        variants: [{ engine: "ALL", opCode: "22P20A", time: 0.5 }],
      },
      {
        description: "Remove and Replace 12inch Display",
        opCode: "22P29A",
        variants: [{ engine: "ALL", opCode: "22P29A", time: 2.4 }],
      },
      {
        description: "Install Protective sleeve",
        opCode: "22S57A",
        variants: [{ engine: "ALL", opCode: "22S57A", time: 0.3 }],
      },

      // === TSB Operations 23xxxx series ===
      {
        description: "Air Conditioning AC Not Cooling With Incorrect Low Ambient Temperatures Displayed",
        opCode: "232007A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "232007A", time: 0.2 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232007B", time: 0.1 },
        ],
      },
      {
        description: "Wiper Blade Contact With A Pillar",
        opCode: "232037A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "232037A", time: 0.2 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232037B", time: 0.2 },
        ],
      },
      {
        description: "Reprogram the BCM",
        opCode: "232043A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "232043A", time: 0.3 }],
      },
      {
        description: "Verify the orientation of front windshield camera coax connection - perform the IPMA 360 Degree View Camera alignment procedure",
        opCode: "232044A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "232044A", time: 1.0 }],
      },
      {
        description: "Anti Lock ABS Module Reprogram Update to the latest service software level using FDRS",
        opCode: "232063A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "232063A", time: 0.3 }],
      },
      {
        description: "Replace the A/C compressor inlet line",
        opCode: "232085B",
        variants: [{ engine: "2.0L Panth", qualifier: "REPAIR/REPLACE", opCode: "232085B", time: 1.3 }],
      },
      {
        description: "Reprogram the IPC to latest software level using Ford Diagnostic Scan tool FDRS",
        opCode: "232089A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "232089A", time: 1.5 }],
      },
      {
        description: "Check and clean oil stain and resecure the front support bracket following the tightening sequence",
        opCode: "232110A",
        variants: [{ engine: "2.0LPan Bi", qualifier: "INSPECT", opCode: "232110A", time: 1.0 }],
      },
      {
        description: "Reprogram the Anti Lock Brake System ABS module to the latest service software level using FDRS",
        opCode: "232128A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "232128A", time: 0.3 }],
      },
      {
        description: "Removal and Replace the Receiver Drier Element plug",
        opCode: "232134B",
        variants: [
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232134B", time: 3.0 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232134C", time: 3.3 },
        ],
      },
      {
        description: "Instrument Panel Cluster IPC Configuration Update",
        opCode: "232140A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "232140A", time: 0.4 }],
      },
      {
        description: "Front Power Seat Noise Sliding Forward Backward Loose Housing Cable In The Motor Tray",
        opCode: "232148A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "232148A", time: 0.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232148B", time: 0.5 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232148C", time: 0.8 },
        ],
      },
      {
        description: "Reduced Audio Quality When Making A Phone Call Using Bluetooth",
        opCode: "232165A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "232165A", time: 0.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232165B", time: 0.9 },
        ],
      },
      {
        description: "Illuminated MIL With DTCs",
        opCode: "232173A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "232173A", time: 0.2 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232173B", time: 3.0 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232173C", time: 0.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232173D", time: 0.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232173E", time: 0.4 },
        ],
      },
      {
        description: "B Pillar Ticking Sound",
        opCode: "232175A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "232175A", time: 1.0 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232175B", time: 1.8 },
        ],
      },
      {
        description: "Verify the orientation of front windshield camera coax connection - perform the IPMA 360 Degree View Camera alignment procedure",
        opCode: "232184A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "232184A", time: 1.0 }],
      },
      {
        description: "Reprogram the ABS module to the latest service software level using FDRS",
        opCode: "232186A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "232186A", time: 0.3 }],
      },
      {
        description: "Hillstart Assist Auto Hold or Advanced Driver Assistance System Functions Unavailable with DTC P166B",
        opCode: "232223A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "232223A", time: 0.5 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232223B", time: 1.0 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232223C", time: 0.2 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232223D", time: 1.1 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232223E", time: 0.6 },
        ],
      },
      {
        description: "Apply Grease and repair the Exterior Mirror as per given service procedure Both Side",
        opCode: "232224A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "232224A", time: 0.3 }],
      },
      {
        description: "Record and report air conditioning repair information in technician comments of warranty claim",
        opCode: "232227A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "232227A", time: 0.2 }],
      },
      {
        description: "Remove the Front seats and Replace the Air bag wiring as per the given service procedure Both sides",
        opCode: "232254A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "232254A", time: 1.5 }],
      },
      {
        description: "Electric Park Brake Warning Lamp Illuminated When the Parking Brake Has Not Been Activated",
        opCode: "232255A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "232255A", time: 0.5 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232255B", time: 0.8 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232255C", time: 0.5 },
        ],
      },
      {
        description: "Connect the FDRS to vehicle and check for DTCs - includes Reflash PCM, Throttle Body cleaning, EGR Reset and final check",
        opCode: "232260A",
        variants: [
          { engine: "2.0L Panth", qualifier: "INSPECT", opCode: "232260A", time: 0.7 },
          { engine: "2.0LPan Bi", qualifier: "INSPECT", opCode: "232260A", time: 0.7 },
        ],
      },
      {
        description: "B Pillar Ticking Sound",
        opCode: "232262A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "232262A", time: 1.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232262B", time: 2.3 },
        ],
      },
      {
        description: "Liftgate Water Leak from the Liftgate Mounted Rear Lamp",
        opCode: "232303A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "232303A", time: 0.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232303B", time: 0.1 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232303C", time: 0.4 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232303D", time: 0.1 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232303E", time: 0.2 },
        ],
      },
      {
        description: "12 Inch Center Display Screen Blank",
        opCode: "232312A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "232312A", time: 0.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232312B", time: 2.8 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232312C", time: 2.7 },
        ],
      },
      {
        description: "Connect the FDRS - Select the IPC module and update the software",
        opCode: "232321A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "232321A", time: 0.3 }],
      },
      {
        description: "Illuminated MIL With DTCs (3.0L Diesel)",
        opCode: "232322A",
        variants: [
          { engine: "3.0L DSL", qualifier: "INSPECT", opCode: "232322A", time: 0.2 },
          { engine: "3.0L DSL", qualifier: "REPAIR/REPLACE", opCode: "232322B", time: 3.0 },
          { engine: "3.0L DSL", qualifier: "REPAIR/REPLACE", opCode: "232322C", time: 0.3 },
          { engine: "3.0L DSL", qualifier: "REPAIR/REPLACE", opCode: "232322D", time: 0.3 },
          { engine: "3.0L DSL", qualifier: "REPAIR/REPLACE", opCode: "232322E", time: 0.4 },
        ],
      },
      {
        description: "Interior Rattle at the Front of the Vehicle Below the Instrument Panel",
        opCode: "232323A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "232323A", time: 3.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232323B", time: 0.1 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232323C", time: 0.2 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232323D", time: 0.2 },
        ],
      },
      {
        description: "Inspect and Replace the CAC intake pipe",
        opCode: "232342A",
        variants: [{ engine: "2.0LPan Bi", qualifier: "INSPECT", opCode: "232342A", time: 0.4 }],
      },
      {
        description: "Repair the panoramic roof drain hose - includes remove and install cowl panel grill and visual check drain hose",
        opCode: "232383A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "232383A", time: 0.9 }],
      },
      {
        description: "12 Inch Center Display Screen Blank",
        opCode: "232414A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "232414A", time: 0.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "232414C", time: 2.7 },
        ],
      },
      {
        description: "Connect FDRS and Reprogram Powertrain Control Module PCM to the latest service calibration",
        opCode: "232418A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "232418A", time: 0.5 }],
      },
      {
        description: "Engine Reduced Power With An Illuminated MIL And DTC P246C",
        opCode: "232423A",
        variants: [
          { engine: "2.0L Panth", qualifier: "INSPECT", opCode: "232423A", time: 0.3 },
          { engine: "2.0L Panth", qualifier: "REPAIR/REPLACE", opCode: "232423B", time: 0.9 },
          { engine: "2.0LPan Bi", qualifier: "INSPECT", opCode: "232423A", time: 0.3 },
          { engine: "2.0LPan Bi", qualifier: "REPAIR/REPLACE", opCode: "232423B", time: 0.9 },
        ],
      },
      {
        description: "Inspect and Replace the CAC intake pipe",
        opCode: "232424A",
        variants: [{ engine: "2.0LPan Bi", qualifier: "INSPECT", opCode: "232424A", time: 0.4 }],
      },

      // === Campaign/FSA 23Bxx series ===
      {
        description: "Hot end bracket replacement and transmission housing inspection",
        opCode: "23B15A",
        notes: "2.0LPan Bi, 10R80",
        variants: [{ engine: "2.0LPan Bi", opCode: "23B15A", time: 1.0 }],
      },
      {
        description: "Hot end bracket replacement and transmission housing inspection and transmission replacement 2WD",
        opCode: "23B15B",
        variants: [{ engine: "2.0LPan Bi", opCode: "23B15B", time: 7.2 }],
      },
      {
        description: "Hot end bracket replacement and transmission housing inspection and transmission replacement 4WD",
        opCode: "23B15C",
        variants: [{ engine: "2.0LPan Bi", opCode: "23B15C", time: 7.5 }],
      },
      {
        description: "Inspect Oil Pickup Tube Presence - Pass",
        opCode: "23B23A",
        variants: [{ engine: "ALL", opCode: "23B23A", time: 0.6 }],
      },
      {
        description: "Inspect Oil Pickup Tube Presence - Fail Replace the Engine Assembly",
        opCode: "23B23B",
        variants: [{ engine: "ALL", opCode: "23B23B", time: 15.0 }],
      },
      {
        description: "Instrument Panel Cluster IPC Software and Configuration Update",
        opCode: "23B29B",
        variants: [{ engine: "ALL", opCode: "23B29B", time: 0.8 }],
      },
      {
        description: "Update ABS Software using FDRS",
        opCode: "23B30B",
        variants: [{ engine: "ALL", opCode: "23B30B", time: 0.3 }],
      },
      {
        description: "APIM SYNC Module Configuration Update",
        opCode: "23B46B",
        variants: [{ engine: "ALL", opCode: "23B46B", time: 0.3 }],
      },
      {
        description: "Inspection of Dashcam Operation Only",
        opCode: "23B75A",
        variants: [{ engine: "ALL", opCode: "23B75A", time: 0.2 }],
      },
      {
        description: "Inspection of Dashcam and Replace Hardware Wiring Kit",
        opCode: "23B75B",
        variants: [{ engine: "ALL", opCode: "23B75B", time: 1.6 }],
      },
      {
        description: "Engine Mount Replace - Panther 2L All variants",
        opCode: "23B76B",
        variants: [
          { engine: "2.0L Panth", opCode: "23B76B", time: 1.4 },
          { engine: "2.0LPan Bi", opCode: "23B76B", time: 1.4 },
        ],
      },
      {
        description: "Engine Mount Replace - Lion 3L",
        opCode: "23B76C",
        variants: [{ engine: "3.0L DSL", opCode: "23B76C", time: 1.6 }],
      },
      {
        description: "Transport and Factory Mode Deactivation using FDRS",
        opCode: "23B97B",
        variants: [{ engine: "ALL", opCode: "23B97B", time: 0.3 }],
      },
      {
        description: "Mobile Service - repair takes place away from dealership",
        opCode: "23B97MM",
        variants: [{ engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "23B97MM", time: 0.5 }],
      },

      // === Campaign/FSA 23Cxx series ===
      {
        description: "Update Instrument Panel Cluster IPC Configuration",
        opCode: "23C06B",
        variants: [{ engine: "ALL", opCode: "23C06B", time: 0.3 }],
      },
      {
        description: "Instrument panel cluster IPC software update and validation",
        opCode: "23C10B",
        variants: [{ engine: "ALL", opCode: "23C10B", time: 0.5 }],
      },
      {
        description: "Instrument Panel Cluster IPC Configuration Update",
        opCode: "23C11B",
        variants: [{ engine: "ALL", opCode: "23C11B", time: 0.4 }],
      },
      {
        description: "Instrument Panel Cluster IPC Software and Configuration Update",
        opCode: "23C11C",
        variants: [{ engine: "ALL", opCode: "23C11C", time: 0.8 }],
      },
      {
        description: "Software Validation and PCM Calibration software update",
        opCode: "23C29B",
        variants: [{ engine: "ALL", opCode: "23C29B", time: 0.3 }],
      },
      {
        description: "PCM calibration software level check and reductant injector replace",
        opCode: "23C30B",
        variants: [{ engine: "ALL", opCode: "23C30B", time: 0.7 }],
      },
      {
        description: "PCM calibration level check update and reductant injector replace",
        opCode: "23C30C",
        variants: [{ engine: "ALL", opCode: "23C30C", time: 0.9 }],
      },

      // === Campaign/FSA 23Exx, 23Lxx, 23Pxx, 23Sxx series ===
      {
        description: "Replace DPF Assembly",
        opCode: "23E08B",
        variants: [{ engine: "ALL", opCode: "23E08B", time: 1.4 }],
      },
      {
        description: "Check and Insert print of Attachment III to Service Portfolio",
        opCode: "23L03B",
        variants: [{ engine: "ALL", opCode: "23L03B", time: 0.2 }],
      },
      {
        description: "Inspect for and insert if required Towing a Trailer Precautions Supplement Booklet",
        opCode: "23L07A",
        variants: [{ engine: "ALL", opCode: "23L07A", time: 0.2 }],
      },
      {
        description: "Inspect for Booklet only",
        opCode: "23L07B",
        variants: [{ engine: "ALL", opCode: "23L07B", time: 0.2 }],
      },
      {
        description: "Inspect the fuel label on the Fuel flap inner and the sticker in service portfolio - both present",
        opCode: "23L08A",
        variants: [{ engine: "ALL", opCode: "23L08A", time: 0.2 }],
      },
      {
        description: "Inspect and affix the Fuel flap inner Label",
        opCode: "23L08B",
        variants: [{ engine: "ALL", opCode: "23L08B", time: 0.2 }],
      },
      {
        description: "Inspect and affix the fuel flap inner label and sticker in service portfolio",
        opCode: "23L08C",
        variants: [{ engine: "ALL", opCode: "23L08C", time: 0.3 }],
      },
      {
        description: "Update Instrument Panel Cluster IPC Configuration",
        opCode: "23P04B",
        variants: [{ engine: "ALL", opCode: "23P04B", time: 0.3 }],
      },
      {
        description: "Hose and Wiring Inspection Sleeve fitment and Harness Reroute",
        opCode: "23P15B",
        variants: [{ engine: "ALL", opCode: "23P15B", time: 0.3 }],
      },
      {
        description: "Coolant Pipe Replacement",
        opCode: "23P15C",
        variants: [{ engine: "ALL", opCode: "23P15C", time: 0.8 }],
      },
      {
        description: "Remove and Install Charge air duct",
        opCode: "23P23B",
        variants: [{ engine: "ALL", opCode: "23P23B", time: 0.4 }],
      },
      {
        description: "Inspect Driver Seatbelt Retractor and Pretensioner Assembly - Pass",
        opCode: "23S14A",
        variants: [{ engine: "ALL", opCode: "23S14A", time: 0.2 }],
      },
      {
        description: "Inspect Driver Seatbelt Retractor and Pretensioner Assembly - Fail",
        opCode: "23S14AF",
        variants: [{ engine: "ALL", opCode: "23S14AF", time: 0.2 }],
      },
      {
        description: "Seat belt retractor and pretensioner assembly inspection and replacement - Ranger double cab and Everest and DIPA",
        opCode: "23S14B",
        variants: [{ engine: "ALL", opCode: "23S14B", time: 1.2 }],
      },
      {
        description: "Seat Belt Retractor and Pretensioner Assembly Inspection and Replacement - Single Cab and DIPA",
        opCode: "23S14C",
        variants: [{ engine: "ALL", opCode: "23S14C", time: 1.0 }],
      },
      {
        description: "Arrange ARB reworked remote return",
        opCode: "23S26B",
        variants: [{ engine: "ALL", opCode: "23S26B", time: 0.2 }],
      },
      {
        description: "Update the PCM Calibration",
        opCode: "23S40B",
        variants: [{ engine: "ALL", opCode: "23S40B", time: 0.3 }],
      },

      // === TSB Operations 24xxxx series ===
      {
        description: "Verify orientation of front windshield camera coax connection - perform IPMA 360 Degree View Camera alignment procedure",
        opCode: "242005A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "242005A", time: 1.0 }],
      },
      {
        description: "Reprogram the Appropriate Modules as Required by the Software Update as per Service Procedure",
        opCode: "242041A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "242041A", time: 1.5 }],
      },
      {
        description: "2L Panther Engine No Start Condition After An Extended Drive At Low RPM With The AC On High",
        opCode: "242048A",
        variants: [
          { engine: "2.0L Panth", qualifier: "INSPECT", opCode: "242048A", time: 0.2 },
          { engine: "2.0L Panth", qualifier: "REPAIR/REPLACE", opCode: "242048B", time: 0.2 },
          { engine: "2.0L Panth", qualifier: "REPAIR/REPLACE", opCode: "242048C", time: 0.3 },
          { engine: "2.0LPan Bi", qualifier: "INSPECT", opCode: "242048A", time: 0.2 },
          { engine: "2.0LPan Bi", qualifier: "REPAIR/REPLACE", opCode: "242048B", time: 0.2 },
          { engine: "2.0LPan Bi", qualifier: "REPAIR/REPLACE", opCode: "242048C", time: 0.3 },
        ],
      },
      {
        description: "Reprogram the Appropriate Modules As Required By The Software Update as per Service Procedure",
        opCode: "242060A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "242060A", time: 1.5 }],
      },
      {
        description: "Remove the Front seats and Replace the Air bag wiring as per the given service procedure Both sides",
        opCode: "242076A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "242076A", time: 1.5 }],
      },
      {
        description: "Power Folding Exterior Mirrors Noise When Folding and Unfolding",
        opCode: "242081A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "242081A", time: 0.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242081B", time: 0.4 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242081C", time: 0.7 },
        ],
      },
      {
        description: "Verify orientation of front windshield camera coax connection - perform IPMA 360 Degree View Camera alignment procedure",
        opCode: "242091A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "242091A", time: 1.0 }],
      },
      {
        description: "Liftgate Water Leak from the Liftgate Mounted Rear Lamp",
        opCode: "242131A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "242131A", time: 0.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242131B", time: 0.1 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242131C", time: 0.4 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242131D", time: 0.1 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242131E", time: 0.2 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242131F", time: 0.2 },
        ],
      },
      {
        description: "Connect FDRS and check for DTCs - Reflash Transmission Control Module to latest service calibration",
        opCode: "242133A",
        variants: [{ engine: "2.0L Panth", qualifier: "INSPECT", opCode: "242133A", time: 0.5 }],
        notes: "6SP 6R80 transmission",
      },
      {
        description: "Power Folding Mirrors Exterior Noise When Folding and Unfolding",
        opCode: "242144A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "242144A", time: 0.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242144B", time: 0.6 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242144C", time: 1.0 },
        ],
      },
      {
        description: "Engine Rattle Vibration Buzz or Resonance from the Air Intake Area Between 1500RPM to 2000RPM Or 20Kph to 80Kph",
        opCode: "242178A",
        variants: [
          { engine: "2.0L Panth", qualifier: "INSPECT", opCode: "242178A", time: 0.3 },
          { engine: "2.0L Panth", qualifier: "REPAIR/REPLACE", opCode: "242178B", time: 0.2 },
          { engine: "2.0LPan Bi", qualifier: "INSPECT", opCode: "242178A", time: 0.3 },
          { engine: "2.0LPan Bi", qualifier: "REPAIR/REPLACE", opCode: "242178B", time: 0.2 },
          { engine: "3.0L DSL", qualifier: "INSPECT", opCode: "242178A", time: 0.3 },
          { engine: "3.0L DSL", qualifier: "REPAIR/REPLACE", opCode: "242178B", time: 0.2 },
        ],
      },
      {
        description: "Verify the orientation of front windshield camera coax connection - perform IPMA 360 Degree View Camera alignment procedure",
        opCode: "242195A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "242195A", time: 1.0 }],
      },
      {
        description: "Repair the panoramic roof drain hose - includes remove and install of cowl panel grill visual check drain hose",
        opCode: "242207A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "242207A", time: 0.9 }],
      },
      {
        description: "Diesel Engine Illuminated MIL With DTCs",
        opCode: "242219A",
        variants: [
          { engine: "3.0L DSL", qualifier: "INSPECT", opCode: "242219A", time: 0.2 },
          { engine: "3.0L DSL", qualifier: "REPAIR/REPLACE", opCode: "242219B", time: 3.0 },
          { engine: "3.0L DSL", qualifier: "REPAIR/REPLACE", opCode: "242219C", time: 0.3 },
          { engine: "3.0L DSL", qualifier: "REPAIR/REPLACE", opCode: "242219D", time: 0.3 },
          { engine: "3.0L DSL", qualifier: "REPAIR/REPLACE", opCode: "242219E", time: 0.4 },
        ],
      },
      {
        description: "Replace ALL 3 parts - front door trim RH, front door trim LH and floor console upper trim panel",
        opCode: "242220A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "242220A", time: 1.2 }],
      },
      {
        description: "Engine Overheating and or Poor AC Performance with DTC P0480 and or P0217",
        opCode: "242224A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "242224A", time: 0.4 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242224B", time: 1.0 },
        ],
      },
      {
        description: "Speed Sign Recognition System and Intelligent Adaptive Cruise Control Incorrectly Detecting Speed Limit",
        opCode: "242237A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "242237A", time: 0.2 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242237B", time: 0.1 },
        ],
      },
      {
        description: "Connect FDRS to check and clear DTC - Download and run reset IPMA learned values - perform IPMA 360 Degree View Camera alignment",
        opCode: "242247A",
        variants: [{ engine: "ALL", opCode: "242247A", time: 0.7 }],
      },
      {
        description: "Engine Illuminated MIL With DTCs (3.0L - variant A)",
        opCode: "242271A",
        variants: [
          { engine: "3.0L DSL", qualifier: "INSPECT", opCode: "242271A", time: 0.2 },
          { engine: "3.0L DSL", qualifier: "REPAIR/REPLACE", opCode: "242271B", time: 1.2 },
          { engine: "3.0L DSL", qualifier: "REPAIR/REPLACE", opCode: "242271C", time: 0.4 },
        ],
      },
      {
        description: "Engine Illuminated MIL With DTCs (3.0L - variant B)",
        opCode: "242272A",
        variants: [
          { engine: "3.0L DSL", qualifier: "INSPECT", opCode: "242272A", time: 0.2 },
          { engine: "3.0L DSL", qualifier: "REPAIR/REPLACE", opCode: "242272B", time: 1.2 },
          { engine: "3.0L DSL", qualifier: "REPAIR/REPLACE", opCode: "242272C", time: 0.3 },
          { engine: "3.0L DSL", qualifier: "REPAIR/REPLACE", opCode: "242272D", time: 0.3 },
          { engine: "3.0L DSL", qualifier: "REPAIR/REPLACE", opCode: "242272E", time: 0.4 },
        ],
      },
      {
        description: "Connect FDRS and check for DTCs - update DDM and PDM to latest software includes power door window initialization",
        opCode: "242273A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "242273A", time: 0.4 }],
      },
      {
        description: "Connect FDRS to check and clear DTC - perform the appropriate FDRS camera alignment procedure",
        opCode: "242286A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "242286A", time: 0.7 }],
      },
      {
        description: "Liftgate Water Leak from the Liftgate Mounted Rear Lamp (7 tier)",
        opCode: "242301A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "242301A", time: 0.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242301B", time: 0.1 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242301C", time: 0.4 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242301D", time: 0.1 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242301E", time: 0.2 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242301F", time: 0.2 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242301G", time: 0.4 },
        ],
      },
      {
        description: "Reprogram Accessory Protocol Interface Module",
        opCode: "242335A",
        variants: [{ engine: "ALL", opCode: "242335A", time: 1.5 }],
      },
      {
        description: "Liftgate Water Leak from the Liftgate Mounted Rear Lamp (6 tier)",
        opCode: "242338A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "242338A", time: 0.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242338B", time: 0.1 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242338C", time: 0.4 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242338D", time: 0.2 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242338E", time: 0.1 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242338F", time: 0.2 },
        ],
      },
      {
        description: "B Pillar Ticking Sound with OLD Grab Handle Bracket Design",
        opCode: "242346A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "242346A", time: 1.0 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242346B", time: 1.8 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242346C", time: 1.4 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242346D", time: 2.4 },
        ],
      },
      {
        description: "Connect the FDRS to the vehicle and check for DTCs",
        opCode: "242373A",
        variants: [{ engine: "ALL", opCode: "242373A", time: 0.2 }],
      },
      {
        description: "Road test the vehicle and ensure correct operation",
        opCode: "242373B",
        variants: [{ engine: "ALL", opCode: "242373B", time: 0.4 }],
      },
      {
        description: "Remove all glow plugs to inspect and replace - refit as required",
        opCode: "242373C",
        variants: [{ engine: "3.0L DSL", opCode: "242373C", time: 1.3 }],
      },
      {
        description: "Liftgate Water Leak from the Liftgate Mounted Rear Lamp",
        opCode: "242376A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "242376A", time: 0.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242376B", time: 0.1 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242376C", time: 0.4 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242376D", time: 0.2 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242376E", time: 0.1 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242376F", time: 0.2 },
        ],
      },
      {
        description: "Update the IPC software",
        opCode: "242381A",
        variants: [{ engine: "ALL", opCode: "242381A", time: 0.5 }],
      },
      {
        description: "Bi Turbo Engine Staining at the High Pressure Low Pressure Bi Turbo Joint",
        opCode: "242390A",
        variants: [
          { engine: "2.0LPan Bi", qualifier: "INSPECT", opCode: "242390A", time: 0.2 },
          { engine: "2.0LPan Bi", qualifier: "REPAIR/REPLACE", opCode: "242390B", time: 1.0 },
          { engine: "2.0LPan Bi", qualifier: "REPAIR/REPLACE", opCode: "242390C", time: 5.1 },
        ],
      },
      {
        description: "Accelerated Wear of the Rear Inner Brake Pads or Scraping and Grinding Noises",
        opCode: "242417A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "242417A", time: 0.2 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242417B", time: 0.7 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "242417C", time: 0.5 },
        ],
      },

      // === Campaign/FSA 24Bxx series ===
      {
        description: "Remove and Install Charge Air Cooler Duct",
        opCode: "24B33B",
        variants: [{ engine: "ALL", opCode: "24B33B", time: 0.4 }],
      },
      {
        description: "Mobile Service (24B33)",
        opCode: "24B33MM",
        variants: [{ engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "24B33MM", time: 0.5 }],
      },
      {
        description: "Replace dipstick and install label",
        opCode: "24B49B",
        variants: [{ engine: "ALL", opCode: "24B49B", time: 0.3 }],
      },
      {
        description: "Mobile Service (24B49)",
        opCode: "24B49MM",
        variants: [{ engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "24B49MM", time: 0.5 }],
      },
      {
        description: "Check for GWM APIM TCU - ALL Modules at latest software level - No reprogramming required - Closes CSP 24B50",
        opCode: "24B50A",
        variants: [{ engine: "ALL", opCode: "24B50A", time: 0.3 }],
      },
      {
        description: "Reprogram the modules as mentioned in the Service Procedure (24B50)",
        opCode: "24B50B",
        variants: [{ engine: "ALL", opCode: "24B50B", time: 1.0 }],
      },
      {
        description: "Mobile Service (24B50)",
        opCode: "24B50MM",
        variants: [{ engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "24B50MM", time: 0.5 }],
      },
      {
        description: "Rework cooling fan relay wiring and replace cooling fan relay",
        opCode: "24B51B",
        variants: [{ engine: "ALL", opCode: "24B51B", time: 0.8 }],
      },
      {
        description: "Mobile Service (24B51)",
        opCode: "24B51MM",
        variants: [{ engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "24B51MM", time: 0.5 }],
      },
      {
        description: "Vehicle Pick up and Delivery Allowance (24B51)",
        opCode: "24B51PP",
        variants: [{ engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "24B51PP", time: 0.5 }],
      },

      // === Campaign/FSA 24Cxx series ===
      {
        description: "Update the DDM and PDM Software on all doors using FDRS",
        opCode: "24C24B",
        variants: [{ engine: "ALL", opCode: "24C24B", time: 0.4 }],
      },
      {
        description: "Lincoln Vehicle Pick up and Delivery PDL Allowance (24C24)",
        opCode: "24C24LL",
        variants: [{ engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "24C24LL", time: 0.5 }],
      },
      {
        description: "Mobile Service (24C24)",
        opCode: "24C24MM",
        variants: [{ engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "24C24MM", time: 0.5 }],
      },
      {
        description: "Ford Vehicle Pick up and Delivery Allowance (24C24)",
        opCode: "24C24PP",
        variants: [{ engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "24C24PP", time: 0.5 }],
      },

      // === Campaign/FSA 24Pxx series ===
      {
        description: "Update the PCM Calibration",
        opCode: "24P13B",
        variants: [{ engine: "ALL", opCode: "24P13B", time: 0.3 }],
      },
      {
        description: "Inspect all glow plugs using inspection mirror",
        opCode: "24P37A",
        variants: [{ engine: "ALL", opCode: "24P37A", time: 0.5 }],
      },
      {
        description: "Inspect all glow plugs and replace suspect FAILED parts",
        opCode: "24P37B",
        variants: [{ engine: "ALL", opCode: "24P37B", time: 1.1 }],
      },

      // === TSB Operations 25xxxx series ===
      {
        description: "B Pillar Ticking Sound with OLD Grab Handle Bracket Design",
        opCode: "252026A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "252026A", time: 1.0 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252026B", time: 1.8 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252026C", time: 1.4 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252026D", time: 2.4 },
        ],
      },
      {
        description: "Partial Digital Cluster Display - Vehicle Can Not Start Caused By Battery KOL",
        opCode: "252046A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "252046A", time: 0.2 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252046B", time: 0.2 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252046C", time: 0.5 },
        ],
      },
      {
        description: "Connect FDRS and Reflash PCM to the latest service calibration using the latest FDRS software release",
        opCode: "252060A",
        variants: [
          { engine: "2.0L Panth", opCode: "252060A", time: 0.5 },
          { engine: "2.0LPan Bi", opCode: "252060A", time: 0.5 },
        ],
      },
      {
        description: "Connect FDRS and Reflash the TCM to the latest service calibration includes road test",
        opCode: "252078A",
        variants: [{ engine: "ALL", opCode: "252078A", time: 0.5 }],
      },
      {
        description: "Remove Front and Rear Door trim panel and Door Glass Run Rubber and Attach Adhesive tape for All 4 doors",
        opCode: "252094A",
        variants: [{ engine: "ALL", qualifier: "INSPECT", opCode: "252094A", time: 2.4 }],
      },
      {
        description: "Airbag Warning Lamp Illuminated - DTC Restraint Control Module",
        opCode: "252101A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "252101A", time: 0.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252101B", time: 0.9 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252101C", time: 0.1 },
        ],
      },
      {
        description: "Trailer Disconnected Message Displayed while Towing Trailers Equipped with EOH Brakes",
        opCode: "252115A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "252115A", time: 0.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252115B", time: 0.3 },
        ],
      },
      {
        description: "Reprogram Accessory Protocol Interface Module",
        opCode: "252135A",
        variants: [{ engine: "ALL", opCode: "252135A", time: 1.5 }],
      },
      {
        description: "Accelerated Wear of the Rear Inner Brake Pads or Scraping and Grinding Noises",
        opCode: "252147A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "252147A", time: 0.2 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252147B", time: 0.9 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252147C", time: 0.5 },
        ],
      },
      {
        description: "12 Inch Center Display Screen Hardware Concerns",
        opCode: "252151A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "252151A", time: 1.5 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252151B", time: 0.2 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252151C", time: 0.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252151E", time: 1.7 },
        ],
      },
      {
        description: "Floor Console Upper Trim Panel Replace",
        opCode: "252173A",
        variants: [{ engine: "ALL", opCode: "252173A", time: 0.5 }],
      },
      {
        description: "Remove and refit front door trim sides for Ranger Raptor Wildtrak Stormtrak Platinum and Everest all series",
        opCode: "252177B",
        variants: [{ engine: "ALL", opCode: "252177B", time: 0.6 }],
      },
      {
        description: "Liftgate Unintentionally Opens by Itself Intermittently",
        opCode: "252183A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "252183A", time: 0.2 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252183B", time: 0.1 },
        ],
      },
      {
        description: "Front Drive Half Shaft Grease Seeps or Leaks",
        opCode: "252204A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "252204A", time: 0.4 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252204B", time: 1.8 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252204C", time: 1.8 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252204D", time: 3.1 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252204E", time: 0.4 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252204F", time: 0.6 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252204G", time: 1.1 },
        ],
      },
      {
        description: "4WD Inoperative Illuminated MIL with DTCs Stored in the AWD Module",
        opCode: "252250A",
        notes: "4WHL L/H PART TIME DRIVE, 4WHL R/H FULL TIME DRIVE, 4WHL R/H PART TIME DRIVE",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "252250A", time: 0.2 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252250B", time: 0.3 },
        ],
      },
      {
        description: "Roof Opening Panel Water Leak at the A Pillar Trim Panel, A Pillar Assist handle and or Overhead Console",
        opCode: "252305A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "252305A", time: 0.8 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252305B", time: 2.4 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252305C", time: 0.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252305D", time: 0.2 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252305E", time: 0.4 },
        ],
      },
      {
        description: "Front Windshield Camera Front Camera Fault Service Required Message with DTC",
        opCode: "252316A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "252316A", time: 1.6 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252316B", time: 1.7 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252316C", time: 0.5 },
        ],
      },
      {
        description: "Power Folding Mirrors Exterior Mirror Noise When Folding and Unfolding",
        opCode: "252327A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "252327A", time: 0.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252327B", time: 0.6 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252327C", time: 1.0 },
        ],
      },
      {
        description: "Loss Of Power with an Illuminated MIL and DTCs",
        opCode: "252334A",
        variants: [
          { engine: "2.0L Panth", qualifier: "INSPECT", opCode: "252334A", time: 0.2 },
          { engine: "2.0L Panth", qualifier: "REPAIR/REPLACE", opCode: "252334B", time: 1.5 },
          { engine: "2.0LPan Bi", qualifier: "INSPECT", opCode: "252334A", time: 0.2 },
          { engine: "2.0LPan Bi", qualifier: "REPAIR/REPLACE", opCode: "252334B", time: 1.5 },
        ],
      },
      {
        description: "Water Leak from the Roof Opening Panel into the Cabin Via the Sunglass Holder or Grab Handle",
        opCode: "252463A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "252463A", time: 0.2 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252463B", time: 0.9 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252463C", time: 2.4 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252463D", time: 0.7 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252463E", time: 0.5 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252463F", time: 0.2 },
        ],
      },
      {
        description: "Staining At The HP/LP Bi Turbo Joint",
        opCode: "252472A",
        variants: [
          { engine: "2.0LPan Bi", qualifier: "INSPECT", opCode: "252472A", time: 0.2 },
          { engine: "2.0LPan Bi", qualifier: "REPAIR/REPLACE", opCode: "252472B", time: 1.0 },
          { engine: "2.0LPan Bi", qualifier: "REPAIR/REPLACE", opCode: "252472C", time: 5.1 },
          { engine: "2.0LPan Bi", qualifier: "REPAIR/REPLACE", opCode: "252472D", time: 5.6 },
        ],
      },
      {
        description: "Aluminum Front Wheel Knuckles Bearing Failures or Front End Noises",
        opCode: "252488A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "252488A", time: 0.4 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252488B", time: 0.9 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252488C", time: 1.5 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252488D", time: 0.8 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252488E", time: 1.4 },
        ],
      },
      {
        description: "B Pillar Ticking Sound with NEW Grab Handle Design",
        opCode: "252553A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "252553A", time: 1.0 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252553B", time: 1.8 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252553C", time: 1.2 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252553D", time: 2.2 },
        ],
      },
      {
        description: "Aluminum Front Wheel Knuckles Bearing Failures or Front End Noises",
        opCode: "252582A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "252582A", time: 0.4 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252582B", time: 0.8 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252582C", time: 1.4 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252582D", time: 0.7 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252582E", time: 1.1 },
        ],
      },
      {
        description: "360 Degree Camera and FLA Towing Mirrors - Reverse Brake Assist Not Available Message and or DTC",
        opCode: "252634A",
        variants: [
          { engine: "ALL", qualifier: "INSPECT", opCode: "252634A", time: 0.5 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252634B", time: 0.6 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252634C", time: 0.3 },
          { engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "252634D", time: 0.8 },
        ],
      },

      // === Campaign/FSA 25Cxx series ===
      {
        description: "Update the DDM and PDM Software on all doors using FDRS",
        opCode: "25C10B",
        variants: [{ engine: "ALL", opCode: "25C10B", time: 0.4 }],
      },
      {
        description: "Lincoln Vehicle Pickup and Delivery Allowance (25C10)",
        opCode: "25C10LL",
        variants: [{ engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "25C10LL", time: 0.5 }],
      },
      {
        description: "Mobile Service (25C10)",
        opCode: "25C10MM",
        variants: [{ engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "25C10MM", time: 0.5 }],
      },
      {
        description: "Ford Vehicle Pickup and Delivery Allowance (25C10)",
        opCode: "25C10PP",
        variants: [{ engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "25C10PP", time: 0.5 }],
      },
      {
        description: "PCM calibration software level check and Reductant Injector Replace",
        opCode: "25C73B",
        variants: [{ engine: "ALL", opCode: "25C73B", time: 0.7 }],
      },
      {
        description: "PCM calibration software level check update and Reductant Injector Replace",
        opCode: "25C73C",
        variants: [{ engine: "ALL", opCode: "25C73C", time: 0.9 }],
      },
      {
        description: "Ford Vehicle Pickup and Delivery Allowance (25C73)",
        opCode: "25C73PP",
        variants: [{ engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "25C73PP", time: 0.5 }],
      },

      // === Campaign/FSA 25Nxx series ===
      {
        description: "Test battery using approved Ford battery tester - Battery fail Replace FLA battery with AGM - Update BCM configuration and associated sensors",
        opCode: "25N06B",
        variants: [{ engine: "ALL", opCode: "25N06B", time: 0.5 }],
      },
      {
        description: "Mobile Service (25N06)",
        opCode: "25N06MM",
        variants: [{ engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "25N06MM", time: 0.5 }],
      },

      // === Campaign/FSA 25Pxx series ===
      {
        description: "Software update to BCM or HCM",
        opCode: "25P27B",
        variants: [{ engine: "ALL", opCode: "25P27B", time: 0.2 }],
      },

      // === Campaign/FSA 25Sxx series ===
      {
        description: "Inspect engine lefthand camshaft sprocket and submit photos - If PASS FSA Completed Closed",
        opCode: "25S39A",
        variants: [{ engine: "ALL", opCode: "25S39A", time: 0.4 }],
      },
      {
        description: "Inspect lefthand camshaft sprocket submit photos - If FAIL HOLD vehicle until full repair procedure parts available",
        opCode: "25S39B",
        variants: [{ engine: "ALL", opCode: "25S39B", time: 0.4 }],
      },
      {
        description: "Inspect left hand camshaft sprocket and submit GCR with photos - If FAIL Replace lefthand camshaft sprocket and associated parts",
        opCode: "25S39C",
        variants: [{ engine: "ALL", opCode: "25S39C", time: 4.6 }],
      },
      {
        description: "Ford Vehicle Pickup and Delivery Allowance (25S39)",
        opCode: "25S39PP",
        variants: [{ engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "25S39PP", time: 0.5 }],
      },
      {
        description: "All Vehicles Software at the latest level",
        opCode: "25S49A",
        variants: [{ engine: "ALL", opCode: "25S49A", time: 0.3 }],
      },
      {
        description: "Attestation Labor Time to submit attestation form and close recall",
        opCode: "25S49D",
        variants: [{ engine: "ALL", opCode: "25S49D", time: 0.2 }],
      },
      {
        description: "Lincoln Vehicle Pickup and Delivery Allowance (25S49)",
        opCode: "25S49LL",
        variants: [{ engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "25S49LL", time: 0.5 }],
      },
      {
        description: "Ford Vehicle Pickup and Delivery Allowance (25S49)",
        opCode: "25S49PP",
        variants: [{ engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "25S49PP", time: 0.5 }],
      },

      // === Campaign/FSA 25SCx series ===
      {
        description: "Interim Repair Fuse removal - Will not close the FSA",
        opCode: "25SC8B",
        variants: [{ engine: "ALL", opCode: "25SC8B", time: 0.2 }],
      },
      {
        description: "Inspect Solis wiring connectors - No Damage - rerouting of wiring harness and installing patch harness with relay - Will Close FSA",
        opCode: "25SC8C",
        variants: [{ engine: "ALL", opCode: "25SC8C", time: 1.0 }],
      },
      {
        description: "Inspect Solis wiring connectors - Damage found - replace Solis wiring harness kit including ONE light - Includes installing patch harness with relay",
        opCode: "25SC8D",
        variants: [{ engine: "ALL", opCode: "25SC8D", time: 1.2 }],
      },
      {
        description: "Inspect Solis wiring connectors - Damage found - replace Solis wiring harness kit including TWO lights - Includes installing patch harness with relay",
        opCode: "25SC8E",
        variants: [{ engine: "ALL", opCode: "25SC8E", time: 1.3 }],
      },
      {
        description: "Mobile Service (25SC8)",
        opCode: "25SC8MM",
        variants: [{ engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "25SC8MM", time: 0.5 }],
      },
      {
        description: "Ford Vehicle Pickup and Delivery Allowance (25SC8)",
        opCode: "25SC8PP",
        variants: [{ engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "25SC8PP", time: 0.5 }],
      },

      // === Campaign/FSA 25SFx series ===
      {
        description: "Update the PCM Calibration",
        opCode: "25SF1B",
        variants: [{ engine: "ALL", opCode: "25SF1B", time: 0.3 }],
      },
      {
        description: "Mobile Service (25SF1)",
        opCode: "25SF1MM",
        variants: [{ engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "25SF1MM", time: 0.5 }],
      },
      {
        description: "Ford Vehicle Pickup and Delivery Allowance (25SF1)",
        opCode: "25SF1PP",
        variants: [{ engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "25SF1PP", time: 0.5 }],
      },

      // === Special codes ===
      {
        description: "Replace RAV (ReAcquired Vehicle) Warranty requested labor time",
        opCode: "RAV",
        variants: [{ engine: "ALL", opCode: "RAV", time: 1.0 }],
      },
      {
        description: "Software Update Repair Validation",
        opCode: "SRVZZ",
        variants: [{ engine: "ALL", qualifier: "REPAIR/REPLACE", opCode: "SRVZZ", time: 0.2 }],
      },

      // === Original misc entries ===
      {
        description: "Additional - Misc. Repairs",
        opCode: "999A",
        baseTime: 0.2,
        notes: "This time can be used for work done by a third person.",
        variants: [{ engine: "ALL", opCode: "999A", time: 0.2 }],
      },
      {
        description: "Component Replacement - Prior Approval",
        opCode: "PRIOR",
        baseTime: 0.3,
        notes: "Includes time to contact hotline and complete online forms. Cannot be used for ESP claims.",
        variants: [{ engine: "ALL", opCode: "PRIOR", time: 0.3 }],
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
