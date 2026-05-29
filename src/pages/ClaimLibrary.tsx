import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trash2, Download, Upload, Brain, Save, Pencil, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { parseOwsText } from "@/lib/claim-library/parseOwsText";
import {
  addLibraryRecord, clearLibrary, deleteLibraryRecord, exportLibrary,
  getLibrary, importLibrary, isAutoSaveOn, setAutoSave, updateLibraryRecord,
} from "@/lib/claim-library/store";
import type { ClaimLibraryRecord, LibraryLaborOp, LibraryPart } from "@/lib/claim-library/types";

export default function ClaimLibrary() {
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [records, setRecords] = useState<ClaimLibraryRecord[]>([]);
  const [autoSave, setAutoSaveState] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ClaimLibraryRecord | null>(null);

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

  const startEdit = (r: ClaimLibraryRecord) => {
    setEditingId(r.id);
    setDraft(JSON.parse(JSON.stringify(r)));
  };
  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
  };
  const commitEdit = () => {
    if (!draft || !editingId) return;
    updateLibraryRecord(editingId, {
      ccc: draft.ccc?.trim() || undefined,
      causalPart: draft.causalPart?.trim() || undefined,
      customerConcern: draft.customerConcern?.trim() || undefined,
      cause: draft.cause?.trim() || undefined,
      correction: draft.correction?.trim() || undefined,
      laborOps: draft.laborOps.filter((o) => o.opCode.trim()),
      parts: draft.parts.filter((p) => p.code.trim()),
    });
    toast({ title: "Claim updated" });
    cancelEdit();
  };
  const updateDraft = (patch: Partial<ClaimLibraryRecord>) =>
    setDraft((d) => (d ? { ...d, ...patch } : d));
  const updateOp = (i: number, patch: Partial<LibraryLaborOp>) =>
    setDraft((d) => d ? { ...d, laborOps: d.laborOps.map((o, idx) => idx === i ? { ...o, ...patch } : o) } : d);
  const removeOp = (i: number) =>
    setDraft((d) => d ? { ...d, laborOps: d.laborOps.filter((_, idx) => idx !== i) } : d);
  const addOp = () =>
    setDraft((d) => d ? { ...d, laborOps: [...d.laborOps, { opCode: "", description: "", hours: 0 }] } : d);
  const updatePart = (i: number, patch: Partial<LibraryPart>) =>
    setDraft((d) => d ? { ...d, parts: d.parts.map((p, idx) => idx === i ? { ...p, ...patch } : p) } : d);
  const removePart = (i: number) =>
    setDraft((d) => d ? { ...d, parts: d.parts.filter((_, idx) => idx !== i) } : d);
  const addPart = () =>
    setDraft((d) => d ? { ...d, parts: [...d.parts, { code: "", description: "", qty: 1 }] } : d);

  return (
    <div className="space-y-4 max-w-6xl">
      <PageMeta
        title="Claim Library — Saved Warranty Claims"
        description="Browse and edit saved warranty claims with extracted CCC, concern, labor operations and parts ready for re-use."
        path="/claim-library"
      />
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
              {filtered.map((r) => {
                const isEditing = editingId === r.id && draft;
                if (isEditing && draft) {
                  return (
                    <div key={r.id} className="border rounded p-3 bg-card space-y-3 border-primary/50">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-primary">Editing claim</span>
                        <div className="flex gap-1">
                          <Button size="sm" onClick={commitEdit} className="h-7 gap-1.5">
                            <Save className="h-3.5 w-3.5" /> Save
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-7 gap-1.5">
                            <X className="h-3.5 w-3.5" /> Cancel
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <Label className="text-[10px] uppercase text-muted-foreground">CCC</Label>
                          <Input value={draft.ccc ?? ""} onChange={(e) => updateDraft({ ccc: e.target.value })} className="h-8 text-xs font-mono" />
                        </div>
                        <div>
                          <Label className="text-[10px] uppercase text-muted-foreground">Causal part</Label>
                          <Input value={draft.causalPart ?? ""} onChange={(e) => updateDraft({ causalPart: e.target.value })} className="h-8 text-xs font-mono" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-[10px] uppercase text-muted-foreground">Customer concern</Label>
                        <Textarea value={draft.customerConcern ?? ""} onChange={(e) => updateDraft({ customerConcern: e.target.value })} rows={2} className="text-xs" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <Label className="text-[10px] uppercase text-muted-foreground">Cause</Label>
                          <Textarea value={draft.cause ?? ""} onChange={(e) => updateDraft({ cause: e.target.value })} rows={2} className="text-xs" />
                        </div>
                        <div>
                          <Label className="text-[10px] uppercase text-muted-foreground">Correction</Label>
                          <Textarea value={draft.correction ?? ""} onChange={(e) => updateDraft({ correction: e.target.value })} rows={2} className="text-xs" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <Label className="text-[10px] uppercase text-muted-foreground">Labor ops</Label>
                          <Button size="sm" variant="ghost" className="h-6 gap-1 text-xs" onClick={addOp}>
                            <Plus className="h-3 w-3" /> Add op
                          </Button>
                        </div>
                        <div className="space-y-1">
                          {draft.laborOps.map((o, i) => (
                            <div key={i} className="flex gap-1.5 items-center">
                              <Input value={o.opCode} onChange={(e) => updateOp(i, { opCode: e.target.value })} placeholder="Op code" className="h-7 text-xs font-mono w-28" />
                              <Input value={o.description} onChange={(e) => updateOp(i, { description: e.target.value })} placeholder="Description" className="h-7 text-xs flex-1" />
                              <Input type="number" step="0.1" value={o.hours} onChange={(e) => updateOp(i, { hours: parseFloat(e.target.value) || 0 })} placeholder="Hrs" className="h-7 text-xs w-16" />
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeOp(i)}>
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <Label className="text-[10px] uppercase text-muted-foreground">Parts</Label>
                          <Button size="sm" variant="ghost" className="h-6 gap-1 text-xs" onClick={addPart}>
                            <Plus className="h-3 w-3" /> Add part
                          </Button>
                        </div>
                        <div className="space-y-1">
                          {draft.parts.map((p, i) => (
                            <div key={i} className="flex gap-1.5 items-center">
                              <Input value={p.code} onChange={(e) => updatePart(i, { code: e.target.value })} placeholder="Part code" className="h-7 text-xs font-mono w-32" />
                              <Input value={p.description} onChange={(e) => updatePart(i, { description: e.target.value })} placeholder="Description" className="h-7 text-xs flex-1" />
                              <Input type="number" step="1" value={p.qty} onChange={(e) => updatePart(i, { qty: parseInt(e.target.value) || 0 })} placeholder="Qty" className="h-7 text-xs w-16" />
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removePart(i)}>
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
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
                    <div className="flex flex-col gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(r)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteLibraryRecord(r.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}