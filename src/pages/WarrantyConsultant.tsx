import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Settings, Loader2, Check, X, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSettings, saveSettings, type ConsultantSettings } from "@/lib/consultant/settings";
import {
  runChat, continueAfterWrites,
  type ChatMessage, type PendingWrite,
} from "@/lib/consultant/chat";

interface UiMessage {
  role: "user" | "assistant";
  text: string;
  pending?: PendingWrite[];
  applied?: Record<string, boolean>;
}

export default function WarrantyConsultant() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ConsultantSettings>(getSettings());
  const [settingsOpen, setSettingsOpen] = useState(!getSettings().apiKey);
  const [history, setHistory] = useState<ChatMessage[]>([]); // full LLM history
  const [ui, setUi] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [ui, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    if (!settings.apiKey) {
      setSettingsOpen(true);
      return;
    }
    setInput("");
    const userMsg: ChatMessage = { role: "user", content: text };
    const nextHistory = [...history, userMsg];
    setHistory(nextHistory);
    setUi((u) => [...u, { role: "user", text }]);
    setLoading(true);
    try {
      const res = await runChat(nextHistory, context || undefined);
      setHistory(res.updatedMessages);
      setUi((u) => [
        ...u,
        { role: "assistant", text: res.reply || (res.pendingWrites.length ? "Proposed changes — review below:" : "(no reply)"), pending: res.pendingWrites, applied: {} },
      ]);
    } catch (e: any) {
      toast({ title: "Chat failed", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const resolveWrites = async (msgIdx: number, decisions: { call: PendingWrite; apply: boolean }[]) => {
    setLoading(true);
    try {
      const res = await continueAfterWrites(history, decisions, context || undefined);
      setHistory(res.updatedMessages);
      setUi((u) => {
        const copy = [...u];
        copy[msgIdx] = {
          ...copy[msgIdx],
          pending: [],
          applied: Object.fromEntries(decisions.map((d) => [d.call.id, d.apply])),
        };
        copy.push({
          role: "assistant",
          text: res.reply || (res.pendingWrites.length ? "More changes proposed:" : ""),
          pending: res.pendingWrites,
          applied: {},
        });
        return copy;
      });
      const applied = decisions.filter((d) => d.apply).length;
      if (applied) toast({ title: `${applied} change(s) applied` });
    } catch (e: any) {
      toast({ title: "Apply failed", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => { setHistory([]); setUi([]); };

  return (
    <div className="container mx-auto p-4 space-y-4 max-w-5xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /> Warranty Consultant</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Asks the model to look up SLT, CCC, parts coverage, factory warranty, and past claims — and can update your local databases when you Apply.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{settings.model || "no model"}</Badge>
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild><Button size="sm" variant="outline"><Settings className="h-4 w-4 mr-1" /> Settings</Button></DialogTrigger>
              <SettingsDialog initial={settings} onSave={(s) => { setSettings(s); saveSettings(s); setSettingsOpen(false); toast({ title: "Settings saved" }); }} />
            </Dialog>
            <Button size="sm" variant="ghost" onClick={clearChat}><Trash2 className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">Optional claim context (VIN, model, km, concern, etc.)</Label>
            <Textarea
              rows={2}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. 2022 Everest, 38,000 km, 14 mo in service. CCC: EE05. Customer says A/C not cooling."
              className="text-xs mt-1"
            />
          </div>
          <Separator />
          <ScrollArea className="h-[55vh] rounded border bg-muted/20 p-3" ref={scrollRef as any}>
            {ui.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Ask things like "What's covered for an A/C compressor at 38k km?" or "Op code 12-01-01 actually takes 1.8h, update SLT."
              </p>
            )}
            <div className="space-y-3">
              {ui.map((m, i) => (
                <MessageBubble key={i} msg={m} onResolve={(decisions) => resolveWrites(i, decisions)} disabled={loading} />
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" /> thinking…
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(); }}
              placeholder="Describe a claim or ask a question. Cmd/Ctrl+Enter to send."
              rows={3}
              disabled={loading}
            />
            <Button onClick={send} disabled={loading || !input.trim()} className="self-end">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MessageBubble({
  msg, onResolve, disabled,
}: {
  msg: UiMessage;
  onResolve: (decisions: { call: PendingWrite; apply: boolean }[]) => void;
  disabled: boolean;
}) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`rounded-lg px-3 py-2 max-w-[85%] text-sm whitespace-pre-wrap ${isUser ? "bg-primary text-primary-foreground" : "bg-card border"}`}>
        {msg.text || <span className="opacity-60">…</span>}
        {msg.pending && msg.pending.length > 0 && (
          <div className="mt-3 space-y-2">
            {msg.pending.map((p) => (
              <div key={p.id} className="rounded border bg-background p-2 text-xs">
                <div className="font-semibold mb-1">Proposed: {p.name}</div>
                <pre className="text-[11px] overflow-auto max-h-40 bg-muted/40 p-2 rounded">{JSON.stringify(p.args, null, 2)}</pre>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="default" disabled={disabled}
                    onClick={() => onResolve([{ call: p, apply: true }, ...msg.pending!.filter((q) => q.id !== p.id).map((q) => ({ call: q, apply: false }))])}>
                    <Check className="h-3 w-3 mr-1" /> Apply
                  </Button>
                  <Button size="sm" variant="outline" disabled={disabled}
                    onClick={() => onResolve(msg.pending!.map((q) => ({ call: q, apply: q.id === p.id ? false : true })))}>
                    <X className="h-3 w-3 mr-1" /> Discard
                  </Button>
                </div>
              </div>
            ))}
            {msg.pending.length > 1 && (
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" disabled={disabled}
                  onClick={() => onResolve(msg.pending!.map((q) => ({ call: q, apply: true })))}>
                  Apply all
                </Button>
                <Button size="sm" variant="ghost" disabled={disabled}
                  onClick={() => onResolve(msg.pending!.map((q) => ({ call: q, apply: false })))}>
                  Discard all
                </Button>
              </div>
            )}
          </div>
        )}
        {msg.applied && Object.keys(msg.applied).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {Object.entries(msg.applied).map(([id, ok]) => (
              <Badge key={id} variant={ok ? "default" : "outline"} className="text-[10px]">
                {ok ? "applied" : "discarded"}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsDialog({ initial, onSave }: { initial: ConsultantSettings; onSave: (s: ConsultantSettings) => void }) {
  const [s, setS] = useState(initial);
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Consultant Settings</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <div>
          <Label>API Base URL</Label>
          <Input value={s.baseUrl} onChange={(e) => setS({ ...s, baseUrl: e.target.value })} />
          <p className="text-[11px] text-muted-foreground mt-1">
            OpenAI-compatible. Examples: <code>https://api.openai.com/v1</code>, <code>https://openrouter.ai/api/v1</code>, <code>https://api.groq.com/openai/v1</code>.
          </p>
        </div>
        <div>
          <Label>Model</Label>
          <Input value={s.model} onChange={(e) => setS({ ...s, model: e.target.value })} placeholder="gpt-4o-mini" />
        </div>
        <div>
          <Label>API Key</Label>
          <Input type="password" value={s.apiKey} onChange={(e) => setS({ ...s, apiKey: e.target.value })} placeholder="sk-..." />
          <p className="text-[11px] text-muted-foreground mt-1">
            Stored only in this browser's localStorage. Sent directly to the API base URL above with each request.
          </p>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={() => onSave(s)} disabled={!s.apiKey || !s.baseUrl || !s.model}>Save</Button>
      </DialogFooter>
    </DialogContent>
  );
}