import { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Upload, Download, FileSpreadsheet, AlertTriangle, Trash2,
  FileText, Check, Loader2, File as FileIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { parseQuote } from "@/lib/claim-processor/parseQuote";
import { parseFrontPage } from "@/lib/claim-processor/parseFrontPage";
import { parseBackPage } from "@/lib/claim-processor/parseBackPage";
import { parseOasis } from "@/lib/claim-processor/parseOasis";
import { parseWarrantyHistory, checkRepeatRepairs } from "@/lib/claim-processor/parseWarrantyHistory";
import { matchMultipleSLTCodes, suggestCCCCodes } from "@/lib/claim-processor/matchSLT";
import { generateCOR, type CORExportData } from "@/lib/claim-processor/generateCOR";
import { generateAWA, type AWAFormData } from "@/lib/claim-processor/generateAWA";
import { generateOWSClaim } from "@/lib/claim-processor/generateOWS";
import {
  normalizeBsiNumber,
  type WarrantyRepairLine,
  type ClaimVehicleInfo,
  type ParsedBackPage,
  type ParsedOasis,
  type ParsedWarrantyHistory,
  type RepeatRepairWarning,
  type SLTMatch,
  type CCCMatch,
} from "@/lib/claim-processor/types";
import { saveAs } from "file-saver";

interface UploadedFile {
  file: File;
  type: "quote" | "backpage" | "frontpage" | "oasis" | "warranty_history" | "photo" | "other";
  parsed: boolean;
}

export default function ClaimProcessor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Extracted data
  const [bsiNumber, setBsiNumber] = useState("");
  const [claimNumber, setClaimNumber] = useState("");
  const [roNumber, setRoNumber] = useState("");
  const [vehicle, setVehicle] = useState<ClaimVehicleInfo>({
    customerName: "", company: "", vin: "", regNo: "", engineNo: "",
    vehicleModel: "", modelCode: "", warrantyStartDate: "", kilometers: "",
    deliveryDate: "", phone: "", email: "",
  });

  // Dealer info
  const [dealer, setDealer] = useState({
    name: "MMG Ford Bethlehem",
    branch: "Bethlehem",
    code: "90555",
    phone: "0583039890",
    email: "",
  });

  const [warrantyLines, setWarrantyLines] = useState<WarrantyRepairLine[]>([]);
  const [backPageData, setBackPageData] = useState<ParsedBackPage | null>(null);
  const [oasisData, setOasisData] = useState<ParsedOasis | null>(null);
  const [warrantyHistory, setWarrantyHistory] = useState<ParsedWarrantyHistory | null>(null);
  const [repeatWarnings, setRepeatWarnings] = useState<RepeatRepairWarning[]>([]);
  const [sltMatches, setSltMatches] = useState<Map<string, SLTMatch>>(new Map());
  const [cccSuggestions, setCccSuggestions] = useState<CCCMatch[]>([]);

  // Per-line editable fields
  const [lineComments, setLineComments] = useState<Record<number, { complaint: string; cause: string; correction: string }>>({});

  // Parts paste
  const [partsPaste, setPartsPaste] = useState("");

  const detectFileType = (name: string): UploadedFile["type"] => {
    const lower = name.toLowerCase();
    if (lower.includes("quote")) return "quote";
    if (lower.includes("back") || lower.includes("backpage")) return "backpage";
    if (lower.includes("front") || lower.includes("jobcard") || lower.includes("job_card")) return "frontpage";
    if (lower.includes("oasis")) return "oasis";
    if (lower.includes("warranty") || lower.includes("history")) return "warranty_history";
    if (lower.match(/\.(jpg|jpeg|png|gif|webp)$/)) return "photo";
    return "other";
  };

  const handleFileDrop = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newUploaded: UploadedFile[] = fileArray.map(f => ({
      file: f,
      type: detectFileType(f.name),
      parsed: false,
    }));
    setUploadedFiles(prev => [...prev, ...newUploaded]);

    setLoading(true);
    try {
      for (const uf of newUploaded) {
        try {
          if (uf.type === "quote" && uf.file.type === "application/pdf") {
            const parsed = await parseQuote(uf.file);
            if (parsed.bsiJobcardNo) {
              setBsiNumber(parsed.bsiJobcardNo);
              setClaimNumber(normalizeBsiNumber(parsed.bsiJobcardNo));
            }
            if (parsed.roNumber) setRoNumber(parsed.roNumber);
            if (parsed.vehicle.vin) setVehicle(parsed.vehicle);
            if (parsed.repairLines.length > 0) {
              setWarrantyLines(parsed.repairLines);
              // Match SLT codes
              const opCodes = parsed.repairLines.map(l => l.opCode).filter(Boolean);
              const matches = matchMultipleSLTCodes(opCodes);
              setSltMatches(matches);
              // Suggest CCC codes
              const allDescs = parsed.repairLines.map(l => l.operationDescription).join(" ");
              setCccSuggestions(suggestCCCCodes(allDescs));
            }
            if (parsed.dealerName) setDealer(d => ({ ...d, name: parsed.dealerName }));
            uf.parsed = true;
          } else if (uf.type === "frontpage" && uf.file.type === "application/pdf") {
            const parsed = await parseFrontPage(uf.file);
            if (parsed.bsiNumber && !bsiNumber) {
              setBsiNumber(parsed.bsiNumber);
              setClaimNumber(normalizeBsiNumber(parsed.bsiNumber));
            }
            if (parsed.roNumber && !roNumber) setRoNumber(parsed.roNumber);
            if (parsed.vin) setVehicle(v => ({ ...v, vin: parsed.vin || v.vin }));
            uf.parsed = true;
          } else if (uf.type === "backpage" && uf.file.type === "application/pdf") {
            const parsed = await parseBackPage(uf.file);
            setBackPageData(parsed);
            // Set line comments from back page
            const comments: Record<number, { complaint: string; cause: string; correction: string }> = {};
            parsed.lines.forEach(l => {
              comments[l.lineNumber] = { complaint: l.complaint, cause: l.cause, correction: l.correction };
            });
            setLineComments(prev => ({ ...prev, ...comments }));
            uf.parsed = true;
          } else if (uf.type === "oasis" && uf.file.type === "application/pdf") {
            const parsed = await parseOasis(uf.file);
            setOasisData(parsed);
            if (parsed.warrantyStartDate) setVehicle(v => ({ ...v, warrantyStartDate: parsed.warrantyStartDate }));
            if (parsed.odometer) setVehicle(v => ({ ...v, kilometers: parsed.odometer }));
            uf.parsed = true;
          } else if (uf.type === "warranty_history" && uf.file.type === "application/pdf") {
            const parsed = await parseWarrantyHistory(uf.file);
            setWarrantyHistory(parsed);
            if (warrantyLines.length > 0) {
              setRepeatWarnings(checkRepeatRepairs(warrantyLines, parsed));
            }
            uf.parsed = true;
          }
        } catch (err) {
          console.error(`Failed to parse ${uf.file.name}:`, err);
          toast({ title: "Parse Warning", description: `Could not fully parse ${uf.file.name}`, variant: "destructive" });
        }
      }
      setUploadedFiles(prev => [...prev]); // trigger re-render
    } finally {
      setLoading(false);
    }
  }, [bsiNumber, roNumber, warrantyLines, toast]);

  const handleParseParts = () => {
    if (!partsPaste.trim()) return;
    const lines = partsPaste.trim().split("\n");
    const parts = lines.map(line => {
      const cols = line.split(/[\t,;]+/);
      return {
        code: cols[0]?.trim() || "",
        description: cols[1]?.trim() || "",
        qty: parseInt(cols[2]?.trim()) || 1,
        unitPrice: parseFloat(cols[3]?.trim()?.replace(/[R\s]/g, "")) || 0,
      };
    }).filter(p => p.code);

    if (parts.length > 0 && warrantyLines.length > 0) {
      // Add parts to first warranty line (user can move later)
      setWarrantyLines(prev => {
        const updated = [...prev];
        updated[0] = { ...updated[0], parts: [...updated[0].parts, ...parts] };
        return updated;
      });
      setPartsPaste("");
      toast({ title: "Parts Added", description: `${parts.length} parts parsed and added to Line 1` });
    }
  };

  const getLineComment = (lineNum: number) => lineComments[lineNum] || { complaint: "", cause: "", correction: "" };

  const updateLineComment = (lineNum: number, field: "complaint" | "cause" | "correction", value: string) => {
    setLineComments(prev => ({
      ...prev,
      [lineNum]: { ...getLineComment(lineNum), [field]: value },
    }));
  };

  // File download with claim prefix
  const downloadRenamed = (uf: UploadedFile) => {
    const ext = uf.file.name.split(".").pop();
    const typeLabel = uf.type === "quote" ? "Quote" : uf.type === "backpage" ? "Back Page" : uf.type === "frontpage" ? "Front Page" : uf.type === "oasis" ? "OASIS Report" : uf.type === "warranty_history" ? "Warranty History" : uf.file.name;
    const newName = claimNumber ? `${claimNumber}-${typeLabel}.${ext}` : uf.file.name;
    saveAs(uf.file, newName);
  };

  // Generate handlers
  const handleGenerateCOR = async (lineIndex: number) => {
    const line = warrantyLines[lineIndex];
    const comments = getLineComment(line.itemNumber);
    const labourRate = 764;

    const corData: CORExportData = {
      dealershipName: dealer.name,
      branch: dealer.branch,
      dealerCode: dealer.code,
      todaysDate: new Date().toISOString().split("T")[0],
      phone: dealer.phone,
      email: dealer.email,
      customerName: vehicle.customerName,
      vehicleType: vehicle.vehicleModel,
      vin: vehicle.vin,
      regNo: vehicle.regNo,
      repairOrder: roNumber,
      repairLineNumber: String(line.itemNumber),
      warrantyStartDate: vehicle.warrantyStartDate,
      kilometers: vehicle.kilometers,
      complaint: comments.complaint || line.operationDescription,
      comment: comments.cause || "",
      parts: line.parts.map(p => ({
        code: p.code,
        description: p.description,
        qty: p.qty,
        fob: p.unitPrice,
        markup: 0,
        total: p.qty * p.unitPrice,
      })),
      labour: [{
        serial: 1,
        opCode: line.opCode,
        hours: line.labourHours,
        amount: line.labourHours * labourRate,
      }],
      claimTotal: line.parts.reduce((s, p) => s + p.qty * p.unitPrice, 0) + (line.labourHours * labourRate),
      causeDetailed: comments.cause,
      correction: comments.correction,
    };

    await generateCOR(corData, claimNumber || "DRAFT");
    toast({ title: "COR Generated", description: `Line ${line.itemNumber} COR downloaded` });
  };

  const handleGenerateAWA = async (lineIndex: number) => {
    const line = warrantyLines[lineIndex];
    const comments = getLineComment(line.itemNumber);

    // Build service history from warranty history
    const serviceHistory = warrantyHistory?.entries
      .filter(e => e.trxCode === "8159S" || e.customerComments.toLowerCase().includes("service"))
      .map(e => ({
        date: e.repairDate,
        mileage: e.distance,
        service: e.customerComments,
      })) || [];

    const awaData: AWAFormData = {
      dealershipName: dealer.name,
      branch: dealer.branch,
      dealerCode: dealer.code,
      todaysDate: new Date().toISOString().split("T")[0],
      phone: dealer.phone,
      email: dealer.email,
      customerName: vehicle.customerName,
      vehicleType: vehicle.vehicleModel,
      vehicleYear: vehicle.deliveryDate || "",
      monthsOld: "",
      vin: vehicle.vin,
      regNo: vehicle.regNo,
      roNumber,
      roDate: new Date().toISOString().split("T")[0],
      fleetCode: "",
      fleetName: "",
      warrantyStartDate: vehicle.warrantyStartDate,
      currentKilometers: vehicle.kilometers,
      customerPhone: vehicle.phone,
      complaint: comments.complaint || line.operationDescription,
      justification: `Kindly assist with AWA for ${line.operationDescription.toLowerCase()} if possible.`,
      loyaltyAnswers: [true, false, true, true, true, false],
      ifYesPreviousAWA: "",
      serviceHistory,
    };

    await generateAWA(awaData, claimNumber || "DRAFT");
    toast({ title: "AWA Generated", description: `Line ${line.itemNumber} AWA downloaded` });
  };

  const handleGenerateOWS = (lineIndex: number) => {
    const line = warrantyLines[lineIndex];
    const comments = getLineComment(line.itemNumber);

    generateOWSClaim({
      roNumber,
      roDate: new Date().toISOString().split("T")[0],
      vin: vehicle.vin,
      regNo: vehicle.regNo,
      vehicleModel: vehicle.vehicleModel,
      kilometers: vehicle.kilometers,
      customerName: vehicle.customerName,
      warrantyStartDate: vehicle.warrantyStartDate,
      dealerCode: dealer.code,
      dealerName: dealer.name,
      repairLine: line,
      complaint: comments.complaint || line.operationDescription,
      cause: comments.cause || "",
      correction: comments.correction || "",
      lineNumber: line.itemNumber,
    }, claimNumber || "DRAFT");

    toast({ title: "OWS Generated", description: `Line ${line.itemNumber} OWS claim downloaded` });
  };

  const handleGenerateAll = async () => {
    setLoading(true);
    try {
      for (let i = 0; i < warrantyLines.length; i++) {
        await handleGenerateCOR(i);
        await handleGenerateAWA(i);
        handleGenerateOWS(i);
      }
      toast({ title: "All Files Generated", description: `${warrantyLines.length * 3} files downloaded` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-primary" />
            Warranty Claim Processor
          </h1>
          <p className="text-sm text-muted-foreground">
            Upload BSI documents → auto-extract → generate COR, AWA & OWS files
          </p>
        </div>
        {warrantyLines.length > 0 && (
          <Button onClick={handleGenerateAll} disabled={loading} size="lg" className="gap-2">
            <Download className="h-4 w-4" />
            {loading ? "Generating…" : "Generate All"}
          </Button>
        )}
      </div>

      {/* Upload Zone */}
      <Card className="ford-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-primary flex items-center gap-2">
            <Upload className="h-4 w-4" /> Upload BSI Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileDrop(e.dataTransfer.files);
            }}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.multiple = true;
              input.accept = ".pdf,.jpg,.jpeg,.png";
              input.onchange = (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files) handleFileDrop(files);
              };
              input.click();
            }}
          >
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Drop or click to upload: <strong>Quote</strong>, <strong>Back Page</strong>, <strong>Front Page</strong>, <strong>OASIS Report</strong>, <strong>Warranty History</strong>
            </p>
            <p className="text-xs text-muted-foreground mt-1">PDF files auto-detected by filename</p>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-1">
              {uploadedFiles.map((uf, i) => (
                <div key={i} className="flex items-center gap-2 text-sm py-1 px-2 rounded bg-muted/30">
                  <FileIcon className="h-3 w-3 text-muted-foreground" />
                  <span className="flex-1 truncate">{uf.file.name}</span>
                  <Badge variant={uf.parsed ? "default" : "secondary"} className="text-[10px]">
                    {uf.type.replace("_", " ")}
                  </Badge>
                  {uf.parsed && <Check className="h-3 w-3 text-green-500" />}
                  {claimNumber && (
                    <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => downloadRenamed(uf)}>
                      <Download className="h-3 w-3" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive" onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Parsing documents…
        </div>
      )}

      {/* Claim Summary */}
      {(bsiNumber || vehicle.vin) && (
        <Card className="ford-card border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-primary">Claim Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div><span className="text-muted-foreground text-xs">BSI Number</span><p className="font-mono font-medium">{bsiNumber || "—"}</p></div>
              <div><span className="text-muted-foreground text-xs">Claim #</span><p className="font-mono font-medium">{claimNumber || "—"}</p></div>
              <div><span className="text-muted-foreground text-xs">RO Number</span><p className="font-mono font-medium">{roNumber || "—"}</p></div>
              <div><span className="text-muted-foreground text-xs">VIN</span><p className="font-mono font-medium text-xs">{vehicle.vin || "—"}</p></div>
              <div><span className="text-muted-foreground text-xs">Customer</span><p className="font-medium">{vehicle.customerName || "—"}</p></div>
              <div><span className="text-muted-foreground text-xs">Vehicle</span><p className="font-medium text-xs">{vehicle.vehicleModel || "—"}</p></div>
              <div><span className="text-muted-foreground text-xs">Warranty Start</span><p className="font-mono">{vehicle.warrantyStartDate || "—"}</p></div>
              <div><span className="text-muted-foreground text-xs">Kilometers</span><p className="font-mono">{vehicle.kilometers || "—"}</p></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Editable Dealer Info */}
      <Card className="ford-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-primary">Dealer Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Field label="Dealership Name" value={dealer.name} onChange={v => setDealer(d => ({ ...d, name: v }))} />
          <Field label="Branch" value={dealer.branch} onChange={v => setDealer(d => ({ ...d, branch: v }))} />
          <Field label="Dealer Code" value={dealer.code} onChange={v => setDealer(d => ({ ...d, code: v }))} />
          <Field label="Phone" value={dealer.phone} onChange={v => setDealer(d => ({ ...d, phone: v }))} />
          <Field label="Email" value={dealer.email} onChange={v => setDealer(d => ({ ...d, email: v }))} />
        </CardContent>
      </Card>

      {/* Editable Vehicle/Customer */}
      <Card className="ford-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-primary">Customer & Vehicle</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Field label="Customer Name" value={vehicle.customerName} onChange={v => setVehicle(prev => ({ ...prev, customerName: v }))} />
          <Field label="VIN" value={vehicle.vin} onChange={v => setVehicle(prev => ({ ...prev, vin: v }))} className="font-mono" />
          <Field label="Reg No." value={vehicle.regNo} onChange={v => setVehicle(prev => ({ ...prev, regNo: v }))} />
          <Field label="Engine No." value={vehicle.engineNo} onChange={v => setVehicle(prev => ({ ...prev, engineNo: v }))} className="font-mono" />
          <Field label="Vehicle Model" value={vehicle.vehicleModel} onChange={v => setVehicle(prev => ({ ...prev, vehicleModel: v }))} />
          <Field label="Warranty Start" value={vehicle.warrantyStartDate} onChange={v => setVehicle(prev => ({ ...prev, warrantyStartDate: v }))} />
          <Field label="Kilometers" value={vehicle.kilometers} onChange={v => setVehicle(prev => ({ ...prev, kilometers: v }))} />
          <Field label="Phone" value={vehicle.phone} onChange={v => setVehicle(prev => ({ ...prev, phone: v }))} />
          <Field label="RO Number" value={roNumber} onChange={setRoNumber} />
        </CardContent>
      </Card>

      {/* Repeat Repair Warnings */}
      {repeatWarnings.length > 0 && (
        <Card className="ford-card border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Repeat Repair Warnings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {repeatWarnings.map((w, i) => (
              <div key={i} className="text-xs text-destructive/80 bg-destructive/10 rounded p-2">
                <strong>Line {w.currentLine.itemNumber}:</strong> {w.reason}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* OASIS Info */}
      {oasisData && (
        <Card className="ford-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-primary">OASIS Report</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            <div><span className="text-muted-foreground">Vehicle:</span> {oasisData.vehicleDescription}</div>
            <div><span className="text-muted-foreground">Engine:</span> {oasisData.engine}</div>
            <div><span className="text-muted-foreground">Transmission:</span> {oasisData.transmission}</div>
            <div><span className="text-muted-foreground">Drive Type:</span> {oasisData.driveType}</div>
            <div><span className="text-muted-foreground">Build Date:</span> {oasisData.buildDate}</div>
            <div><span className="text-muted-foreground">Odometer:</span> {oasisData.odometer}</div>
            {oasisData.espInfo && (
              <div className="col-span-2"><span className="text-muted-foreground">ESP:</span> {oasisData.espInfo.contractNumber} — {oasisData.espInfo.status} (Exp: {oasisData.espInfo.expirationDate})</div>
            )}
            {oasisData.outstandingFSAs.length > 0 && (
              <div className="col-span-3">
                <span className="text-muted-foreground">Outstanding FSAs:</span>
                <div className="mt-1 space-y-1">
                  {oasisData.outstandingFSAs.map((f, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] mr-1">{f}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* SLT Matches */}
      {sltMatches.size > 0 && (
        <Card className="ford-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-primary">SLT Code Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {Array.from(sltMatches.entries()).map(([code, match]) => (
                <div key={code} className="flex items-center gap-2 text-xs bg-muted/30 rounded p-2">
                  <Badge className="text-[10px] font-mono">{match.opCode}</Badge>
                  <span className="flex-1">{match.description}</span>
                  <span className="font-mono text-muted-foreground">{match.hours}h</span>
                  <span className="text-muted-foreground">{match.section}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CCC Suggestions */}
      {cccSuggestions.length > 0 && (
        <Card className="ford-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-primary">Suggested CCC Codes</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {cccSuggestions.map((c, i) => (
              <Badge key={i} variant="outline" className="text-xs gap-1">
                {c.code} — {c.description} (Condition: {c.conditionCode})
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Paste Parts */}
      <Card className="ford-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-primary">Paste Parts (Bulk)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground">Paste tab/comma separated: Code, Description, Qty, Unit Price (one part per line)</p>
          <Textarea
            value={partsPaste}
            onChange={e => setPartsPaste(e.target.value)}
            rows={4}
            className="bg-background text-xs font-mono"
            placeholder="MB3Z18124CE	KIT SHOCK ABSORBER	1	1555.50&#10;W721979S440	NUT&WSHR M12 HF PTP	1	134.22"
          />
          <Button variant="outline" size="sm" onClick={handleParseParts} disabled={!partsPaste.trim()}>
            Parse & Add Parts
          </Button>
        </CardContent>
      </Card>

      {/* Warranty Repair Lines */}
      {warrantyLines.map((line, idx) => {
        const comments = getLineComment(line.itemNumber);
        const partsTotal = line.parts.reduce((s, p) => s + p.qty * p.unitPrice, 0);
        const labourTotal = line.labourAmount || line.labourHours * 764;

        return (
          <Card key={idx} className="ford-card">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm text-primary">
                  Line {line.itemNumber}: {line.opCode} — {line.operationDescription}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Payment: {line.paymentMethod} | Hours: {line.labourHours} | Parts: {line.parts.length}
                </p>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => handleGenerateCOR(idx)}>
                  <FileSpreadsheet className="h-3 w-3" /> COR
                </Button>
                <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => handleGenerateAWA(idx)}>
                  <FileText className="h-3 w-3" /> AWA
                </Button>
                <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => handleGenerateOWS(idx)}>
                  <FileText className="h-3 w-3" /> OWS
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Parts table */}
              <div className="text-xs">
                <div className="grid grid-cols-[1fr_2fr_0.5fr_1fr_1fr] gap-2 text-muted-foreground font-medium mb-1">
                  <span>Part Code</span><span>Description</span><span className="text-right">Qty</span>
                  <span className="text-right">Unit Price</span><span className="text-right">Total</span>
                </div>
                <Separator />
                {line.parts.map((p, pi) => (
                  <div key={pi} className="grid grid-cols-[1fr_2fr_0.5fr_1fr_1fr] gap-2 py-1">
                    <span className="font-mono">{p.code}</span>
                    <span>{p.description}</span>
                    <span className="text-right">{p.qty}</span>
                    <span className="text-right font-mono">R {p.unitPrice.toFixed(2)}</span>
                    <span className="text-right font-mono">R {(p.qty * p.unitPrice).toFixed(2)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between mt-1 font-medium">
                  <span>Parts: R {partsTotal.toFixed(2)}</span>
                  <span>Labour: R {labourTotal.toFixed(2)}</span>
                  <span className="text-primary">Total: R {(partsTotal + labourTotal).toFixed(2)}</span>
                </div>
              </div>

              {/* Complaint / Cause / Correction */}
              <div className="space-y-2">
                <div>
                  <Label className="text-[10px] text-muted-foreground">Complaint</Label>
                  <Input value={comments.complaint} onChange={e => updateLineComment(line.itemNumber, "complaint", e.target.value)} className="bg-background h-8 text-xs" />
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Cause</Label>
                  <Textarea value={comments.cause} onChange={e => updateLineComment(line.itemNumber, "cause", e.target.value)} rows={3} className="bg-background text-xs" />
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Correction</Label>
                  <Input value={comments.correction} onChange={e => updateLineComment(line.itemNumber, "correction", e.target.value)} className="bg-background h-8 text-xs" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Warranty History */}
      {warrantyHistory && warrantyHistory.entries.length > 0 && (
        <Card className="ford-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-primary">Warranty History ({warrantyHistory.entries.length} entries)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-1">Doc #</th>
                    <th className="text-left py-1">Date</th>
                    <th className="text-left py-1">Dealer</th>
                    <th className="text-left py-1">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {warrantyHistory.entries.map((entry, i) => (
                    <tr key={i} className="border-b border-muted/30">
                      <td className="py-1 font-mono">{entry.docNumber}</td>
                      <td className="py-1">{entry.repairDate}</td>
                      <td className="py-1">{entry.dealership}</td>
                      <td className="py-1 max-w-xs truncate">{entry.customerComments || entry.techComments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom generate bar */}
      {warrantyLines.length > 0 && (
        <div className="flex justify-end pb-8">
          <Button onClick={handleGenerateAll} disabled={loading} size="lg" className="gap-2">
            <Download className="h-4 w-4" />
            {loading ? "Generating…" : `Generate All (${warrantyLines.length} lines × 3 files)`}
          </Button>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, className = "" }: {
  label: string; value: string; onChange: (v: string) => void; className?: string;
}) {
  return (
    <div className={className}>
      <Label className="text-[10px] text-muted-foreground">{label}</Label>
      <Input value={value} onChange={e => onChange(e.target.value)} className="bg-background h-8 text-xs" />
    </div>
  );
}
