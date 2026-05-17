import { sltSections, type SLTSection, type SLTOperation } from "@/data/slt-data";
import { getCustomEntries } from "./customSltStore";

/**
 * Return SLT sections with user-added custom entries layered on top.
 * Custom entries appear as single-variant operations within their inferred section.
 */
export function getMergedSltSections(): SLTSection[] {
  const custom = getCustomEntries();
  if (custom.length === 0) return sltSections;

  const cloned: SLTSection[] = sltSections.map((s) => ({ ...s, operations: [...s.operations] }));
  const bySection = new Map(cloned.map((s) => [s.id, s]));

  for (const entry of custom) {
    const op: SLTOperation = {
      description: `${entry.description} (Custom)`,
      opCode: entry.opCode,
      notes: entry.notes,
      variants: [{ engine: "ALL", opCode: entry.opCode, time: entry.time }],
    };
    const section = bySection.get(entry.section);
    if (section) {
      section.operations.push(op);
    } else {
      const newSection: SLTSection = {
        id: entry.section,
        name: `Custom Section ${entry.section}`,
        range: "—",
        operations: [op],
      };
      cloned.push(newSection);
      bySection.set(entry.section, newSection);
    }
  }

  return cloned.sort((a, b) => a.id.localeCompare(b.id));
}