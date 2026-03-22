import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Download, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  generateCORExcel,
  type CORFormData,
  type CORPartLine,
  type CORLabourLine,
} from "@/lib/cor-excel-export";

const emptyPart = (): CORPartLine => ({ code: "", description: "", qty: 1, unitPrice: 0 });
const emptyLabour = (): CORLabourLine => ({ description: "", opCode: "", hours: 0, rate: 764 });

const defaultForm: CORFormData = {
  dealershipName: "",
  branch: "",
  dealerCode: "",
  todaysDate: new Date().toISOString().split("T")[0],
  priorApprovalTeam: "Ford Protect",
  phone: "",
  email: "",
  customerName: "",
  company: "",
  repairOrder: "",
  jobcardNumber: "",
  vin: "",
  regNo: "",
  engineNo: "",
  warrantyStartDate: "",
  kilometers: "",
  vehicleModel: "",
  complaint: "",
  causeSummary: "",
  causeDetailed: "",
  correction: "",
  parts: [emptyPart()],
  labour: [emptyLabour()],
};

export default function CORGenerator() {
  const [form, setForm] = useState<CORFormData>(defaultForm);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const set = (field: keyof CORFormData, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const updatePart = (i: number, field: keyof CORPartLine, value: string | number) =>
    setForm((f) => {
      const parts = [...f.parts];
      parts[i] = { ...parts[i], [field]: value };
      return { ...f, parts };
    });

  const updateLabour = (i: number, field: keyof CORLabourLine, value: string | number) =>
    setForm((f) => {
      const labour = [...f.labour];
      labour[i] = { ...labour[i], [field]: value };
      return { ...f, labour };
    });

  const addPart = () => setForm((f) => ({ ...f, parts: [...f.parts, emptyPart()] }));
  const removePart = (i: number) =>
    setForm((f) => ({ ...f, parts: f.parts.filter((_, idx) => idx !== i) }));

  const addLabour = () => setForm((f) => ({ ...f, labour: [...f.labour, emptyLabour()] }));
  const removeLabour = (i: number) =>
    setForm((f) => ({ ...f, labour: f.labour.filter((_, idx) => idx !== i) }));

  const partsTotal = form.parts.reduce((s, p) => s + p.qty * p.unitPrice, 0);
  const labourTotal = form.labour.reduce((s, l) => s + l.hours * l.rate, 0);
  const claimTotal = partsTotal + labourTotal;

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const fileName = await generateCORExcel(form);
      toast({ title: "COR Generated", description: `Downloaded ${fileName}` });
    } catch (err) {
      toast({ title: "Error", description: "Failed to generate Excel", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-primary" />
            Cost of Repair Generator
          </h1>
          <p className="text-sm text-muted-foreground">
            Generate a Prior Approval Authorization Request Form (COR) for Ford Protect
          </p>
        </div>
        <Button onClick={handleGenerate} disabled={generating} size="lg" className="gap-2">
          <Download className="h-4 w-4" />
          {generating ? "Generating…" : "Generate Excel"}
        </Button>
      </div>

      {/* DEALER INFO */}
      <Card className="ford-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-primary">Dealer Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Field label="Dealership Name" value={form.dealershipName} onChange={(v) => set("dealershipName", v)} />
          <Field label="Branch" value={form.branch} onChange={(v) => set("branch", v)} />
          <Field label="Dealer Code" value={form.dealerCode} onChange={(v) => set("dealerCode", v)} />
          <Field label="Prior Approval Team" value={form.priorApprovalTeam} onChange={(v) => set("priorApprovalTeam", v)} />
          <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} />
          <Field label="E-Mail" value={form.email} onChange={(v) => set("email", v)} />
          <Field label="Today's Date" value={form.todaysDate} onChange={(v) => set("todaysDate", v)} type="date" />
        </CardContent>
      </Card>

      {/* CUSTOMER & VEHICLE */}
      <Card className="ford-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-primary">Customer & Vehicle</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Field label="Customer Name" value={form.customerName} onChange={(v) => set("customerName", v)} />
          <Field label="Company" value={form.company} onChange={(v) => set("company", v)} />
          <Field label="Repair Order #" value={form.repairOrder} onChange={(v) => set("repairOrder", v)} />
          <Field label="Jobcard #" value={form.jobcardNumber} onChange={(v) => set("jobcardNumber", v)} />
          <Field label="VIN" value={form.vin} onChange={(v) => set("vin", v)} className="font-mono" />
          <Field label="Reg No." value={form.regNo} onChange={(v) => set("regNo", v)} />
          <Field label="Engine No." value={form.engineNo} onChange={(v) => set("engineNo", v)} className="font-mono" />
          <Field label="Warranty Start Date" value={form.warrantyStartDate} onChange={(v) => set("warrantyStartDate", v)} type="date" />
          <Field label="Kilometers" value={form.kilometers} onChange={(v) => set("kilometers", v)} />
          <Field label="Vehicle Model" value={form.vehicleModel} onChange={(v) => set("vehicleModel", v)} className="md:col-span-2" />
        </CardContent>
      </Card>

      {/* COMPLAINT / CAUSE / CORRECTION */}
      <Card className="ford-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-primary">Complaint / Cause / Correction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Complaint</Label>
            <Input value={form.complaint} onChange={(e) => set("complaint", e.target.value)} className="bg-background" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Cause (summary for Page 1)</Label>
            <Textarea value={form.causeSummary} onChange={(e) => set("causeSummary", e.target.value)} rows={6} className="bg-background text-xs" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Cause (detailed for Page 2 — leave blank to reuse summary)</Label>
            <Textarea value={form.causeDetailed} onChange={(e) => set("causeDetailed", e.target.value)} rows={6} className="bg-background text-xs" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Correction</Label>
            <Textarea value={form.correction} onChange={(e) => set("correction", e.target.value)} rows={3} className="bg-background text-xs" />
          </div>
        </CardContent>
      </Card>

      {/* PARTS TABLE */}
      <Card className="ford-card">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm text-primary">Parts</CardTitle>
          <Button variant="outline" size="sm" onClick={addPart} className="gap-1 text-xs">
            <Plus className="h-3 w-3" /> Add Part
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_2fr_0.5fr_1fr_1fr_auto] gap-2 text-[10px] text-muted-foreground font-medium px-1">
              <span>Part Code</span>
              <span>Description</span>
              <span className="text-right">Qty</span>
              <span className="text-right">Unit (ex VAT)</span>
              <span className="text-right">Line Total</span>
              <span className="w-8" />
            </div>
            <Separator />
            {form.parts.map((part, i) => (
              <div key={i} className="grid grid-cols-[1fr_2fr_0.5fr_1fr_1fr_auto] gap-2 items-center">
                <Input
                  value={part.code}
                  onChange={(e) => updatePart(i, "code", e.target.value)}
                  placeholder="JB3Z7000K"
                  className="bg-background font-mono text-xs h-8"
                />
                <Input
                  value={part.description}
                  onChange={(e) => updatePart(i, "description", e.target.value)}
                  placeholder="TRANS & CONV 10R80 4X4"
                  className="bg-background text-xs h-8"
                />
                <Input
                  type="number"
                  value={part.qty}
                  onChange={(e) => updatePart(i, "qty", Number(e.target.value))}
                  className="bg-background text-xs text-right h-8"
                  min={1}
                />
                <Input
                  type="number"
                  value={part.unitPrice || ""}
                  onChange={(e) => updatePart(i, "unitPrice", Number(e.target.value))}
                  placeholder="0.00"
                  className="bg-background text-xs text-right h-8"
                  step="0.01"
                />
                <div className="text-xs text-right font-mono text-foreground pr-1">
                  {(part.qty * part.unitPrice).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={() => removePart(i)}
                  disabled={form.parts.length <= 1}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <Separator />
            <div className="flex justify-end text-sm font-medium pr-10">
              Parts Total (ex VAT):{" "}
              <span className="font-mono ml-2 text-primary">
                R {partsTotal.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LABOUR TABLE */}
      <Card className="ford-card">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm text-primary">Labour</CardTitle>
          <Button variant="outline" size="sm" onClick={addLabour} className="gap-1 text-xs">
            <Plus className="h-3 w-3" /> Add Operation
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-[2fr_1fr_0.5fr_1fr_1fr_auto] gap-2 text-[10px] text-muted-foreground font-medium px-1">
              <span>Operation Description</span>
              <span>Op. Code</span>
              <span className="text-right">Hours</span>
              <span className="text-right">Rate /hr</span>
              <span className="text-right">Amount</span>
              <span className="w-8" />
            </div>
            <Separator />
            {form.labour.map((lab, i) => (
              <div key={i} className="grid grid-cols-[2fr_1fr_0.5fr_1fr_1fr_auto] gap-2 items-center">
                <Input
                  value={lab.description}
                  onChange={(e) => updateLabour(i, "description", e.target.value)}
                  placeholder="R&R Transmission Assembly"
                  className="bg-background text-xs h-8"
                />
                <Input
                  value={lab.opCode}
                  onChange={(e) => updateLabour(i, "opCode", e.target.value)}
                  placeholder="7000A"
                  className="bg-background font-mono text-xs h-8"
                />
                <Input
                  type="number"
                  value={lab.hours || ""}
                  onChange={(e) => updateLabour(i, "hours", Number(e.target.value))}
                  className="bg-background text-xs text-right h-8"
                  step="0.1"
                />
                <Input
                  type="number"
                  value={lab.rate || ""}
                  onChange={(e) => updateLabour(i, "rate", Number(e.target.value))}
                  placeholder="764"
                  className="bg-background text-xs text-right h-8"
                  step="1"
                />
                <div className="text-xs text-right font-mono text-foreground pr-1">
                  {(lab.hours * lab.rate).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={() => removeLabour(i)}
                  disabled={form.labour.length <= 1}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <Separator />
            <div className="flex justify-end text-sm font-medium pr-10">
              Labour Total (ex VAT):{" "}
              <span className="font-mono ml-2 text-primary">
                R {labourTotal.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SUMMARY BAR */}
      <Card className="ford-card border-primary/30 bg-primary/5">
        <CardContent className="flex items-center justify-between py-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Parts:</span>{" "}
            <span className="font-mono font-medium">R {partsTotal.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</span>
            <span className="mx-3 text-muted-foreground">+</span>
            <span className="text-muted-foreground">Labour:</span>{" "}
            <span className="font-mono font-medium">R {labourTotal.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Claim Total (ex VAT)</p>
            <p className="text-xl font-bold font-mono text-primary">
              R {claimTotal.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pb-8">
        <Button onClick={handleGenerate} disabled={generating} size="lg" className="gap-2">
          <Download className="h-4 w-4" />
          {generating ? "Generating…" : "Download COR Excel"}
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="text-[10px] text-muted-foreground">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-background h-8 text-xs"
      />
    </div>
  );
}
