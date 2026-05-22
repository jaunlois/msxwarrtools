import { getSettings } from "./settings";
import { ALL_TOOLS, runReadTool, WRITE_TOOL_NAMES, applyWriteTool } from "./tools";

export interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
  name?: string;
}

export interface ToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

export interface PendingWrite {
  id: string;
  name: string;
  args: any;
}

const SYSTEM_PROMPT = `You are a Ford Warranty Consultant for a South African dealership.

Region rules:
- Currency: ZAR (R). Default labor rate: R764/hr. Parts cap per claim: R5000.
- Factory NVLW: 4 years OR 120,000 km, whichever comes first.

Workflow:
1. When the user describes a claim, use lookup_* tools FIRST to verify SLT op-codes, CCC codes, part coverage, and factory warranty BEFORE answering. Never invent op-codes or hours.
2. When the user gives you new factual information (new SLT time, new CCC code, new part coverage override), call the matching upsert_* write tool. The user will see an Apply chip and confirm before anything is saved.
3. For ambiguous requests, ask one focused clarifying question.
4. Be concise. Show op-codes, hours, part numbers, and coverage status in compact lists.
5. Always cite which tool gave you which fact in a final "Sources" line.

You cannot access the internet or any database other than the provided tools.`;

export interface ChatResult {
  reply: string;
  pendingWrites: PendingWrite[];
  updatedMessages: ChatMessage[];
}

/**
 * Runs a tool-calling loop. Read tools execute immediately; write tools are
 * collected as pending and returned for user confirmation. After the user
 * applies/discards, call `continueAfterWrites` with the decisions.
 */
export async function runChat(messages: ChatMessage[], context?: string): Promise<ChatResult> {
  const s = getSettings();
  if (!s.apiKey) throw new Error("Set your API key in Settings first.");

  const sys: ChatMessage = {
    role: "system",
    content: context ? `${SYSTEM_PROMPT}\n\nCurrent claim context:\n${context}` : SYSTEM_PROMPT,
  };
  const working: ChatMessage[] = [sys, ...messages.filter((m) => m.role !== "system")];

  for (let i = 0; i < 6; i++) {
    const resp = await callLlm(working);
    const choice = resp.choices?.[0];
    const msg = choice?.message;
    if (!msg) throw new Error("Empty LLM response.");

    working.push({
      role: "assistant",
      content: msg.content ?? null,
      tool_calls: msg.tool_calls,
    });

    const calls: ToolCall[] = msg.tool_calls ?? [];
    if (!calls.length) {
      return { reply: msg.content ?? "", pendingWrites: [], updatedMessages: working.slice(1) };
    }

    const pending: PendingWrite[] = [];
    for (const c of calls) {
      let args: any = {};
      try { args = c.function.arguments ? JSON.parse(c.function.arguments) : {}; } catch { args = { _rawArgs: c.function.arguments }; }

      if (WRITE_TOOL_NAMES.has(c.function.name)) {
        pending.push({ id: c.id, name: c.function.name, args });
      } else {
        const result = runReadTool(c.function.name, args);
        working.push({
          role: "tool",
          tool_call_id: c.id,
          name: c.function.name,
          content: JSON.stringify(result).slice(0, 12000),
        });
      }
    }

    if (pending.length) {
      return { reply: msg.content ?? "", pendingWrites: pending, updatedMessages: working.slice(1) };
    }
    // else loop again with tool results
  }

  return { reply: "Stopped after 6 tool loops.", pendingWrites: [], updatedMessages: working.slice(1) };
}

export async function continueAfterWrites(
  messages: ChatMessage[],
  decisions: { call: PendingWrite; apply: boolean }[],
  context?: string,
): Promise<ChatResult> {
  const next = [...messages];
  for (const d of decisions) {
    const result = d.apply
      ? applyWriteTool(d.call.name, d.call.args)
      : { ok: false, error: "User discarded this change." };
    next.push({
      role: "tool",
      tool_call_id: d.call.id,
      name: d.call.name,
      content: JSON.stringify(result),
    });
  }
  return runChat(next, context);
}

async function callLlm(messages: ChatMessage[]): Promise<any> {
  const s = getSettings();
  const url = `${s.baseUrl.replace(/\/$/, "")}/chat/completions`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${s.apiKey}`,
    },
    body: JSON.stringify({
      model: s.model,
      messages: messages.map(serialize),
      tools: ALL_TOOLS,
      tool_choice: "auto",
      temperature: 0.2,
    }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`${resp.status}: ${text.slice(0, 400)}`);
  }
  return resp.json();
}

function serialize(m: ChatMessage): any {
  const out: any = { role: m.role, content: m.content };
  if (m.tool_calls) out.tool_calls = m.tool_calls;
  if (m.tool_call_id) out.tool_call_id = m.tool_call_id;
  if (m.name) out.name = m.name;
  return out;
}