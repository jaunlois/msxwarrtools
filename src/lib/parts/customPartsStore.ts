import type { PartCoverage } from "@/data/parts-data";

export interface CustomPartOverride extends PartCoverage {
  notes?: string;
  addedAt: number;
}

const KEY = "parts-custom-overrides-v1";

export function getCustomParts(): CustomPartOverride[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function saveCustomParts(entries: CustomPartOverride[]) {
  localStorage.setItem(KEY, JSON.stringify(entries));
  window.dispatchEvent(new CustomEvent("parts-custom-updated"));
}

export function upsertCustomPart(entry: Omit<CustomPartOverride, "addedAt">) {
  const all = getCustomParts();
  const i = all.findIndex((e) => e.partNumber === entry.partNumber);
  const rec: CustomPartOverride = { ...entry, addedAt: Date.now() };
  if (i >= 0) all[i] = rec; else all.push(rec);
  saveCustomParts(all);
  return rec;
}

export function deleteCustomPart(partNumber: string) {
  saveCustomParts(getCustomParts().filter((e) => e.partNumber !== partNumber));
}