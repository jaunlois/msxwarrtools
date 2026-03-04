export interface PartCoverage {
  partNumber: string;
  description: string;
  wearCare: boolean;
  powertrainCare: boolean;
  extraCare: boolean;
  premiumMaintenance: boolean;
}

// Representative sample data - in production this would come from data.json
export const partsData: PartCoverage[] = [
  { partNumber: "6007", description: "Engine Assembly", wearCare: false, powertrainCare: true, extraCare: true, premiumMaintenance: true },
  { partNumber: "6051", description: "Cylinder Head Gasket", wearCare: false, powertrainCare: true, extraCare: true, premiumMaintenance: true },
  { partNumber: "6256", description: "Timing Chain / Belt", wearCare: false, powertrainCare: true, extraCare: true, premiumMaintenance: true },
  { partNumber: "6500", description: "Camshaft", wearCare: false, powertrainCare: true, extraCare: true, premiumMaintenance: true },
  { partNumber: "6584", description: "Valve Cover Gasket", wearCare: false, powertrainCare: false, extraCare: true, premiumMaintenance: true },
  { partNumber: "6675", description: "Oil Pan Gasket", wearCare: false, powertrainCare: false, extraCare: true, premiumMaintenance: true },
  { partNumber: "7003", description: "Transmission Assembly", wearCare: false, powertrainCare: true, extraCare: true, premiumMaintenance: true },
  { partNumber: "7191", description: "Torque Converter", wearCare: false, powertrainCare: true, extraCare: true, premiumMaintenance: true },
  { partNumber: "7396", description: "Transfer Case Assembly", wearCare: false, powertrainCare: true, extraCare: true, premiumMaintenance: true },
  { partNumber: "8005", description: "Radiator Assembly", wearCare: false, powertrainCare: false, extraCare: true, premiumMaintenance: true },
  { partNumber: "8501", description: "Water Pump", wearCare: false, powertrainCare: true, extraCare: true, premiumMaintenance: true },
  { partNumber: "8620", description: "Serpentine Belt", wearCare: true, powertrainCare: true, extraCare: true, premiumMaintenance: true },
  { partNumber: "8621", description: "Radiator Cooling Fan Motor", wearCare: false, powertrainCare: false, extraCare: true, premiumMaintenance: true },
  { partNumber: "9155", description: "Fuel Filter Assembly", wearCare: true, powertrainCare: true, extraCare: true, premiumMaintenance: true },
  { partNumber: "9280", description: "Fuel Rail Assembly - High Pressure", wearCare: false, powertrainCare: true, extraCare: true, premiumMaintenance: true },
  { partNumber: "9438", description: "Turbocharger Assembly", wearCare: false, powertrainCare: true, extraCare: true, premiumMaintenance: true },
  { partNumber: "9543", description: "Fuel Injection Pump", wearCare: false, powertrainCare: true, extraCare: true, premiumMaintenance: true },
  { partNumber: "10346", description: "Alternator", wearCare: false, powertrainCare: false, extraCare: true, premiumMaintenance: true },
  { partNumber: "10654", description: "Battery", wearCare: true, powertrainCare: true, extraCare: true, premiumMaintenance: true },
  { partNumber: "11002", description: "Starter Motor", wearCare: false, powertrainCare: false, extraCare: true, premiumMaintenance: true },
  { partNumber: "12650", description: "EEC / PCM Module", wearCare: false, powertrainCare: true, extraCare: true, premiumMaintenance: true },
  { partNumber: "13007", description: "Headlamp Assembly", wearCare: false, powertrainCare: false, extraCare: true, premiumMaintenance: true },
  { partNumber: "14056", description: "Air Bag / Restraint Module", wearCare: false, powertrainCare: false, extraCare: false, premiumMaintenance: true },
  { partNumber: "17508", description: "Wiper Motor - Windshield", wearCare: false, powertrainCare: false, extraCare: true, premiumMaintenance: true },
  { partNumber: "17682", description: "Exterior Mirror - Electric", wearCare: false, powertrainCare: false, extraCare: false, premiumMaintenance: true },
  { partNumber: "18476", description: "Heater Core", wearCare: false, powertrainCare: false, extraCare: true, premiumMaintenance: true },
  { partNumber: "18805", description: "Audio Unit / Radio", wearCare: false, powertrainCare: false, extraCare: false, premiumMaintenance: true },
  { partNumber: "19700", description: "A/C Compressor Assembly", wearCare: false, powertrainCare: false, extraCare: true, premiumMaintenance: true },
  { partNumber: "1007", description: "Wheel Assembly", wearCare: true, powertrainCare: true, extraCare: true, premiumMaintenance: true },
  { partNumber: "1104", description: "Hub and Bearing Assembly - Front", wearCare: false, powertrainCare: false, extraCare: true, premiumMaintenance: true },
  { partNumber: "2001", description: "Front Disc Brake Pads", wearCare: true, powertrainCare: false, extraCare: true, premiumMaintenance: true },
  { partNumber: "2020", description: "Front Brake Disc", wearCare: true, powertrainCare: false, extraCare: true, premiumMaintenance: true },
  { partNumber: "2200", description: "Rear Disc Brake Pads", wearCare: true, powertrainCare: false, extraCare: true, premiumMaintenance: true },
  { partNumber: "2219", description: "ABS Module", wearCare: false, powertrainCare: false, extraCare: true, premiumMaintenance: true },
  { partNumber: "3050", description: "Ball Joint - Lower Arm", wearCare: false, powertrainCare: false, extraCare: true, premiumMaintenance: true },
  { partNumber: "3130", description: "Stabilizer Bar Link", wearCare: false, powertrainCare: false, extraCare: true, premiumMaintenance: true },
  { partNumber: "3504", description: "Power Steering Pump", wearCare: false, powertrainCare: false, extraCare: true, premiumMaintenance: true },
  { partNumber: "4035", description: "Rear Axle Shaft / Oil Seal", wearCare: false, powertrainCare: true, extraCare: true, premiumMaintenance: true },
  { partNumber: "5212", description: "Exhaust Pipe - Front", wearCare: false, powertrainCare: false, extraCare: true, premiumMaintenance: true },
  { partNumber: "5221", description: "Diesel Particulate Filter (DPF)", wearCare: false, powertrainCare: false, extraCare: true, premiumMaintenance: true },
  { partNumber: "5560", description: "Rear Spring", wearCare: false, powertrainCare: false, extraCare: true, premiumMaintenance: true },
  { partNumber: "9002", description: "Fuel Tank", wearCare: false, powertrainCare: false, extraCare: true, premiumMaintenance: true },
  { partNumber: "9430", description: "Exhaust Manifold / Gasket", wearCare: false, powertrainCare: false, extraCare: true, premiumMaintenance: true },
  { partNumber: "12342", description: "Glow Plug", wearCare: true, powertrainCare: true, extraCare: true, premiumMaintenance: true },
  { partNumber: "03100", description: "Windshield Glass", wearCare: false, powertrainCare: false, extraCare: false, premiumMaintenance: true },
  { partNumber: "23943", description: "Front Door Trim Panel", wearCare: false, powertrainCare: false, extraCare: false, premiumMaintenance: false },
  { partNumber: "51916", description: "Headlining - Roof", wearCare: false, powertrainCare: false, extraCare: false, premiumMaintenance: false },
  { partNumber: "61108", description: "Seat Belt Retractor - Front", wearCare: false, powertrainCare: false, extraCare: false, premiumMaintenance: true },
];

export type PlanTier = 'wearCare' | 'powertrainCare' | 'extraCare' | 'premiumMaintenance';

export const planTierLabels: Record<PlanTier, string> = {
  wearCare: 'WearCare',
  powertrainCare: 'Powertrain Care',
  extraCare: 'Extra Care',
  premiumMaintenance: 'Premium Maintenance',
};

export function getHighestPlan(part: PartCoverage): string {
  if (part.wearCare) return 'WearCare';
  if (part.powertrainCare) return 'Powertrain Care';
  if (part.extraCare) return 'Extra Care';
  if (part.premiumMaintenance) return 'Premium Maintenance';
  return 'Not Covered';
}
