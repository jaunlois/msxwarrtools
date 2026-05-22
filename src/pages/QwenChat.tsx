import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, Settings, Loader2, Trash2, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "qwen-chat-settings";
const DEFAULT_SYSTEM =
  "You are an automotive expert assistant for a warranty consultant. Be concise, " +
  "use bullet points where helpful, and focus on diagnosis, common failure modes, " +
  "and warranty-relevant context.";

interface QwenSettings {
  baseUrl: string;
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
}

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

const defaultSettings: QwenSettings = {
  baseUrl: "",
  model: "qwen-automotive",
  systemPrompt: DEFAULT_SYSTEM,
  temperature: 0.3,
  maxTokens: 400,
};

function loadSettings(): QwenSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

function saveSettings(s: QwenSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export default function QwenChat() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<QwenSettings>(loadSettings());
  const [settingsOpen, setSettingsOpen] = useState(!loadSettings().baseUrl);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ping, setPing] = useState<{ status: "idle" | "ok" | "fail"; ms?: number }>(
    { status: "idle" }
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    if (!settings.baseUrl) {
      setSettingsOpen(true);
      toast({
        title: "Set the API URL first",
        description: "Paste your Colab ngrok URL in Settings.",
      });
      return;
    }
    setInput("");
    const userMsg: ChatMsg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    try {
      const url = `${settings.baseUrl.replace(/\/$/, "")}/chat/completions`;
      const body = {
        model: settings.model,
        temperature: settings.temperature,
        max_tokens: settings.maxTokens,
        messages: [
          { role: "system", content: settings.systemPrompt },
          ...next.map((m) => ({ role: m.role, content: m.content })),
        ],
      };
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`${resp.status}: ${errText.slice(0, 300)}`);
      }
      const data = await resp.json();
      const reply: string = data?.choices?.[0]?.message?.content ?? "(empty)";
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (e: any) {
      toast({
        title: "Chat failed",
        description: e?.message ?? String(e),
        variant: "destructive",
      });
      setMessages(next.slice(0, -1));
      setInput(text);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    if (!settings.baseUrl) {
      toast({ title: "Set the API URL first", variant: "destructive" });
      return;
    }
    setPing({ status: "idle" });
    const url = `${settings.baseUrl.replace(/\/$/, "")}/models`;
    const start = Date.now();
    try {
      const resp = await fetch(url);
      const ms = Date.now() - start;
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      const ids = (data?.data ?? []).map((m: any) => m.id).join(", ") || "no models";
      setPing({ status: "ok", ms });
      toast({ title: "Connected", description: `${ms} ms · ${ids}` });
    } catch (e: any) {
      setPing({ status: "fail" });
      toast({
        title: "Cannot reach the API",
        description: e?.message ?? String(e),
        variant: "destructive",
      });
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="container mx-auto p-4 space-y-4 max-w-5xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Qwen Automotive Chat
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Talks to the Qwen-3B-Automotive LoRA running in your Colab. No tool
              calling — purely conversational. Update the ngrok URL whenever Colab
              reconnects.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={settings.baseUrl ? "default" : "outline"}>
              {settings.baseUrl ? settings.model : "not connected"}
            </Badge>
            {ping.status === "ok" && (
              <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                {ping.ms} ms
              </Badge>
            )}
            {ping.status === "fail" && (
              <Badge variant="outline" className="text-destructive border-destructive">
                offline
              </Badge>
            )}
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4 mr-1" /> Settings
                </Button>
              </DialogTrigger>
              <SettingsDialog
                initial={settings}
                onSave={(s) => {
                  setSettings(s);
                  saveSettings(s);
                  setSettingsOpen(false);
                  toast({ title: "Settings saved" });
                }}
                onTest={testConnection}
              />
            </Dialog>
            <Button size="sm" variant="ghost" onClick={clearChat}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Separator />
          <ScrollArea className="h-[60vh] rounded border bg-muted/20 p-3" ref={scrollRef as any}>
            {messages.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-8 space-y-2">
                <p>Try asking:</p>
                <ul className="text-xs space-y-1 list-disc list-inside text-left max-w-md mx-auto">
                  <li>"Symptoms of a failing alternator in a modern car?"</li>
                  <li>"Common warranty claims for a 2022 Ford Everest at 40k km."</li>
                  <li>"Diagnose: knocking sound from a Camry engine at idle."</li>
                </ul>
              </div>
            )}
            <div className="space-y-3">
              {messages.map((m, i) => (
                <Bubble key={i} msg={m} />
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
              }}
              placeholder="Ask Qwen about a vehicle issue. Cmd/Ctrl+Enter to send."
              rows={3}
              disabled={loading}
            />
            <Button
              onClick={send}
              disabled={loading || !input.trim()}
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Bubble({ msg }: { msg: ChatMsg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-lg px-3 py-2 max-w-[85%] text-sm whitespace-pre-wrap ${
          isUser ? "bg-primary text-primary-foreground" : "bg-card border"
        }`}
      >
        {msg.content || <span className="opacity-60">…</span>}
      </div>
    </div>
  );
}

function SettingsDialog({
  initial,
  onSave,
  onTest,
}: {
  initial: QwenSettings;
  onSave: (s: QwenSettings) => void;
  onTest: () => void;
}) {
  const [s, setS] = useState(initial);
  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Qwen Chat Settings</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <div>
          <Label>API Base URL</Label>
          <Input
            value={s.baseUrl}
            onChange={(e) => setS({ ...s, baseUrl: e.target.value })}
            placeholder="https://<id>.ngrok-free.app/v1"
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            The /v1 base of your Colab ngrok tunnel. Cell 3 of the notebook prints this.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Model</Label>
            <Input
              value={s.model}
              onChange={(e) => setS({ ...s, model: e.target.value })}
            />
          </div>
          <div>
            <Label>Max tokens</Label>
            <Input
              type="number"
              value={s.maxTokens}
              onChange={(e) =>
                setS({ ...s, maxTokens: Number(e.target.value) || 400 })
              }
            />
          </div>
        </div>
        <div>
          <Label>Temperature ({s.temperature.toFixed(2)})</Label>
          <Input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={s.temperature}
            onChange={(e) =>
              setS({ ...s, temperature: Number(e.target.value) })
            }
          />
        </div>
        <div>
          <Label>System prompt</Label>
          <Textarea
            rows={4}
            value={s.systemPrompt}
            onChange={(e) => setS({ ...s, systemPrompt: e.target.value })}
            className="text-xs"
          />
        </div>
      </div>
      <DialogFooter className="flex justify-between sm:justify-between">
        <Button variant="outline" onClick={onTest} disabled={!s.baseUrl}>
          <Zap className="h-4 w-4 mr-1" /> Test connection
        </Button>
        <Button onClick={() => onSave(s)} disabled={!s.baseUrl}>
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
