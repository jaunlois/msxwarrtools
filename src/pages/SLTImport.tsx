import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Upload, Image as ImageIcon, FileText, Loader2, Trash2, Plus, Download, Save, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { parseSltText, type ParsedSltRow } from "@/lib/slt/parseSltText";
import { ocrSltImage } from "@/lib/slt/ocrSltImage";
import { extractSltDocument } from "@/lib/slt/extractSltDocument";
import {
  addCustomEntries, clearCustomEntries, deleteCustomEntry,
  exportCustomEntries, getCustomEntries, importCustomEntries,
  type CustomSltEntry,
} from "@/lib/slt/customSltStore";

export default function SLTImport() {
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [rows, setRows] = useState<ParsedSltRow[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ocrBusy, setOcrBusy] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [docBusy, setDocBusy] = useState(false);
  const [saved, setSaved] = useState<CustomSltEntry[]>([]);
  const imageDropRef = useRef<HTMLDivElement>(null);

  useEffect(() => setSaved(getCustomEntries()), []);

  const updateRow = (i: number, patch: Partial<ParsedSltRow>) => {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  };

  const removeRow = (i: number) => setRows((prev) => prev.filter((_, idx) => idx !== i));

  const handleParseText = () => {
    const parsed = parseSltText(text);
    setRows(parsed);
    toast({
      title: parsed.length ? "Text parsed" : "No rows found",
      description: parsed.length
        ? `${parsed.length} row(s) extracted. Review and edit before saving.`
        : "Could not detect any op codes in the pasted text.",
      variant: parsed.length ? undefined : "destructive",
    });
  };

  const handleImage = async (file: Blob) => {
    setImagePreview(URL.createObjectURL(file));
    setOcrBusy(true);
    setOcrProgress(0);
    try {
      const { rows: ocrRows, text: ocrText } = await ocrSltImage(file, setOcrProgress);
      setText(ocrText);
      setRows(ocrRows);
      toast({
        title: ocrRows.length ? "Screenshot read" : "Nothing recognised",
        description: ocrRows.length
          ? `${ocrRows.length} row(s) extracted. Review before saving.`
          : "OCR found text but no op codes — paste the text manually and edit.",
        variant: ocrRows.length ? undefined : "destructive",
      });
    } catch (err) {
      console.error(err);
      toast({ title: "OCR failed", description: String(err), variant: "destructive" });
    } finally {
      setOcrBusy(false);
    }
  };

  const onPaste = async (e: React.ClipboardEvent) => {
    const item = Array.from(e.clipboardData.items).find((i) => i.type.startsWith("image/"));
    if (item) {
      const blob = item.getAsFile();
      if (blob) {
        e.preventDefault();
        await handleImage(blob);
      }
    }
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) await handleImage(file);
  };

  const handleDocument = async (file: File) => {
    setDocBusy(true);
    try {
      const { text: extracted, rows: docRows } = await extractSltDocument(file);
      setText(extracted);
      setRows(docRows);
      toast({
        title: docRows.length ? "Document parsed" : "Nothing recognised",
        description: docRows.length
          ? `${docRows.length} row(s) extracted from ${file.name}. Review before saving.`
          : "No op codes detected — try pasting the raw text instead.",
        variant: docRows.length ? undefined : "destructive",
      });
    } catch (err) {
      console.error(err);
      toast({ title: "Could not read document", description: String(err), variant: "destructive" });
    } finally {
      setDocBusy(false);
    }
  };

  const onDocDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) await handleDocument(file);
  };

  const handleSave = () => {
    const valid = rows.filter((r) => r.opCode && r.description);
    if (valid.length === 0) {
      toast({ title: "Nothing to save", description: "Rows need at least an op code and description.", variant: "destructive" });
      return;
    }
    const merged = addCustomEntries(valid);
    setSaved(merged);
    setRows([]);
    setText("");
    setImagePreview(null);
    toast({ title: "Saved", description: `${valid.length} entry(ies) merged into SLT dataset.` });
  };

  const handleAddBlank = () => {
    setRows((prev) => [...prev, { opCode: "", description: "", time: 0, section: "00" }]);
  };

  const handleExport = () => {
    const blob = new Blob([exportCustomEntries()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `slt-custom-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (file: File) => {
    try {
      const text = await file.text();
      importCustomEntries(text);
      setSaved(getCustomEntries());
      toast({ title: "Imported", description: "Custom SLT entries loaded." });
    } catch (err) {
      toast({ title: "Import failed", description: String(err), variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Upload className="h-6 w-6 text-primary" />
          Bulk SLT Import
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Paste tab-separated text or a screenshot from Ford PTS — extracted rows merge into your SLT lookup.
        </p>
      </div>

      <Tabs defaultValue="text">
        <TabsList>
          <TabsTrigger value="text" className="gap-1.5"><FileText className="h-3.5 w-3.5" />Paste Text</TabsTrigger>
          <TabsTrigger value="image" className="gap-1.5"><ImageIcon className="h-3.5 w-3.5" />Paste / Drop Screenshot</TabsTrigger>
          <TabsTrigger value="doc" className="gap-1.5"><FileUp className="h-3.5 w-3.5" />Upload PDF / HTML</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-3">
          <Card>
            <CardContent className="pt-4 space-y-3">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={"Paste rows like:\n2102A\tFront Brake Pads — R&I\t0.8\n2103B\tRear Brake Pads — R&I\t0.7"}
                rows={8}
                className="font-mono text-xs"
              />
              <div className="flex gap-2">
                <Button onClick={handleParseText} size="sm" disabled={!text.trim()}>
                  Extract rows
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setText(""); setRows([]); }}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="image" className="space-y-3">
          <Card>
            <CardContent className="pt-4 space-y-3">
              <div
                ref={imageDropRef}
                tabIndex={0}
                onPaste={onPaste}
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {ocrBusy ? (
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Reading screenshot… {ocrProgress}%
                  </div>
                ) : imagePreview ? (
                  <img src={imagePreview} alt="Pasted" className="max-h-64 mx-auto rounded" />
                ) : (
                  <>
                    <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Click here then paste a screenshot (Ctrl+V)</p>
                    <p className="text-xs text-muted-foreground mt-1">Or drop a PNG / JPG file. OCR runs locally in your browser.</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])}
                className="text-xs"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doc" className="space-y-3">
          <Card>
            <CardContent className="pt-4 space-y-3">
              <div
                onDrop={onDocDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/20"
              >
                {docBusy ? (
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Reading document…
                  </div>
                ) : (
                  <>
                    <FileUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Drop a PDF, HTML or MHTML export from Ford PTS</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      The full operation description, op code and labor time are captured for every variant row.
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept=".pdf,.html,.htm,.mhtml,.mht"
                onChange={(e) => e.target.files?.[0] && handleDocument(e.target.files[0])}
                className="text-xs"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {rows.length > 0 && (
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Review extracted rows ({rows.length})</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleAddBlank} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add row
              </Button>
              <Button size="sm" onClick={handleSave} className="gap-1.5">
                <Save className="h-3.5 w-3.5" /> Merge into SLT
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Section</TableHead>
                  <TableHead className="w-32">Op Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-24 text-right">Time</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Input value={r.section} onChange={(e) => updateRow(i, { section: e.target.value })} className="h-8 text-xs" />
                    </TableCell>
                    <TableCell>
                      <Input value={r.opCode} onChange={(e) => updateRow(i, { opCode: e.target.value.toUpperCase() })} className="h-8 text-xs font-mono" />
                    </TableCell>
                    <TableCell>
                      <Input value={r.description} onChange={(e) => updateRow(i, { description: e.target.value })} className="h-8 text-xs" />
                    </TableCell>
                    <TableCell>
                      <Input type="number" step="0.1" value={r.time} onChange={(e) => updateRow(i, { time: parseFloat(e.target.value) || 0 })} className="h-8 text-xs text-right font-mono" />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeRow(i)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            Saved custom entries
            <Badge variant="secondary">{saved.length}</Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} disabled={!saved.length} className="gap-1.5">
              <Download className="h-3.5 w-3.5" /> Export JSON
            </Button>
            <label className="inline-flex">
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImportFile(e.target.files[0])}
              />
              <Button variant="outline" size="sm" asChild className="gap-1.5">
                <span><Upload className="h-3.5 w-3.5" /> Import JSON</span>
              </Button>
            </label>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-destructive"
              disabled={!saved.length}
              onClick={() => {
                if (confirm("Delete all custom SLT entries?")) {
                  clearCustomEntries();
                  setSaved([]);
                }
              }}
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear all
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {saved.length === 0 ? (
            <p className="text-xs text-muted-foreground p-4">No custom entries yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Section</TableHead>
                  <TableHead className="w-32">Op Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-24 text-right">Time</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {saved.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-xs">{e.section}</TableCell>
                    <TableCell className="text-xs font-mono text-primary">{e.opCode}</TableCell>
                    <TableCell className="text-xs">{e.description}</TableCell>
                    <TableCell className="text-xs text-right font-mono">{e.time.toFixed(1)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => {
                          deleteCustomEntry(e.id);
                          setSaved(getCustomEntries());
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}