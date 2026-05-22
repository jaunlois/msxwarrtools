export interface CustomCccEntry {
  code: string;
  description: string;
  conditionCode: string;
  category: string;
  notes?: string;
  addedAt: number;
}

const KEY = "ccc-custom-entries-v1";

export function getCustomCcc(): CustomCccEntry[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function saveCustomCcc(entries: CustomCccEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries));
  window.dispatchEvent(new CustomEvent("ccc-custom-updated"));
}

export function upsertCustomCcc(entry: Omit<CustomCccEntry, "addedAt">) {
  const all = getCustomCcc();
  const i = all.findIndex((e) => e.code === entry.code);
  const rec: CustomCccEntry = { ...entry, addedAt: Date.now() };
  if (i >= 0) all[i] = rec; else all.push(rec);
  saveCustomCcc(all);
  return rec;
}

export function deleteCustomCcc(code: string) {
  saveCustomCcc(getCustomCcc().filter((e) => e.code !== code));
}