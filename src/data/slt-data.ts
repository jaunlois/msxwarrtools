export interface SLTVariant {
  engine: string;
  drivetrain?: string;
  qualifier?: string; // ONE, BOTH, ALL, LEFT, RIGHT, UPPER, LOWER, FRONT, REAR, etc.
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
  condition?: string; // e.g. "For vehicles equipped with; 3.0L DIESEL"
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
        description: "Wheel Assembly (1007/ 1015/ P1007) - Remove and Install",
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
        ],
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
        variants: [
          { engine: "ALL", opCode: "2000A", time: 0.3 },
        ],
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
        variants: [
          { engine: "ALL", opCode: "2219A", time: 0.6 },
        ],
        overlaps: [],
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
        variants: [
          { engine: "ALL", opCode: "3001A", time: 0.7 },
        ],
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
        opCode: "7000A",
        baseTime: 0.3,
        variants: [{ engine: "ALL", opCode: "7000A", time: 0.3 }],
        overlaps: [],
        supplements: [
          { description: "Extra Time For A Post-Repair Road Test", opCode: "7000AXQ", time: 0.2 },
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
          { claiming: "7003A", doNotUseWith: ["7191A", "7396A"] },
        ],
        supplements: [
          { description: "Extra Time For A Post-Repair Road Test", opCode: "7003AXQ", time: 0.2 },
        ],
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
          { claiming: "7191A", doNotUseWith: ["7003A"] },
        ],
      },
      {
        description: "Transfer Case Assembly (7005) - Replace",
        opCode: "7396A",
        variants: [
          { engine: "2.0LPan Bi", drivetrain: "4WD", opCode: "7396A", time: 3.0 },
          { engine: "3.0L DSL", drivetrain: "4WD", opCode: "7396A", time: 3.5 },
        ],
        overlaps: [
          { claiming: "7396A", doNotUseWith: ["7003A"] },
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
        description: "Pump - Fuel Injection (9350/ 9A543) - Replace",
        opCode: "9543A",
        variants: [
          { engine: "2.0L Panth", opCode: "9543A", time: 2.4 },
          { engine: "2.0LPan Bi", opCode: "9543A", time: 2.4 },
          { engine: "3.0L DSL", drivetrain: "4WD Full Time", opCode: "9543A", time: 3.7 },
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
        ],
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
        description: "Air Bag Restraint System - Diagnosis",
        opCode: "14056D",
        baseTime: 0.3,
        variants: [{ engine: "ALL", opCode: "14056D", time: 0.3 }],
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
        description: "Injector Assy High Pressure (Fuel) - Replace",
        opCode: "12650D53",
        variants: [
          { engine: "2.0LPan Bi", qualifier: "ONE", opCode: "12650D53D", time: 0.7 },
          { engine: "2.0LPan Bi", qualifier: "TWO OR MORE", opCode: "12650D53DT", time: 1.5 },
          { engine: "3.0L DSL", qualifier: "RIGHT ONE", opCode: "12650D53R", time: 0.6 },
          { engine: "3.0L DSL", qualifier: "LEFT ONE", opCode: "12650D53L", time: 0.7 },
          { engine: "3.0L DSL", qualifier: "ALL BOTH SIDES", opCode: "12650D53T", time: 2.2 },
        ],
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
        description: "Wiper Motor - Windshield (17504/ 17508) - Replace",
        opCode: "17508A",
        baseTime: 0.5,
        variants: [{ engine: "ALL", opCode: "17508A", time: 0.5 }],
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
        description: "Cover Assembly - Front Bumper Fascia - Replace",
        opCode: "17957A",
        baseTime: 3.1,
        variants: [{ engine: "ALL", opCode: "17957A", time: 3.1 }],
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
        ],
      },
      {
        description: "Core-Heater (18476/ 18B539) - Replace",
        opCode: "18476A",
        variants: [
          { engine: "ALL", opCode: "18476A", time: 4.9 },
        ],
        overlaps: [],
      },
      {
        description: "Audio Unit (18806) - Replace",
        opCode: "18805E",
        baseTime: 1.9,
        variants: [{ engine: "ALL", opCode: "18805E", time: 1.9 }],
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
        description: "Glass - Windshield (03100) - Replace",
        opCode: "03100A",
        baseTime: 1.2,
        variants: [{ engine: "ALL", opCode: "03100A", time: 1.2 }],
        overlaps: [],
      },
      {
        description: "Instrument Panel (04320) - Replace",
        opCode: "04320A",
        variants: [{ engine: "ALL", opCode: "04320A", time: 4.5 }],
        overlaps: [],
      },
      {
        description: "Trim Panel - Front Door - Remove and Install",
        opCode: "23943A",
        variants: [
          { engine: "ALL", qualifier: "ONE", opCode: "23943A", time: 0.3 },
          { engine: "ALL", qualifier: "BOTH", opCode: "23943AT", time: 0.6 },
        ],
        overlaps: [],
        combinations: [
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
        ],
      },
      {
        description: "Headlining-Roof - Replace",
        opCode: "51916A",
        baseTime: 3.1,
        variants: [{ engine: "ALL", opCode: "51916A", time: 3.1 }],
        overlaps: [],
      },
      {
        description: "Seat Belt Retractor Assy - Front - Replace",
        opCode: "61108A",
        variants: [
          { engine: "ALL", qualifier: "RIGHT", opCode: "61108AR", time: 0.5 },
          { engine: "ALL", qualifier: "LEFT", opCode: "61108AL", time: 0.5 },
          { engine: "ALL", qualifier: "BOTH", opCode: "61108AT", time: 0.8 },
        ],
        overlaps: [],
      },
      {
        description: "Door and Window - Wind Noise/Water Leaks - Diagnosis",
        opCode: "69000A",
        baseTime: 0.2,
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
        notes: "Includes time to rotate and inspect tires, visually inspect brake system, exhaust system, front end components.",
        variants: [{ engine: "ALL", opCode: "MBASIC", time: 0.8 }],
        overlaps: [],
        combinations: [
          {
            description: "Engine Oil and Oil Filter - Replace",
            variants: [
              { engine: "2.0LPan Bi", opCode: "MBASIC1", time: 0.4 },
              { engine: "2.3L GTDI", opCode: "MBASIC1", time: 0.2 },
              { engine: "3.0L DSL", opCode: "MBASIC1", time: 0.3 },
            ],
          },
          {
            description: "Engine Air Filter - Replace",
            variants: [{ engine: "ALL", opCode: "MBASIC2", time: 0.1 }],
          },
          {
            description: "Cabin Air Filter - Replace",
            variants: [{ engine: "ALL", opCode: "MBASIC4", time: 0.1 }],
          },
          {
            description: "Filter Assembly - Fuel - Replace",
            variants: [
              { engine: "2.0LPan Bi", opCode: "MBASIC7", time: 0.3 },
              { engine: "2.3L GTDI", opCode: "MBASIC7", time: 0.4 },
              { engine: "3.0L DSL", opCode: "MBASIC7", time: 0.3 },
            ],
          },
          {
            description: "Spark Plugs - Replace",
            variants: [{ engine: "2.3L GTDI", opCode: "MBASIC8", time: 0.6 }],
          },
          {
            description: "Coolant - Change",
            variants: [
              { engine: "2.0L Panth", opCode: "MBASIC9", time: 0.5 },
              { engine: "2.0LPan Bi", opCode: "MBASIC9", time: 0.5 },
              { engine: "2.3L GTDI", opCode: "MBASIC9", time: 0.5 },
              { engine: "3.0L DSL", opCode: "MBASIC9", time: 0.5 },
            ],
          },
          {
            description: "Accessory Drive Belt(s) - Replace",
            variants: [
              { engine: "2.0LPan Bi", opCode: "MBASIC10", time: 1.0 },
              { engine: "2.3L GTDI", opCode: "MBASIC10", time: 0.3 },
              { engine: "3.0L DSL", opCode: "MBASIC10", time: 0.2 },
            ],
          },
          {
            description: "Automatic Transmission Fluid - Change",
            variants: [
              { engine: "2.0LPan Bi", drivetrain: "10R80", opCode: "MBASIC11", time: 1.1 },
              { engine: "3.0L DSL", drivetrain: "10R80", opCode: "MBASIC11", time: 1.7 },
            ],
          },
          {
            description: "Transfer Case Fluid (4X4) - Change",
            variants: [
              { engine: "ALL", drivetrain: "4WD Full Time", opCode: "MBASIC12", time: 0.4 },
              { engine: "ALL", drivetrain: "4WD Part Time", opCode: "MBASIC12", time: 0.4 },
            ],
          },
          {
            description: "Rear Axle Fluid - Change",
            variants: [
              { engine: "ALL", drivetrain: "2WD", opCode: "MBASIC13", time: 0.3 },
              { engine: "ALL", drivetrain: "4WD Full Time", opCode: "MBASIC13", time: 0.3 },
              { engine: "ALL", drivetrain: "4WD Part Time", opCode: "MBASIC13", time: 0.3 },
            ],
          },
          {
            description: "Front Axle Fluid (4X4) - Change",
            variants: [
              { engine: "ALL", drivetrain: "4WD Full Time", opCode: "MBASIC14", time: 0.2 },
              { engine: "ALL", drivetrain: "4WD Part Time", opCode: "MBASIC14", time: 0.2 },
            ],
          },
          {
            description: "Timing Belt - Replace",
            variants: [
              { engine: "2.0LPan Bi", opCode: "MBASIC18", time: 4.0 },
              { engine: "3.0L DSL", opCode: "MBASIC18", time: 5.1 },
            ],
          },
          {
            description: "Brake Fluid - Change",
            variants: [{ engine: "ALL", opCode: "MBASIC31", time: 0.3 }],
          },
          {
            description: "Front Brake Pads - Replace",
            variants: [{ engine: "ALL", opCode: "MBASIC53", time: 0.5 }],
          },
          {
            description: "Rear Brake Shoes or Pads - Replace",
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
  const codeSet = new Set(operationCodes.map(c => c.toUpperCase()));

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
