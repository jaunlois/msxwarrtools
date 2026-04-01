import { sltSections } from "@/data/slt-data";
import type { SLTMatch, CCCMatch } from "./types";

export function matchSLTCode(opCode: string): SLTMatch | null {
  const normalizedCode = opCode.replace(/\s+/g, "").toUpperCase();
  
  for (const section of sltSections) {
    for (const op of section.operations) {
      if (op.opCode.replace(/\s+/g, "").toUpperCase() === normalizedCode) {
        // Get hours from first variant or base
        const hours = op.variants?.length ? op.variants[0].hours : 0;
        return {
          opCode: op.opCode,
          description: op.description,
          hours,
          section: section.name,
        };
      }
    }
  }
  
  // Try partial match (e.g., "18124A" matches "18124A")
  for (const section of sltSections) {
    for (const op of section.operations) {
      if (op.opCode.includes(normalizedCode) || normalizedCode.includes(op.opCode.replace(/\s+/g, "").toUpperCase())) {
        const hours = op.variants?.length ? op.variants[0].hours : 0;
        return {
          opCode: op.opCode,
          description: op.description,
          hours,
          section: section.name,
        };
      }
    }
  }

  return null;
}

export function matchMultipleSLTCodes(opCodes: string[]): Map<string, SLTMatch> {
  const matches = new Map<string, SLTMatch>();
  
  for (const code of opCodes) {
    // Handle combined codes like "3010B+3010E"
    const subCodes = code.split(/[+&]/);
    for (const sub of subCodes) {
      const trimmed = sub.trim();
      if (trimmed) {
        const match = matchSLTCode(trimmed);
        if (match) {
          matches.set(trimmed, match);
        }
      }
    }
  }
  
  return matches;
}

// Simple CCC suggestion based on keyword matching
export function suggestCCCCodes(description: string): CCCMatch[] {
  const suggestions: CCCMatch[] = [];
  const desc = description.toLowerCase();

  const keywordMap: { keywords: string[]; code: string; description: string; condCode: string; condDesc: string }[] = [
    { keywords: ["shock", "absorber", "strut"], code: "S19", description: "Shock Absorber/Strut", condCode: "C", condDesc: "Broken" },
    { keywords: ["noise", "knocking", "rattle"], code: "N01", description: "Noise/Vibration", condCode: "A", condDesc: "Abnormal Noise" },
    { keywords: ["leak", "leaking", "seepage"], code: "L01", description: "Leak", condCode: "D", condDesc: "Leaking" },
    { keywords: ["prop shaft", "drive shaft", "driveshaft"], code: "D15", description: "Driveshaft/Propshaft", condCode: "V", condDesc: "Vibration" },
    { keywords: ["differential", "diff"], code: "D08", description: "Differential", condCode: "D", condDesc: "Leaking" },
    { keywords: ["spring", "suspension"], code: "S23", description: "Suspension Spring", condCode: "C", condDesc: "Broken" },
    { keywords: ["steering"], code: "S25", description: "Steering System", condCode: "H", condDesc: "Hard to Operate" },
    { keywords: ["engine", "motor"], code: "E01", description: "Engine", condCode: "M", condDesc: "Malfunction" },
    { keywords: ["transmission", "gearbox"], code: "T01", description: "Transmission", condCode: "M", condDesc: "Malfunction" },
    { keywords: ["brake"], code: "B01", description: "Brakes", condCode: "N", condDesc: "Noisy" },
    { keywords: ["bearing"], code: "B05", description: "Bearing", condCode: "W", condDesc: "Worn" },
  ];

  for (const entry of keywordMap) {
    if (entry.keywords.some(kw => desc.includes(kw))) {
      suggestions.push({
        code: entry.code,
        description: entry.description,
        conditionCode: entry.condCode,
        conditionDescription: entry.condDesc,
      });
    }
  }

  return suggestions;
}
