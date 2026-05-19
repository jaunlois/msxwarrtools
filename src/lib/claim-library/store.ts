import type { ClaimLibraryRecord } from "./types";

const KEY = "claim-library-v1";
const AUTOSAVE_KEY = "claim-library-autosave";

export function getLibrary(): ClaimLibraryRecord[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveLibrary(records: ClaimLibraryRecord[]) {
  localStorage.setItem(KEY, JSON.stringify(records));
  window.dispatchEvent(new CustomEvent("claim-library-updated"));
}

export function addLibraryRecord(record: Omit<ClaimLibraryRecord, "id" | "savedAt">) {
  const all = getLibrary();
  const id = (crypto as any).randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  all.unshift({ ...record, id, savedAt: Date.now() });
  saveLibrary(all);
  return id;
}

export function deleteLibraryRecord(id: string) {
  saveLibrary(getLibrary().filter((r) => r.id !== id));
}

export function updateLibraryRecord(id: string, patch: Partial<ClaimLibraryRecord>) {
  saveLibrary(getLibrary().map((r) => (r.id === id ? { ...r, ...patch, id: r.id, savedAt: r.savedAt } : r)));
}

export function clearLibrary() {
  saveLibrary([]);
}

export function isAutoSaveOn(): boolean {
  return localStorage.getItem(AUTOSAVE_KEY) === "1";
}

export function setAutoSave(on: boolean) {
  localStorage.setItem(AUTOSAVE_KEY, on ? "1" : "0");
}

export function exportLibrary(): string {
  return JSON.stringify(getLibrary(), null, 2);
}

export function importLibrary(json: string) {
  const data = JSON.parse(json);
  if (!Array.isArray(data)) throw new Error("Expected an array");
  saveLibrary(data);
}