import { getMergedSltSections } from "@/lib/slt/mergedSltData";
import { getMergedCccCodes } from "@/lib/ccc/mergedCccData";
import { conditionCodes } from "@/data/ccc-data";
import { partsData } from "@/data/parts-data";
import { getCustomParts, upsertCustomPart } from "@/lib/parts/customPartsStore";
import { factoryWarrantyData } from "@/data/factory-warranty";
import { addCustomEntries } from "@/lib/slt/customSltStore";
import { upsertCustomCcc } from "@/lib/ccc/customCccStore";
import { addLibraryRecord } from "@/lib/claim-library/store";
import { suggestFromLibrary } from "@/lib/claim-library/suggest";

export interface ToolDef {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: any;
  };
}

export const READ_TOOLS: ToolDef[] = [
  {
    type: "function",
    function: {
      name: "lookup_slt",
      description: "Search Standard Labor Time (SLT) entries by op-code or description text. Returns matching ops with section, op-code, description, and labor hours per variant.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Op-code (e.g. 1007A) or free-text description fragment." },
          section: { type: "string", description: "Optional section id like '01'." },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "lookup_ccc",
      description: "Search Customer Concern Codes (CCC) by code (e.g. AA01) or symptom text. Returns matching CCC entries.",
      parameters: {
        type: "object",
        properties: { query: { type: "string" } },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "lookup_part_coverage",
      description: "Look up Ford Protect coverage for a part number across WearCare, PowertrainCare, ExtraCare, PremiumMaintenance, PremiumCare plans.",
      parameters: {
        type: "object",
        properties: { partNumber: { type: "string" } },
        required: ["partNumber"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "lookup_factory_warranty",
      description: "Search factory NVLW (4yr/120,000km) coverage table by item/component name. Returns coverage status, limits, and comments.",
      parameters: {
        type: "object",
        properties: { query: { type: "string" } },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_claim_library",
      description: "Find similar past claims in the local claim library by CCC, causal part, model, or concern text. Returns top scored matches with their labor ops and parts.",
      parameters: {
        type: "object",
        properties: {
          ccc: { type: "string" },
          causalPart: { type: "string" },
          model: { type: "string" },
          customerConcern: { type: "string" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_condition_codes",
      description: "List the single-letter Ford condition codes (A-Z) and their meanings (e.g. F = Fluid Leak).",
      parameters: { type: "object", properties: {} },
    },
  },
];

export const WRITE_TOOLS: ToolDef[] = [
  {
    type: "function",
    function: {
      name: "upsert_slt_entry",
      description: "Add or update a custom SLT entry in the local override store. Requires user Apply confirmation.",
      parameters: {
        type: "object",
        properties: {
          section: { type: "string", description: "Section id like '01'." },
          opCode: { type: "string" },
          description: { type: "string" },
          time: { type: "number", description: "Labor hours" },
          notes: { type: "string" },
        },
        required: ["section", "opCode", "description", "time"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "upsert_ccc_entry",
      description: "Add or update a custom CCC code in the local override store. Requires user Apply confirmation.",
      parameters: {
        type: "object",
        properties: {
          code: { type: "string", description: "4-char CCC code like AA01." },
          description: { type: "string" },
          conditionCode: { type: "string", description: "Single letter A-Z." },
          category: { type: "string" },
          notes: { type: "string" },
        },
        required: ["code", "description", "conditionCode", "category"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "upsert_part_coverage",
      description: "Add or override Ford Protect part coverage. Requires user Apply confirmation.",
      parameters: {
        type: "object",
        properties: {
          partNumber: { type: "string" },
          description: { type: "string" },
          wearCare: { type: "boolean" },
          powertrainCare: { type: "boolean" },
          extraCare: { type: "boolean" },
          premiumMaintenance: { type: "boolean" },
          premiumCare: { type: "boolean" },
          notes: { type: "string" },
        },
        required: ["partNumber", "description"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "save_claim_to_library",
      description: "Save a claim to the local learning library. Requires user Apply confirmation.",
      parameters: {
        type: "object",
        properties: {
          vin: { type: "string" },
          model: { type: "string" },
          ccc: { type: "string" },
          causalPart: { type: "string" },
          customerConcern: { type: "string" },
          cause: { type: "string" },
          correction: { type: "string" },
          notes: { type: "string" },
          laborOps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                opCode: { type: "string" },
                description: { type: "string" },
                hours: { type: "number" },
              },
              required: ["opCode", "description", "hours"],
            },
          },
          parts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                code: { type: "string" },
                description: { type: "string" },
                qty: { type: "number" },
              },
              required: ["code", "description", "qty"],
            },
          },
        },
      },
    },
  },
];

export const ALL_TOOLS: ToolDef[] = [...READ_TOOLS, ...WRITE_TOOLS];
export const WRITE_TOOL_NAMES = new Set(WRITE_TOOLS.map((t) => t.function.name));

// -------- read executors --------

export function runReadTool(name: string, args: any): unknown {
  switch (name) {
    case "lookup_slt": return runSltLookup(args?.query ?? "", args?.section);
    case "lookup_ccc": return runCccLookup(args?.query ?? "");
    case "lookup_part_coverage": return runPartLookup(args?.partNumber ?? "");
    case "lookup_factory_warranty": return runFactoryLookup(args?.query ?? "");
    case "search_claim_library": return runLibrarySearch(args ?? {});
    case "list_condition_codes": return conditionCodes;
    default: return { error: `Unknown read tool: ${name}` };
  }
}

function runSltLookup(query: string, section?: string) {
  const q = query.trim().toUpperCase();
  const out: any[] = [];
  for (const s of getMergedSltSections()) {
    if (section && s.id !== section) continue;
    for (const op of s.operations) {
      const hay = `${op.opCode} ${op.description}`.toUpperCase();
      if (!q || hay.includes(q) || op.variants.some((v) => v.opCode.toUpperCase().includes(q))) {
        out.push({
          section: s.id,
          sectionName: s.name,
          opCode: op.opCode,
          description: op.description,
          notes: op.notes,
          variants: op.variants,
        });
        if (out.length >= 25) return { matches: out, truncated: true };
      }
    }
  }
  return { matches: out, truncated: false };
}

function runCccLookup(query: string) {
  const q = query.trim().toUpperCase();
  const matches = getMergedCccCodes().filter(
    (c) => c.code.toUpperCase().includes(q) || c.description.toUpperCase().includes(q),
  ).slice(0, 30);
  return { matches };
}

function runPartLookup(partNumber: string) {
  const pn = partNumber.trim().toUpperCase();
  const override = getCustomParts().find((p) => p.partNumber.toUpperCase() === pn);
  if (override) return { source: "custom", ...override };
  const base = partsData.find((p) => p.partNumber.toUpperCase() === pn);
  if (base) return { source: "ford", ...base };
  const fuzzy = partsData.filter((p) => p.partNumber.toUpperCase().includes(pn) || p.description.toUpperCase().includes(pn)).slice(0, 10);
  return { source: "fuzzy", matches: fuzzy };
}

function runFactoryLookup(query: string) {
  const q = query.trim().toUpperCase();
  const matches = factoryWarrantyData.filter((f) => f.item.toUpperCase().includes(q)).slice(0, 20);
  return { matches };
}

function runLibrarySearch(filter: any) {
  return suggestFromLibrary(filter, 5);
}

// -------- write executors (called only after user Apply) --------

export function applyWriteTool(name: string, args: any): { ok: true; result: unknown } | { ok: false; error: string } {
  try {
    switch (name) {
      case "upsert_slt_entry": {
        addCustomEntries([
          { section: args.section, opCode: args.opCode, description: args.description, time: Number(args.time), notes: args.notes },
        ]);
        return { ok: true, result: "SLT entry saved." };
      }
      case "upsert_ccc_entry": {
        upsertCustomCcc({
          code: args.code,
          description: args.description,
          conditionCode: args.conditionCode,
          category: args.category,
          notes: args.notes,
        });
        return { ok: true, result: "CCC entry saved." };
      }
      case "upsert_part_coverage": {
        upsertCustomPart({
          partNumber: args.partNumber,
          description: args.description,
          wearCare: !!args.wearCare,
          powertrainCare: !!args.powertrainCare,
          extraCare: !!args.extraCare,
          premiumMaintenance: !!args.premiumMaintenance,
          premiumCare: !!args.premiumCare,
          notes: args.notes,
        });
        return { ok: true, result: "Part coverage saved." };
      }
      case "save_claim_to_library": {
        const id = addLibraryRecord({
          source: "paste",
          vin: args.vin,
          model: args.model,
          ccc: args.ccc,
          causalPart: args.causalPart,
          customerConcern: args.customerConcern,
          cause: args.cause,
          correction: args.correction,
          notes: args.notes,
          laborOps: args.laborOps ?? [],
          parts: args.parts ?? [],
        });
        return { ok: true, result: `Claim saved (id ${id}).` };
      }
      default:
        return { ok: false, error: `Unknown write tool: ${name}` };
    }
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "Failed to apply." };
  }
}