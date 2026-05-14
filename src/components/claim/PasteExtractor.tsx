import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ClipboardPaste, Zap, Check, Plus, Trash2, Sparkles } from "lucide-react";
import type { WarrantyRepairLine, ClaimPartLine, ClaimVehicleInfo } from "@/lib/claim-processor/types";

interface ParsedPasteResult {
  vehicle: Partial<ClaimVehicleInfo>;
  repairLines: WarrantyRepairLine[];
  rawParts: ClaimPartLine[];
  bsiNumber: string;
  roNumber: string;
  dealerName: string;
}

function cleanPrice(s: string): number {
  return parseFloat(s.replace(/[R\s,]/g, "")) || 0;
}

/**
 * Smart parser that handles multiple quote text formats:
 * - BSI quote copy-paste (table rows)
 * - Tab-separated columns
 * - Free-text with part numbers and prices
 */
function parseQuoteText(text: string): ParsedPasteResult {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const result: ParsedPasteResult = {
    vehicle: {}, repairLines: [], rawParts: [], bsiNumber: "", roNumber: "", dealerName: "",
  };

  let currentRepairLine: WarrantyRepairLine | null = null;
  const floatingParts: ClaimPartLine[] = [];

  for (const line of lines) {
    const stripped = line.replace(/\|/g, " ").replace(/\s+/g, " ").trim();

    // --- Header info extraction ---
    // BSI Number
    if (!result.bsiNumber) {
      const bsiMatch = stripped.match(/\b(B-?\d{4,})\b/);
      if (bsiMatch) result.bsiNumber = bsiMatch[1];
    }

    // VIN (17-char alphanumeric)
    if (!result.vehicle.vin) {
      const vinMatch = stripped.match(/\b([A-HJ-NPR-Z0-9]{17})\b/);
      if (vinMatch) result.vehicle.vin = vinMatch[1];
    }

    // Chassis No (BSI Jobcard) — same as VIN
    if (!result.vehicle.vin) {
      const chassisMatch = stripped.match(/Chassis\s*(?:No\.?|Number)?\s*:?\s*([A-HJ-NPR-Z0-9]{17})/i);
      if (chassisMatch) result.vehicle.vin = chassisMatch[1];
    }

    // Reg No
    if (!result.vehicle.regNo) {
      const regMatch = stripped.match(/\b([A-Z]{2,3}\s?\d{2,3}\s?[A-Z]{2,3}\s?(?:GP|WC|KZN|EC|FS|MP|NW|LP|NC))\b/i);
      if (regMatch) result.vehicle.regNo = regMatch[1].trim();
    }
    if (!result.vehicle.regNo) {
      const regLabel = stripped.match(/Reg(?:istration)?\.?\s*(?:No\.?|Number)?\s*:?\s*([A-Z0-9 ]{4,12})/i);
      if (regLabel) result.vehicle.regNo = regLabel[1].trim();
    }

    // Kilometers
    if (!result.vehicle.kilometers) {
      const kmMatch = stripped.match(/(?:Mileage|Kilometers?|Odometer|Current\s*KM|KM|km)\s*:?\s*(\d[\d\s,]*)/i);
      if (kmMatch) result.vehicle.kilometers = kmMatch[1].replace(/\s/g, "");
    }

    // Customer name
    if (!result.vehicle.customerName) {
      const nameMatch = stripped.match(/(?:Customer|Account\s*Name|First\s*Name|Surname|Client\s*Name|Name)\s*:?\s*(.+)/i);
      if (nameMatch && nameMatch[1].length > 2) result.vehicle.customerName = nameMatch[1].trim();
    }

    // Engine No
    if (!result.vehicle.engineNo) {
      const engMatch = stripped.match(/Engine\s*(?:No\.?|Number)\s*:?\s*(\S+)/i);
      if (engMatch) result.vehicle.engineNo = engMatch[1];
    }

    // Vehicle Model / Type
    if (!result.vehicle.vehicleModel) {
      const vmMatch = stripped.match(/Vehicle\s*(?:Type|Model|Description)\s*:?\s*(.+)/i);
      if (vmMatch) result.vehicle.vehicleModel = vmMatch[1].trim();
    }
    if (!result.vehicle.modelCode) {
      const mcMatch = stripped.match(/Model\s*Code\s*:?\s*(\S+)/i);
      if (mcMatch) result.vehicle.modelCode = mcMatch[1];
    }

    // Phone
    if (!result.vehicle.phone) {
      const phMatch = stripped.match(/(?:Tel|Phone|Mobile|Cell|Contact)\s*:?\s*(\+?\d[\d\s-]{7,})/i);
      if (phMatch) result.vehicle.phone = phMatch[1].replace(/\s/g, "");
    }

    // Email
    if (!result.vehicle.email) {
      const emMatch = stripped.match(/[\w.+-]+@[\w.-]+\.\w+/);
      if (emMatch) result.vehicle.email = emMatch[0];
    }

    // RO Number
    if (!result.roNumber) {
      const roMatch = stripped.match(/(?:Job\s*Card|Jobcard|RO|Repair\s*Order)\s*(?:No\.?|Number|#)?\s*:?\s*(\S+)/i);
      if (roMatch && !/^B-?\d/i.test(roMatch[1])) result.roNumber = roMatch[1];
    }

    // Warranty Start Date
    if (!result.vehicle.warrantyStartDate) {
      const wsdMatch = stripped.match(/(?:Warranty\s*Start|In\s*Service|Delivery)\s*(?:Date)?\s*:?\s*(\d{4}[-/]\d{2}[-/]\d{2}|\d{2}[-/]\d{2}[-/]\d{4})/i);
      if (wsdMatch) result.vehicle.warrantyStartDate = wsdMatch[1];
    }

    // --- Repair line detection (WAR lines) ---
    // Pattern: number opCode description WAR hours amount
    const warMatch = stripped.match(/^(\d{1,2})\s+(\S+)\s+(.+?)\s+(WAR|CSH)\s+([\d.]+)?\s*([\d,.]+)?$/i);
    if (warMatch) {
      if (currentRepairLine && currentRepairLine.paymentMethod === "WAR") {
        result.repairLines.push(currentRepairLine);
      }
      const payMethod = warMatch[4].toUpperCase();
      currentRepairLine = {
        itemNumber: parseInt(warMatch[1]),
        opCode: warMatch[2],
        operationDescription: warMatch[3].trim(),
        paymentMethod: payMethod,
        labourHours: parseFloat(warMatch[5]) || 0,
        labourAmount: cleanPrice(warMatch[6] || "0"),
        parts: [],
        subTotal: 0, vatAmount: 0, total: 0,
      };
      continue;
    }

    // Alt WAR detection: line contains WAR keyword
    if (/\bWAR\b/i.test(stripped) && /\d/.test(stripped) && !warMatch) {
      const parts = stripped.split(/\s+/);
      const warIdx = parts.findIndex(p => p.toUpperCase() === "WAR");
      if (warIdx > 1) {
        if (currentRepairLine && currentRepairLine.paymentMethod === "WAR") {
          result.repairLines.push(currentRepairLine);
        }
        const itemNum = parseInt(parts[0]) || (result.repairLines.length + 1);
        const opCode = parts[1] || "";
        const desc = parts.slice(2, warIdx).join(" ");
        const afterWar = parts.slice(warIdx + 1);
        currentRepairLine = {
          itemNumber: itemNum, opCode,
          operationDescription: desc, paymentMethod: "WAR",
          labourHours: parseFloat(afterWar[0]) || 0,
          labourAmount: cleanPrice(afterWar[1] || "0"),
          parts: [], subTotal: 0, vatAmount: 0, total: 0,
        };
        continue;
      }
    }

    // --- Part line detection ---
    // Ford part number: mix of letters+digits, 6+ chars (e.g., MB3Z18124CE, W721979S440)
    const partMatch = stripped.match(/\b([A-Z][A-Z0-9]{5,}[A-Z]?)\b/i);
    if (partMatch && !stripped.match(/^(Sub|Vat|Total|Grand)/i)) {
      const partCode = partMatch[1].toUpperCase();
      if (/[A-Z]/.test(partCode) && /\d/.test(partCode) && partCode.length >= 6) {
        const afterCode = stripped.substring(stripped.indexOf(partCode) + partCode.length).trim();
        const numbers = afterCode.match(/[\d,]+\.?\d*/g) || [];
        const allNums = numbers.map(n => cleanPrice(n)).filter(n => n > 0);

        let qty = 1;
        let unitPrice = 0;
        if (allNums.length >= 2) {
          if (allNums[0] < 100 && Number.isInteger(allNums[0])) {
            qty = allNums[0];
            unitPrice = allNums[allNums.length - 1];
          } else {
            unitPrice = allNums[allNums.length - 1];
          }
        } else if (allNums.length === 1) {
          unitPrice = allNums[0];
        }

        let description = afterCode.replace(/[\d,.R]+/g, "").replace(/\|/g, "").trim();
        const beforeCode = stripped.substring(0, stripped.indexOf(partCode)).replace(/\|/g, "").trim();
        if (!description && beforeCode) description = beforeCode.replace(/^\d+\s*/, "").trim();

        const part: ClaimPartLine = { code: partCode, description, qty, unitPrice };

        if (currentRepairLine && currentRepairLine.paymentMethod === "WAR") {
          currentRepairLine.parts.push(part);
        } else {
          floatingParts.push(part);
        }
        continue;
      }
    }

    // Tab-separated parts: code\tdesc\tqty\tprice
    const tabCols = line.split(/\t/);
    if (tabCols.length >= 2) {
      const code = tabCols[0].trim();
      if (/[A-Z]/.test(code) && /\d/.test(code) && code.length >= 6) {
        const part: ClaimPartLine = {
          code: code.toUpperCase(),
          description: tabCols[1]?.trim() || "",
          qty: parseInt(tabCols[2]?.trim()) || 1,
          unitPrice: cleanPrice(tabCols[3]?.trim() || "0"),
        };
        if (currentRepairLine && currentRepairLine.paymentMethod === "WAR") {
          currentRepairLine.parts.push(part);
        } else {
          floatingParts.push(part);
        }
        continue;
      }
    }

    // Sub/Vat/Total for current line
    if (currentRepairLine && currentRepairLine.paymentMethod === "WAR") {
      const subMatch = stripped.match(/Sub:?\s*R?\s*([\d,. ]+)/i);
      if (subMatch) currentRepairLine.subTotal = cleanPrice(subMatch[1]);
      const vatMatch = stripped.match(/Vat:?\s*R?\s*([\d,. ]+)/i);
      if (vatMatch) currentRepairLine.vatAmount = cleanPrice(vatMatch[1]);
      const totalMatch = stripped.match(/^Total:?\s*R?\s*([\d,. ]+)/i);
      if (totalMatch) currentRepairLine.total = cleanPrice(totalMatch[1]);
    }
  }

  // Push last repair line
  if (currentRepairLine && currentRepairLine.paymentMethod === "WAR") {
    result.repairLines.push(currentRepairLine);
  }

  // Filter to meaningful lines
  result.repairLines = result.repairLines.filter(
    l => l.parts.length > 0 || l.labourHours > 0 || l.opCode
  );

  // If we found floating parts but no repair lines, store them as rawParts
  result.rawParts = floatingParts;

  return result;
}

interface PasteExtractorProps {
  onRepairLinesExtracted: (lines: WarrantyRepairLine[]) => void;
  onPartsExtracted: (parts: ClaimPartLine[], targetLineIndex: number) => void;
  onVehicleExtracted: (vehicle: Partial<ClaimVehicleInfo>) => void;
  onBsiExtracted: (bsi: string) => void;
  onRoExtracted: (ro: string) => void;
  existingLines: WarrantyRepairLine[];
  variant?: "compact" | "hero";
}

export function PasteExtractor({
  onRepairLinesExtracted, onPartsExtracted, onVehicleExtracted,
  onBsiExtracted, onRoExtracted, existingLines, variant = "compact",
}: PasteExtractorProps) {
  const [pasteText, setPasteText] = useState("");
  const [preview, setPreview] = useState<ParsedPasteResult | null>(null);
  const [targetLineIdx, setTargetLineIdx] = useState(0);

  const runParse = useCallback((text: string) => {
    if (!text.trim()) { setPreview(null); return; }
    const result = parseQuoteText(text);
    setPreview(result);
  }, []);

  const handleParse = useCallback(() => runParse(pasteText), [pasteText, runParse]);

  // Auto-parse when user pastes (Ctrl+V) into the textarea
  const handlePasteEvent = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = e.clipboardData.getData("text");
    if (!pasted) return;
    // Append to existing text (allow multi-block accumulation)
    const target = e.currentTarget;
    const start = target.selectionStart ?? pasteText.length;
    const end = target.selectionEnd ?? pasteText.length;
    const next = pasteText.slice(0, start) + pasted + pasteText.slice(end);
    e.preventDefault();
    setPasteText(next);
    // Defer parse so state updates first
    setTimeout(() => runParse(next), 0);
  }, [pasteText, runParse]);

  const handleApplyAll = useCallback(() => {
    if (!preview) return;

    // Apply vehicle info
    const v = preview.vehicle;
    if (v.vin || v.regNo || v.customerName || v.kilometers || v.warrantyStartDate) {
      onVehicleExtracted(v);
    }
    if (preview.bsiNumber) onBsiExtracted(preview.bsiNumber);
    if (preview.roNumber) onRoExtracted(preview.roNumber);

    // Apply repair lines
    if (preview.repairLines.length > 0) {
      onRepairLinesExtracted(preview.repairLines);
    }

    // Apply floating parts to target line
    if (preview.rawParts.length > 0 && existingLines.length > 0) {
      onPartsExtracted(preview.rawParts, targetLineIdx);
    }

    setPasteText("");
    setPreview(null);
  }, [preview, targetLineIdx, existingLines, onRepairLinesExtracted, onPartsExtracted, onVehicleExtracted, onBsiExtracted, onRoExtracted]);

  const handleApplyPartsOnly = useCallback(() => {
    if (!preview) return;
    const allParts = [
      ...preview.rawParts,
      ...preview.repairLines.flatMap(l => l.parts),
    ];
    if (allParts.length > 0 && existingLines.length > 0) {
      onPartsExtracted(allParts, targetLineIdx);
    }
    setPasteText("");
    setPreview(null);
  }, [preview, targetLineIdx, existingLines, onPartsExtracted]);

  const totalParts = preview
    ? preview.rawParts.length + preview.repairLines.reduce((s, l) => s + l.parts.length, 0)
    : 0;

  const isHero = variant === "hero";
  const detectedAny = preview && (
    preview.bsiNumber || preview.roNumber || preview.vehicle.vin ||
    preview.vehicle.regNo || preview.repairLines.length > 0 || preview.rawParts.length > 0
  );

  return (
    <Card className={isHero ? "border-primary/40 bg-primary/5 shadow-sm" : ""}>
      <CardHeader className={isHero ? "pb-2" : "pb-2"}>
        <CardTitle className={`flex items-center gap-2 ${isHero ? "text-sm text-primary" : "text-xs text-primary"}`}>
          {isHero ? <Sparkles className="h-4 w-4" /> : <ClipboardPaste className="h-3.5 w-3.5" />}
          {isHero ? "Quick Paste — BSI / Jobcard / Quote" : "Paste Quote Text"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className={`text-muted-foreground ${isHero ? "text-xs" : "text-[10px]"}`}>
          {isHero
            ? "Copy text from any BSI screen (Quote, Jobcard, Vehicle Details) and paste here — parsing happens automatically. Paste multiple blocks to build up the claim."
            : "Copy text from a BSI quote PDF, email, or spreadsheet and paste below. The parser auto-detects repair lines, parts, vehicle info, and claim numbers."}
        </p>

        <Textarea
          value={pasteText}
          onChange={e => { setPasteText(e.target.value); setPreview(null); }}
          onPaste={handlePasteEvent}
          rows={isHero ? 5 : 6}
          className={`font-mono ${isHero ? "text-xs min-h-[110px]" : "text-[10px] min-h-[100px]"}`}
          placeholder={isHero
            ? "Paste here from BSI, Jobcard, OASIS, or quote — anything copied from your open systems. Auto-detects on paste."
            : `Paste quote text here...\n\nExamples:\n1  18124A  Shock Absorber Front  WAR  2.0  1528.00\nMB3Z18124CE  KIT SHOCK ABSORBER  1  1555.50`}
        />

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleParse} disabled={!pasteText.trim()} className="text-xs gap-1.5">
            <Zap className="h-3 w-3" /> Re-parse
          </Button>
          {pasteText && (
            <Button variant="ghost" size="sm" onClick={() => { setPasteText(""); setPreview(null); }} className="text-xs gap-1 text-destructive">
              <Trash2 className="h-3 w-3" /> Clear
            </Button>
          )}
          {isHero && !preview && (
            <span className="text-[10px] text-muted-foreground">Paste to auto-detect…</span>
          )}
          {isHero && preview && !detectedAny && (
            <span className="text-[10px] text-muted-foreground">No structured data found yet — try copying more.</span>
          )}
        </div>

        {/* Preview Results */}
        {preview && (
          <div className="space-y-3 border-t pt-3">
            <div className="flex flex-wrap gap-2">
              {preview.bsiNumber && <Badge variant="outline" className="text-[10px]">BSI: {preview.bsiNumber}</Badge>}
              {preview.roNumber && <Badge variant="outline" className="text-[10px]">RO: {preview.roNumber}</Badge>}
              {preview.vehicle.vin && <Badge variant="outline" className="text-[10px] font-mono">VIN: {preview.vehicle.vin}</Badge>}
              {preview.vehicle.regNo && <Badge variant="outline" className="text-[10px]">Reg: {preview.vehicle.regNo}</Badge>}
              {preview.vehicle.kilometers && <Badge variant="outline" className="text-[10px]">KM: {preview.vehicle.kilometers}</Badge>}
              {preview.vehicle.warrantyStartDate && <Badge variant="outline" className="text-[10px]">WSD: {preview.vehicle.warrantyStartDate}</Badge>}
            </div>

            {preview.repairLines.length > 0 && (
              <div>
                <p className="text-[10px] font-medium text-foreground mb-1">
                  {preview.repairLines.length} Repair Line(s) Found:
                </p>
                {preview.repairLines.map((rl, i) => (
                  <div key={i} className="text-[10px] bg-muted/40 rounded px-2 py-1.5 mb-1 border border-border/50">
                    <div className="flex items-center gap-2">
                      <Badge className="text-[9px] h-4 px-1 font-mono">{rl.opCode || "—"}</Badge>
                      <span className="flex-1 truncate">{rl.operationDescription || "Repair"}</span>
                      <span className="font-mono text-muted-foreground">{rl.labourHours}h</span>
                    </div>
                    {rl.parts.length > 0 && (
                      <div className="mt-1 pl-4 space-y-0.5">
                        {rl.parts.map((p, j) => (
                          <div key={j} className="flex items-center gap-2 text-muted-foreground">
                            <span className="font-mono">{p.code}</span>
                            <span className="flex-1 truncate">{p.description}</span>
                            <span>×{p.qty}</span>
                            <span className="font-mono">R{p.unitPrice.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {preview.rawParts.length > 0 && (
              <div>
                <p className="text-[10px] font-medium text-foreground mb-1">
                  {preview.rawParts.length} Standalone Part(s):
                </p>
                {preview.rawParts.map((p, i) => (
                  <div key={i} className="text-[10px] flex items-center gap-2 text-muted-foreground px-2">
                    <span className="font-mono">{p.code}</span>
                    <span className="flex-1 truncate">{p.description}</span>
                    <span>×{p.qty}</span>
                    <span className="font-mono">R{p.unitPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            {preview.repairLines.length === 0 && preview.rawParts.length === 0 &&
              !preview.vehicle.vin && !preview.bsiNumber && (
                <p className="text-[10px] text-muted-foreground italic">
                  No structured data found. Try pasting more text or using tab-separated format.
                </p>
              )}

            <Separator />

            <div className="flex items-center gap-2 flex-wrap">
              {preview.repairLines.length > 0 && (
                <Button size="sm" onClick={handleApplyAll} className="text-xs gap-1.5">
                  <Check className="h-3 w-3" /> Apply All ({preview.repairLines.length} lines, {totalParts} parts)
                </Button>
              )}

              {totalParts > 0 && existingLines.length > 0 && (
                <>
                  <div className="flex items-center gap-1">
                    <Label className="text-[10px] text-muted-foreground">Add parts to:</Label>
                    <select
                      value={targetLineIdx}
                      onChange={e => setTargetLineIdx(parseInt(e.target.value))}
                      className="h-6 text-[10px] rounded border border-input bg-background px-1.5"
                    >
                      {existingLines.map((l, i) => (
                        <option key={i} value={i}>Line {l.itemNumber}</option>
                      ))}
                    </select>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleApplyPartsOnly} className="text-xs gap-1.5">
                    <Plus className="h-3 w-3" /> Parts Only ({totalParts})
                  </Button>
                </>
              )}

              {totalParts > 0 && existingLines.length === 0 && preview.repairLines.length === 0 && (
                <p className="text-[10px] text-muted-foreground">
                  Add a repair line first, then parts can be assigned to it.
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
