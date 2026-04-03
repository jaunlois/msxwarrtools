import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FileSpreadsheet, FileText, ChevronDown, ChevronUp, Plus, Trash2, Edit2 } from "lucide-react";
import type { WarrantyRepairLine, ClaimPartLine, SLTMatch } from "@/lib/claim-processor/types";

interface LineComments {
  complaint: string;
  cause: string;
  correction: string;
}

interface RepairLineCardProps {
  line: WarrantyRepairLine;
  lineIndex: number;
  comments: LineComments;
  sltMatch?: SLTMatch;
  labourRate: number;
  onUpdateComments: (field: "complaint" | "cause" | "correction", value: string) => void;
  onUpdateParts: (parts: ClaimPartLine[]) => void;
  onUpdateLine: (updates: Partial<WarrantyRepairLine>) => void;
  onGenerateCOR: () => void;
  onGenerateAWA: () => void;
  onGenerateOWS: () => void;
  onRemoveLine: () => void;
}

export function RepairLineCard({
  line, lineIndex, comments, sltMatch, labourRate,
  onUpdateComments, onUpdateParts, onUpdateLine,
  onGenerateCOR, onGenerateAWA, onGenerateOWS, onRemoveLine,
}: RepairLineCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [editingPart, setEditingPart] = useState<number | null>(null);
  const [newPart, setNewPart] = useState<ClaimPartLine>({ code: "", description: "", qty: 1, unitPrice: 0 });

  const partsTotal = line.parts.reduce((s, p) => s + p.qty * p.unitPrice, 0);
  const labourTotal = line.labourHours * labourRate;

  const addPart = () => {
    if (!newPart.code) return;
    onUpdateParts([...line.parts, { ...newPart }]);
    setNewPart({ code: "", description: "", qty: 1, unitPrice: 0 });
  };

  const removePart = (idx: number) => {
    onUpdateParts(line.parts.filter((_, i) => i !== idx));
  };

  const updatePart = (idx: number, updates: Partial<ClaimPartLine>) => {
    const updated = line.parts.map((p, i) => i === idx ? { ...p, ...updates } : p);
    onUpdateParts(updated);
  };

  return (
    <Card className="border-primary/20">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger className="flex items-center gap-2 hover:text-primary transition-colors">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <CardTitle className="text-sm">
                Line {line.itemNumber}: <span className="font-mono text-primary">{line.opCode}</span> — {line.operationDescription}
              </CardTitle>
            </CollapsibleTrigger>
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="text-[10px] font-mono">
                R {(partsTotal + labourTotal).toFixed(2)}
              </Badge>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={onGenerateCOR}>
                <FileSpreadsheet className="h-3 w-3" /> COR
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={onGenerateAWA}>
                <FileText className="h-3 w-3" /> AWA
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={onGenerateOWS}>
                <FileText className="h-3 w-3" /> OWS
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={onRemoveLine}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          {sltMatch && (
            <p className="text-[10px] text-muted-foreground mt-1 ml-6">
              SLT: {sltMatch.description} — {sltMatch.hours}h ({sltMatch.section})
            </p>
          )}
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            {/* Editable Line Details */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-[10px] text-muted-foreground">Op Code</Label>
                <Input value={line.opCode} onChange={e => onUpdateLine({ opCode: e.target.value })} className="h-7 text-xs font-mono" />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">Labour Hours</Label>
                <Input type="number" step="0.1" value={line.labourHours} onChange={e => onUpdateLine({ labourHours: parseFloat(e.target.value) || 0 })} className="h-7 text-xs font-mono" />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">Description</Label>
                <Input value={line.operationDescription} onChange={e => onUpdateLine({ operationDescription: e.target.value })} className="h-7 text-xs" />
              </div>
            </div>

            {/* Parts Table */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-xs text-muted-foreground font-medium">Parts ({line.parts.length})</Label>
                <span className="text-xs font-mono text-muted-foreground">Total: R {partsTotal.toFixed(2)}</span>
              </div>
              <div className="rounded-md border border-border overflow-hidden">
                <div className="grid grid-cols-[2fr_3fr_0.7fr_1.2fr_1.2fr_auto] gap-1 px-2 py-1 bg-muted/50 text-[10px] text-muted-foreground font-medium">
                  <span>Code</span><span>Description</span><span className="text-right">Qty</span>
                  <span className="text-right">Unit Price</span><span className="text-right">Total</span><span></span>
                </div>
                {line.parts.map((p, pi) => (
                  <div key={pi} className="grid grid-cols-[2fr_3fr_0.7fr_1.2fr_1.2fr_auto] gap-1 px-2 py-1 border-t border-border/50 text-xs items-center">
                    {editingPart === pi ? (
                      <>
                        <Input value={p.code} onChange={e => updatePart(pi, { code: e.target.value })} className="h-6 text-[10px] font-mono" />
                        <Input value={p.description} onChange={e => updatePart(pi, { description: e.target.value })} className="h-6 text-[10px]" />
                        <Input type="number" value={p.qty} onChange={e => updatePart(pi, { qty: parseInt(e.target.value) || 1 })} className="h-6 text-[10px] text-right" />
                        <Input type="number" step="0.01" value={p.unitPrice} onChange={e => updatePart(pi, { unitPrice: parseFloat(e.target.value) || 0 })} className="h-6 text-[10px] text-right" />
                        <span className="text-right font-mono text-[10px]">R {(p.qty * p.unitPrice).toFixed(2)}</span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setEditingPart(null)}>
                          <Check className="h-3 w-3 text-green-500" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="font-mono text-[10px]">{p.code}</span>
                        <span className="text-[10px] truncate">{p.description}</span>
                        <span className="text-right text-[10px]">{p.qty}</span>
                        <span className="text-right font-mono text-[10px]">R {p.unitPrice.toFixed(2)}</span>
                        <span className="text-right font-mono text-[10px]">R {(p.qty * p.unitPrice).toFixed(2)}</span>
                        <div className="flex gap-0.5">
                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => setEditingPart(pi)}>
                            <Edit2 className="h-2.5 w-2.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-destructive" onClick={() => removePart(pi)}>
                            <Trash2 className="h-2.5 w-2.5" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {/* Add new part row */}
                <div className="grid grid-cols-[2fr_3fr_0.7fr_1.2fr_1.2fr_auto] gap-1 px-2 py-1 border-t border-border bg-muted/20 items-center">
                  <Input placeholder="Part code" value={newPart.code} onChange={e => setNewPart(p => ({ ...p, code: e.target.value }))} className="h-6 text-[10px] font-mono" />
                  <Input placeholder="Description" value={newPart.description} onChange={e => setNewPart(p => ({ ...p, description: e.target.value }))} className="h-6 text-[10px]" />
                  <Input type="number" value={newPart.qty} onChange={e => setNewPart(p => ({ ...p, qty: parseInt(e.target.value) || 1 }))} className="h-6 text-[10px] text-right" />
                  <Input type="number" step="0.01" value={newPart.unitPrice || ""} onChange={e => setNewPart(p => ({ ...p, unitPrice: parseFloat(e.target.value) || 0 }))} placeholder="0.00" className="h-6 text-[10px] text-right" />
                  <span></span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={addPart} disabled={!newPart.code}>
                    <Plus className="h-3 w-3 text-primary" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Labour Summary */}
            <div className="flex items-center gap-4 text-xs bg-muted/30 rounded-md p-2">
              <span className="text-muted-foreground">Labour: <strong className="font-mono">{line.labourHours}h × R{labourRate} = R {labourTotal.toFixed(2)}</strong></span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-muted-foreground">Parts: <strong className="font-mono">R {partsTotal.toFixed(2)}</strong></span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-primary font-medium">Total: <strong className="font-mono">R {(partsTotal + labourTotal).toFixed(2)}</strong></span>
            </div>

            {/* Complaint / Cause / Correction */}
            <div className="space-y-2">
              <div>
                <Label className="text-[10px] text-muted-foreground">Complaint</Label>
                <Input value={comments.complaint} onChange={e => onUpdateComments("complaint", e.target.value)} className="h-7 text-xs" placeholder="Customer complaint..." />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">Cause</Label>
                <Textarea value={comments.cause} onChange={e => onUpdateComments("cause", e.target.value)} rows={2} className="text-xs min-h-[50px]" placeholder="Detailed cause..." />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">Correction</Label>
                <Input value={comments.correction} onChange={e => onUpdateComments("correction", e.target.value)} className="h-7 text-xs" placeholder="Correction performed..." />
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

// Need to import Check for the edit mode
import { Check } from "lucide-react";
