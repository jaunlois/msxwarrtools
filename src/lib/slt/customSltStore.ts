export interface CustomSltEntry {
  id: string;
  section: string;
  opCode: string;
  description: string;
  time: number;
  notes?: string;
  addedAt: number;
}

const KEY = "slt-custom-entries-v1";

export function getCustomEntries(): CustomSltEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCustomEntries(entries: CustomSltEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries));
  window.dispatchEvent(new CustomEvent("slt-custom-updated"));
}

export function addCustomEntries(rows: Omit<CustomSltEntry, "id" | "addedAt">[]) {
  const existing = getCustomEntries();
  const map = new Map(existing.map((e) => [`${e.section}|${e.opCode}`, e]));
  for (const r of rows) {
    if (!r.opCode) continue;
    const key = `${r.section}|${r.opCode}`;
    map.set(key, {
      ...r,
      id: key,
      addedAt: Date.now(),
    });
  }
  const merged = Array.from(map.values());
  saveCustomEntries(merged);
  return merged;
}

export function deleteCustomEntry(id: string) {
  saveCustomEntries(getCustomEntries().filter((e) => e.id !== id));
}

export function clearCustomEntries() {
  saveCustomEntries([]);
}

export function exportCustomEntries(): string {
  return JSON.stringify(getCustomEntries(), null, 2);
}

export function importCustomEntries(json: string) {
  const data = JSON.parse(json);
  if (!Array.isArray(data)) throw new Error("Expected an array");
  saveCustomEntries(data);
}