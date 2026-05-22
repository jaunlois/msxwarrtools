import { cccCodes, type CCCCode } from "@/data/ccc-data";
import { getCustomCcc } from "./customCccStore";

export function getMergedCccCodes(): CCCCode[] {
  const custom = getCustomCcc();
  if (!custom.length) return cccCodes;
  const map = new Map<string, CCCCode>(cccCodes.map((c) => [c.code, c]));
  for (const c of custom) {
    map.set(c.code, {
      code: c.code,
      description: c.description + " (Custom)",
      conditionCode: c.conditionCode,
      category: c.category,
    });
  }
  return Array.from(map.values());
}