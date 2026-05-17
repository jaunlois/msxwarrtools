import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trash2, Download, Upload, Brain, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { parseOwsText } from "@/lib/claim-library/parseOwsText";
import {
  addLibraryRecord, clearLibrary, deleteLibraryRecord, exportLibrary,
  getLibrary, importLibrary, isAutoSaveOn, setAutoSave,
} from "@/lib/claim-library/store";
import type { ClaimLibraryRecord } from "@/lib/claim-library/types";

export default function ClaimLibrary() {
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [records, setRecords] = useState<ClaimLibraryRecord[]>([]);
  const [autoSave, setAutoSaveState] = useState(false);

  useEffect(() => {
    setRecords(getLibrary());
    setAutoSaveState(isAutoSaveOn());
    const refresh = () => setRecords(getLibrary());
    window.addEventListener("claim-library-updated", refresh);
    return () => window.removeEventListener("claim-library-updated", refresh);
  }, []);

  const handleSave = () => {
    if (!text.trim()) return;
    const parsed = parseOwsText(text);
    if (parsed.laborOps.length === 0 && parsed.parts.length === 0 && !parsed.customerConcern) {
      toast({ title: "Nothing extracted", description: "Could not find ops, parts, or concern text.", variant: "destructive" });
      return;
    }
    addLibraryRecord(parsed);
    setText("");
    toast({
      title: "Claim saved to library",
      description: `${parsed.laborOps.length} ops · ${parsed.parts.length} parts learned`,
    });
  };

  const filtered = records.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.ccc?.toLowerCase().includes(q) ||
      r.vin?.toLowerCase().includes(q) ||
      r.causalPart?.toLowerCase().includes(q) ||
      r.customerConcern?.toLowerCase().includes(q) ||
      r.laborOps.some((o) => o.opCode.toLowerCase().includes(q)) ||
      r.parts.some((p) => p.code.toLowerCase().includes(q))
    );
  });

  const handleExport = () => {
    const blob = new Blob([exportLibrary()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `claim-library-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (file: File) => {
    try {
      const t = await file.text();
      importLibrary(t);
      setRecords(getLibrary());
      toast({ title: "Imported", description: "Library replaced from JSON." });
    } catch (err) {
      toast({ title: "Import failed", description: String(err), variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          Claim Library
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Paste OWS claim text. The app learns your labor ops, parts and concerns to suggest them on future claims.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Paste an OWS claim</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"Paste anything copied from OWS — claim header, complaint, cause, correction, parts list, labor ops. We extract VIN, CCC, op codes, part numbers and concern text."}
            rows={10}
            className="font-mono text-xs"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleSave} disabled={!text.trim()} className="gap-1.5" size="sm">
              <Save className="h-3.5 w-3.5" /> Save & learn
            </Button>
            <Button variant="outline" size="sm" onClick={() => setText("")}>Clear</Button>
            <div className="flex items-center gap-2 ml-auto">
              <Switch
                id="autosave"
                checked={autoSave}
                onCheckedChange={(v) => { setAutoSave(v); setAutoSaveState(v); }}
              />
              <Label htmlFor="autosave" className="text-xs cursor-pointer">
                Auto-save every generated claim
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-sm flex items-center gap-2">
            Saved claims <Badge variant="secondary">{records.length}</Badge>
          </CardTitle>
          <div className="flex gap-2 items-center flex-wrap">
            <Input
              placeholder="Search VIN, CCC, op, part…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-56 text-xs"
            />
            <Button variant="outline" size="sm" onClick={handleExport} disabled={!records.length} className="gap-1.5">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
            <label>
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImportFile(e.target.files[0])}
              />
              <Button variant="outline" size="sm" asChild className="gap-1.5">
                <span><Upload className="h-3.5 w-3.5" /> Import</span>
              </Button>
            </label>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-destructive"
              disabled={!records.length}
              onClick={() => {
                if (confirm("Delete all saved claims?")) clearLibrary();
              }}
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-xs text-muted-foreground">No claims match.</p>
          ) : (
            <div className="space-y-2">
              {filtered.map((r) => (
                <div key={r.id} className="border rounded p-3 bg-card">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-1.5 mb-1">
                        {r.ccc && <Badge variant="outline" className="text-[10px] font-mono">CCC {r.ccc}</Badge>}
                        {r.causalPart && <Badge variant="outline" className="text-[10px] font-mono">Causal {r.causalPart}</Badge>}
                        {r.vin && <Badge variant="outline" className="text-[10px] font-mono">{r.vin.slice(-6)}</Badge>}
                        {r.model && <Badge variant="outline" className="text-[10px]">{r.model}</Badge>}
                        <Badge variant="secondary" className="text-[10px]">{r.source}</Badge>
                      </div>
                      {r.customerConcern && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{r.customerConcern}</p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {r.laborOps.slice(0, 8).map((o) => (
                          <Badge key={o.opCode} className="text-[10px] font-mono bg-primary/10 text-primary border-primary/20">
                            {o.opCode}
                          </Badge>
                        ))}
                        {r.laborOps.length > 8 && <span className="text-[10px] text-muted-foreground">+{r.laborOps.length - 8}</span>}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {r.parts.slice(0, 6).map((p) => (
                          <Badge key={p.code} variant="outline" className="text-[10px] font-mono">{p.code}</Badge>
                        ))}
                        {r.parts.length > 6 && <span className="text-[10px] text-muted-foreground">+{r.parts.length - 6}</span>}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => deleteLibraryRecord(r.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}