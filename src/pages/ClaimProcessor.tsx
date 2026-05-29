import { PageMeta } from "@/components/PageMeta";
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload, Download, FileSpreadsheet, AlertTriangle, Plus,
  FileText, Loader2, Package, Settings, Zap, History, Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { parseQuote } from "@/lib/claim-processor/parseQuote";
import { parseFrontPage } from "@/lib/claim-processor/parseFrontPage";
import { parseBackPage } from "@/lib/claim-processor/parseBackPage";
import { parseOasis } from "@/lib/claim-processor/parseOasis";
import { parseWarrantyHistory, checkRepeatRepairs } from "@/lib/claim-processor/parseWarrantyHistory";
import { matchMultipleSLTCodes, suggestCCCCodes, suggestSLTFromDescription } from "@/lib/claim-processor/matchSLT";
import { generateCOR, type CORExportData } from "@/lib/claim-processor/generateCOR";
import { generateAWA, type AWAFormData } from "@/lib/claim-processor/generateAWA";
import { generateOWSClaim } from "@/lib/claim-processor/generateOWS";
import {
  normalizeBsiNumber,
  type WarrantyRepairLine,
  type ClaimVehicleInfo,
  type ClaimPartLine,
  type ParsedBackPage,
  type ParsedOasis,
  type ParsedWarrantyHistory,
  type RepeatRepairWarning,
  type SLTMatch,
  type CCCMatch,
} from "@/lib/claim-processor/types";
import { UploadZone, detectFileType, type UploadedFile, type FileType } from "@/components/claim/UploadZone";
import { RepairLineCard } from "@/components/claim/RepairLineCard";
import { QuickLinks } from "@/components/claim/QuickLinks";
import { ClaimSummaryBar } from "@/components/claim/ClaimSummaryBar";
import { PasteExtractor } from "@/components/claim/PasteExtractor";
import { SuggestedFromHistory } from "@/components/claim/SuggestedFromHistory";
import { addLibraryRecord, isAutoSaveOn } from "@/lib/claim-library/store";
import { saveAs } from "file-saver";
import JSZip from "jszip";

export default function ClaimProcessor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Core data
  const [bsiNumber, setBsiNumber] = useState("");
  const [claimNumber, setClaimNumber] = useState("");
  const [roNumber, setRoNumber] = useState("");
  const [labourRate, setLabourRate] = useState(764);
  const [vehicle, setVehicle] = useState<ClaimVehicleInfo>({
    customerName: "", company: "", vin: "", regNo: "", engineNo: "",
    vehicleModel: "", modelCode: "", warrantyStartDate: "", kilometers: "",
    deliveryDate: "", phone: "", email: "",
  });
  const [dealer, setDealer] = useState({
    name: "MMG Ford Bethlehem", branch: "Bethlehem", code: "90555",
    phone: "0583039890", email: "",
  });

  const [warrantyLines, setWarrantyLines] = useState<WarrantyRepairLine[]>([]);
  const [backPageData, setBackPageData] = useState<ParsedBackPage | null>(null);
  const [oasisData, setOasisData] = useState<ParsedOasis | null>(null);
  const [warrantyHistory, setWarrantyHistory] = useState<ParsedWarrantyHistory | null>(null);
  const [repeatWarnings, setRepeatWarnings] = useState<RepeatRepairWarning[]>([]);
  const [sltMatches, setSltMatches] = useState<Map<string, SLTMatch>>(new Map());
  const [cccSuggestions, setCccSuggestions] = useState<CCCMatch[]>([]);
  const [lineComments, setLineComments] = useState<Record<number, { complaint: string; cause: string; correction: string }>>({});

  // File handlers
  const handleFilesAdded = useCallback(async (files: File[]) => {
    const newUploaded: UploadedFile[] = files.map(f => ({
      file: f, type: detectFileType(f.name), parsed: false,
    }));
    setUploadedFiles(prev => [...prev, ...newUploaded]);
    setLoading(true);

    try {
      for (const uf of newUploaded) {
        try {
          if (uf.type === "quote" && uf.file.type === "application/pdf") {
            const parsed = await parseQuote(uf.file);
            if (parsed.bsiJobcardNo) { setBsiNumber(parsed.bsiJobcardNo); setClaimNumber(normalizeBsiNumber(parsed.bsiJobcardNo)); }
            if (parsed.roNumber) setRoNumber(parsed.roNumber);
            if (parsed.vehicle.vin) setVehicle(parsed.vehicle);
            if (parsed.repairLines.length > 0) {
              setWarrantyLines(parsed.repairLines);
              const opCodes = parsed.repairLines.map(l => l.opCode).filter(Boolean);
              setSltMatches(matchMultipleSLTCodes(opCodes));
              const allDesc = parsed.repairLines.map(l => l.operationDescription).join(" ");
              setCccSuggestions(suggestCCCCodes(allDesc));
            }
            if (parsed.dealerName) setDealer(d => ({ ...d, name: parsed.dealerName }));
            uf.parsed = true;
          } else if (uf.type === "frontpage" && uf.file.type === "application/pdf") {
            const parsed = await parseFrontPage(uf.file);
            if (parsed.bsiNumber) { setBsiNumber(prev => prev || parsed.bsiNumber); setClaimNumber(prev => prev || normalizeBsiNumber(parsed.bsiNumber)); }
            if (parsed.roNumber) setRoNumber(prev => prev || parsed.roNumber);
            if (parsed.vin) setVehicle(v => ({ ...v, vin: parsed.vin || v.vin }));
            uf.parsed = true;
          } else if (uf.type === "backpage" && uf.file.type === "application/pdf") {
            const parsed = await parseBackPage(uf.file);
            setBackPageData(parsed);
            const comments: Record<number, { complaint: string; cause: string; correction: string }> = {};
            parsed.lines.forEach(l => { comments[l.lineNumber] = { complaint: l.complaint, cause: l.cause, correction: l.correction }; });
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
            uf.parsed = true;
          }
        } catch (err) {
          console.error(`Failed to parse ${uf.file.name}:`, err);
          toast({ title: "Parse Warning", description: `Could not fully parse ${uf.file.name}`, variant: "destructive" });
        }
      }
      setUploadedFiles(prev => [...prev]);
      if (newUploaded.some(f => f.type === "quote")) setActiveTab("review");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleFileTypeChanged = (index: number, type: FileType) => {
    setUploadedFiles(prev => prev.map((f, i) => i === index ? { ...f, type, parsed: false } : f));
  };

  const downloadRenamed = (uf: UploadedFile) => {
    const ext = uf.file.name.split(".").pop();
    const typeLabels: Record<FileType, string> = {
      quote: "Quote", backpage: "Back Page", frontpage: "Front Page",
      oasis: "OASIS Report", warranty_history: "Warranty History", photo: "Photo", other: uf.file.name,
    };
    saveAs(uf.file, claimNumber ? `${claimNumber}-${typeLabels[uf.type]}.${ext}` : uf.file.name);
  };

  // Line management
  const getLineComment = (lineNum: number) => lineComments[lineNum] || { complaint: "", cause: "", correction: "" };
  const updateLineComment = (lineNum: number, field: "complaint" | "cause" | "correction", value: string) => {
    setLineComments(prev => ({ ...prev, [lineNum]: { ...getLineComment(lineNum), [field]: value } }));
  };

  const addManualLine = () => {
    const nextNum = warrantyLines.length > 0 ? Math.max(...warrantyLines.map(l => l.itemNumber)) + 1 : 1;
    setWarrantyLines(prev => [...prev, {
      itemNumber: nextNum, opCode: "", operationDescription: "", paymentMethod: "WAR",
      labourHours: 0, labourAmount: 0, parts: [], subTotal: 0, vatAmount: 0, total: 0,
    }]);
  };

  const updateWarrantyLine = (index: number, updates: Partial<WarrantyRepairLine>) => {
    setWarrantyLines(prev => prev.map((l, i) => i === index ? { ...l, ...updates } : l));
  };

  const removeWarrantyLine = (index: number) => {
    setWarrantyLines(prev => prev.filter((_, i) => i !== index));
  };

  // Paste extractor handlers
  const handlePasteRepairLines = (lines: WarrantyRepairLine[]) => {
    setWarrantyLines(prev => [...prev, ...lines]);
    const opCodes = lines.map(l => l.opCode).filter(Boolean);
    setSltMatches(prev => {
      const merged = new Map(prev);
      matchMultipleSLTCodes(opCodes).forEach((v, k) => merged.set(k, v));
      return merged;
    });
    const allDesc = lines.map(l => l.operationDescription).join(" ");
    setCccSuggestions(prev => [...prev, ...suggestCCCCodes(allDesc)]);
    toast({ title: "Lines Added", description: `${lines.length} repair line(s) added from pasted text` });
  };

  const handlePasteParts = (parts: ClaimPartLine[], targetIdx: number) => {
    const idx = Math.min(targetIdx, warrantyLines.length - 1);
    setWarrantyLines(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], parts: [...updated[idx].parts, ...parts] };
      return updated;
    });
    toast({ title: "Parts Added", description: `${parts.length} part(s) added to Line ${warrantyLines[idx].itemNumber}` });
  };

  const handlePasteVehicle = (v: Partial<ClaimVehicleInfo>) => {
    setVehicle(prev => ({ ...prev, ...Object.fromEntries(Object.entries(v).filter(([_, val]) => val)) }));
  };

  // When paste populates real data, jump user to the Review tab automatically
  const handlePasteRepairLinesAuto = (lines: WarrantyRepairLine[]) => {
    handlePasteRepairLines(lines);
    if (lines.length > 0) setActiveTab("review");
  };
  const handlePasteVehicleAuto = (v: Partial<ClaimVehicleInfo>) => {
    handlePasteVehicle(v);
    if (v.vin || v.regNo || v.customerName) setActiveTab(prev => prev === "upload" ? "review" : prev);
  };

  // Build data helpers
  const buildCORData = (lineIndex: number): CORExportData => {
    const line = warrantyLines[lineIndex];
    const comments = getLineComment(line.itemNumber);
    return {
      dealershipName: dealer.name, branch: dealer.branch, dealerCode: dealer.code,
      todaysDate: new Date().toISOString().split("T")[0], phone: dealer.phone, email: dealer.email,
      customerName: vehicle.customerName, vehicleType: vehicle.vehicleModel,
      vin: vehicle.vin, regNo: vehicle.regNo, repairOrder: roNumber,
      repairLineNumber: String(line.itemNumber), warrantyStartDate: vehicle.warrantyStartDate,
      kilometers: vehicle.kilometers, complaint: comments.complaint || line.operationDescription,
      comment: comments.cause || "",
      parts: line.parts.map(p => ({ code: p.code, description: p.description, qty: p.qty, fob: p.unitPrice, markup: 0, total: p.qty * p.unitPrice })),
      labour: [{ serial: 1, opCode: line.opCode, hours: line.labourHours, amount: line.labourHours * labourRate }],
      claimTotal: line.parts.reduce((s, p) => s + p.qty * p.unitPrice, 0) + (line.labourHours * labourRate),
      causeDetailed: comments.cause, correction: comments.correction,
    };
  };

  const buildAWAData = (lineIndex: number): AWAFormData => {
    const line = warrantyLines[lineIndex];
    const comments = getLineComment(line.itemNumber);
    const serviceHistory = warrantyHistory?.entries
      .filter(e => e.trxCode === "8159S" || e.customerComments.toLowerCase().includes("service"))
      .map(e => ({ date: e.repairDate, mileage: e.distance, service: e.customerComments })) || [];
    return {
      dealershipName: dealer.name, branch: dealer.branch, dealerCode: dealer.code,
      todaysDate: new Date().toISOString().split("T")[0], phone: dealer.phone, email: dealer.email,
      customerName: vehicle.customerName, vehicleType: vehicle.vehicleModel,
      vehicleYear: vehicle.deliveryDate || "", monthsOld: "", vin: vehicle.vin, regNo: vehicle.regNo,
      roNumber, roDate: new Date().toISOString().split("T")[0], fleetCode: "", fleetName: "",
      warrantyStartDate: vehicle.warrantyStartDate, currentKilometers: vehicle.kilometers,
      customerPhone: vehicle.phone, complaint: comments.complaint || line.operationDescription,
      justification: `Kindly assist with AWA for ${line.operationDescription.toLowerCase()} if possible.`,
      loyaltyAnswers: [true, false, true, true, true, false], ifYesPreviousAWA: "", serviceHistory,
    };
  };

  const buildOWSData = (lineIndex: number) => {
    const line = warrantyLines[lineIndex];
    const comments = getLineComment(line.itemNumber);
    return {
      roNumber, roDate: new Date().toISOString().split("T")[0],
      vin: vehicle.vin, regNo: vehicle.regNo, vehicleModel: vehicle.vehicleModel,
      kilometers: vehicle.kilometers, customerName: vehicle.customerName,
      warrantyStartDate: vehicle.warrantyStartDate, dealerCode: dealer.code, dealerName: dealer.name,
      repairLine: line, complaint: comments.complaint || line.operationDescription,
      cause: comments.cause || "", correction: comments.correction || "", lineNumber: line.itemNumber,
    };
  };

  const handleGenerateAll = async () => {
    setLoading(true);
    try {
      const cn = claimNumber || "DRAFT";
      const zip = new JSZip();
      for (let i = 0; i < warrantyLines.length; i++) {
        const corResult = await generateCOR(buildCORData(i), cn, true);
        if (typeof corResult !== "string") zip.file(corResult.fileName, corResult.blob);
        const awaResult = await generateAWA(buildAWAData(i), cn, true);
        if (typeof awaResult !== "string") zip.file(awaResult.fileName, awaResult.blob);
        const owsResult = generateOWSClaim(buildOWSData(i), cn, true);
        if (typeof owsResult !== "string") zip.file(owsResult.fileName, owsResult.blob);
      }
      for (const uf of uploadedFiles) {
        const ext = uf.file.name.split(".").pop();
        const typeLabels: Record<FileType, string> = {
          quote: "Quote", backpage: "Back Page", frontpage: "Front Page",
          oasis: "OASIS Report", warranty_history: "Warranty History", photo: "Photo", other: uf.file.name.replace(/\.\w+$/, ""),
        };
        zip.file(`${cn}-${typeLabels[uf.type]}.${ext}`, uf.file);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `${cn}-Claim Pack.zip`);
      toast({ title: "Claim Pack Downloaded", description: `All files bundled into ${cn}-Claim Pack.zip` });
      if (isAutoSaveOn() && warrantyLines.length > 0) {
        const firstCmt = getLineComment(warrantyLines[0].itemNumber);
        addLibraryRecord({
          source: "claim-processor",
          vin: vehicle.vin || undefined,
          model: vehicle.vehicleModel || undefined,
          causalPart: warrantyLines[0].parts[0]?.code,
          customerConcern: firstCmt.complaint || warrantyLines[0].operationDescription,
          cause: firstCmt.cause,
          correction: firstCmt.correction,
          laborOps: warrantyLines.map((l) => ({
            opCode: l.opCode, description: l.operationDescription, hours: l.labourHours,
          })).filter((o) => o.opCode),
          parts: warrantyLines.flatMap((l) => l.parts).map((p) => ({
            code: p.code, description: p.description, qty: p.qty,
          })).filter((p) => p.code),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Check repeat repairs
  const currentWarnings = warrantyHistory && warrantyLines.length > 0
    ? checkRepeatRepairs(warrantyLines, warrantyHistory)
    : repeatWarnings;

  const parsedCount = uploadedFiles.filter(f => f.parsed).length;
  const hasData = bsiNumber || vehicle.vin || warrantyLines.length > 0;

  return (
    <div className="space-y-4 max-w-6xl">
      <PageMeta
        title="Claim Processor — Generate COR, AWA & OWS Files"
        description="Upload Ford BSI claim documents to auto-extract data and generate COR, AWA and OWS files per warranty repair line."
        path="/cor"
      />
      {/* Header with Quick Links */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileSpreadsheet className="h-6 w-6 text-primary" />
              Warranty Claim Processor
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload BSI docs → Review & match codes → Generate claim pack
            </p>
          </div>
          {warrantyLines.length > 0 && (
            <Button onClick={handleGenerateAll} disabled={loading} size="lg" className="gap-2">
              <Download className="h-4 w-4" />
              {loading ? "Generating…" : `Download All (ZIP)`}
            </Button>
          )}
        </div>

        {/* Quick Links Bar */}
        <Card className="border-muted bg-muted/20">
          <CardContent className="py-2.5 px-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider shrink-0">Quick Launch</span>
              <QuickLinks />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Paste — primary entry. Copy from BSI / Jobcard / Quote and auto-populate. */}
      <PasteExtractor
        variant="hero"
        onRepairLinesExtracted={handlePasteRepairLinesAuto}
        onPartsExtracted={handlePasteParts}
        onVehicleExtracted={handlePasteVehicleAuto}
        onBsiExtracted={(bsi) => { setBsiNumber(bsi); setClaimNumber(normalizeBsiNumber(bsi)); }}
        onRoExtracted={setRoNumber}
        existingLines={warrantyLines}
      />

      {/* Claim Summary — always visible once we have data */}
      {hasData && (
        <ClaimSummaryBar
          bsiNumber={bsiNumber}
          claimNumber={claimNumber}
          roNumber={roNumber}
          vehicle={vehicle}
          lineCount={warrantyLines.length}
        />
      )}

      {hasData && (
        <SuggestedFromHistory
          input={{
            ccc: cccSuggestions[0]?.code,
            customerConcern: warrantyLines.map((l) =>
              `${l.operationDescription} ${getLineComment(l.itemNumber).complaint}`
            ).join(" "),
            causalPart: warrantyLines[0]?.parts[0]?.code,
            model: vehicle.vehicleModel,
          }}
          onAddLaborOp={(op) => {
            const nextNum = warrantyLines.length > 0 ? Math.max(...warrantyLines.map((l) => l.itemNumber)) + 1 : 1;
            setWarrantyLines((prev) => [...prev, {
              itemNumber: nextNum, opCode: op.opCode, operationDescription: op.description,
              paymentMethod: "WAR", labourHours: op.hours, labourAmount: op.hours * labourRate,
              parts: [], subTotal: 0, vatAmount: 0, total: 0,
            }]);
            toast({ title: "Op added", description: `${op.opCode} added as a new line` });
          }}
          onAddPart={(p) => {
            if (warrantyLines.length === 0) {
              toast({ title: "Add a labor line first", description: "Parts attach to an existing repair line.", variant: "destructive" });
              return;
            }
            const idx = warrantyLines.length - 1;
            setWarrantyLines((prev) => {
              const updated = [...prev];
              updated[idx] = { ...updated[idx], parts: [...updated[idx].parts, { ...p, unitPrice: 0 }] };
              return updated;
            });
            toast({ title: "Part added", description: `${p.code} added to line ${warrantyLines[idx].itemNumber}` });
          }}
        />
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="gap-1.5">
            <Upload className="h-3.5 w-3.5" /> Upload
            {uploadedFiles.length > 0 && <Badge variant="secondary" className="h-4 text-[10px] px-1">{uploadedFiles.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="review" className="gap-1.5" disabled={!hasData}>
            <Eye className="h-3.5 w-3.5" /> Review & Edit
            {warrantyLines.length > 0 && <Badge variant="secondary" className="h-4 text-[10px] px-1">{warrantyLines.length} lines</Badge>}
          </TabsTrigger>
          <TabsTrigger value="generate" className="gap-1.5" disabled={warrantyLines.length === 0}>
            <Zap className="h-3.5 w-3.5" /> Generate
          </TabsTrigger>
        </TabsList>

        {/* ===== UPLOAD TAB ===== */}
        <TabsContent value="upload" className="space-y-4 mt-4">
          <UploadZone
            files={uploadedFiles}
            onFilesAdded={handleFilesAdded}
            onFileRemoved={(i) => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}
            onFileTypeChanged={handleFileTypeChanged}
            onDownloadRenamed={downloadRenamed}
            claimNumber={claimNumber}
            loading={loading}
          />

          <p className="text-xs text-muted-foreground text-center">
            Tip: you don't have to upload files — paste text from BSI, the Jobcard screen, or OASIS into the
            <strong className="text-foreground"> Quick Paste </strong>
            box above and the claim populates automatically.
          </p>

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Parsing documents…
            </div>
          )}

          {parsedCount > 0 && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-primary font-medium">{parsedCount} file(s) parsed successfully</span>
                  </div>
                  <Button onClick={() => setActiveTab("review")} size="sm" className="gap-1">
                    Review Data <FileText className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ===== REVIEW TAB ===== */}
        <TabsContent value="review" className="space-y-4 mt-4">
          {/* Repeat Warnings */}
          {currentWarnings.length > 0 && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Repeat Repair Warnings ({currentWarnings.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {currentWarnings.map((w, i) => (
                  <div key={i} className="text-xs text-destructive/80 bg-destructive/10 rounded p-2">
                    <strong>Line {w.currentLine.itemNumber}:</strong> {w.reason}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Dealer + Vehicle in 2-col grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-primary flex items-center gap-1.5">
                  <Settings className="h-3.5 w-3.5" /> Dealer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Field label="Dealership" value={dealer.name} onChange={v => setDealer(d => ({ ...d, name: v }))} />
                <Field label="Branch" value={dealer.branch} onChange={v => setDealer(d => ({ ...d, branch: v }))} />
                <Field label="Code" value={dealer.code} onChange={v => setDealer(d => ({ ...d, code: v }))} />
                <Field label="Phone" value={dealer.phone} onChange={v => setDealer(d => ({ ...d, phone: v }))} />
                <div className="col-span-2">
                  <Field label="Email" value={dealer.email} onChange={v => setDealer(d => ({ ...d, email: v }))} />
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Labour Rate (R/hr)</Label>
                  <Input type="number" value={labourRate} onChange={e => setLabourRate(parseFloat(e.target.value) || 0)} className="h-7 text-xs font-mono" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-primary flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5" /> Customer & Vehicle
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Field label="Customer" value={vehicle.customerName} onChange={v => setVehicle(prev => ({ ...prev, customerName: v }))} />
                <Field label="VIN" value={vehicle.vin} onChange={v => setVehicle(prev => ({ ...prev, vin: v }))} className="font-mono" />
                <Field label="Reg No." value={vehicle.regNo} onChange={v => setVehicle(prev => ({ ...prev, regNo: v }))} />
                <Field label="Engine No." value={vehicle.engineNo} onChange={v => setVehicle(prev => ({ ...prev, engineNo: v }))} className="font-mono" />
                <Field label="Vehicle Model" value={vehicle.vehicleModel} onChange={v => setVehicle(prev => ({ ...prev, vehicleModel: v }))} />
                <Field label="Warranty Start" value={vehicle.warrantyStartDate} onChange={v => setVehicle(prev => ({ ...prev, warrantyStartDate: v }))} />
                <Field label="Kilometers" value={vehicle.kilometers} onChange={v => setVehicle(prev => ({ ...prev, kilometers: v }))} />
                <Field label="RO Number" value={roNumber} onChange={setRoNumber} />
              </CardContent>
            </Card>
          </div>

          {/* OASIS + SLT + CCC inline */}
          {(oasisData || sltMatches.size > 0 || cccSuggestions.length > 0) && (
            <div className="grid md:grid-cols-3 gap-4">
              {oasisData && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs text-primary">OASIS Data</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-[10px]">
                    <p><span className="text-muted-foreground">Vehicle:</span> {oasisData.vehicleDescription}</p>
                    <p><span className="text-muted-foreground">Engine:</span> {oasisData.engine}</p>
                    <p><span className="text-muted-foreground">Transmission:</span> {oasisData.transmission}</p>
                    <p><span className="text-muted-foreground">Build Date:</span> {oasisData.buildDate}</p>
                    {oasisData.espInfo && <p><span className="text-muted-foreground">ESP:</span> {oasisData.espInfo.status}</p>}
                    {oasisData.outstandingFSAs.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {oasisData.outstandingFSAs.map((f, i) => <Badge key={i} variant="outline" className="text-[9px]">{f}</Badge>)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              {sltMatches.size > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs text-primary">SLT Matches</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    {Array.from(sltMatches.entries()).map(([code, match]) => (
                      <div key={code} className="flex items-center gap-1.5 text-[10px]">
                        <Badge className="text-[9px] font-mono h-4 px-1">{match.opCode}</Badge>
                        <span className="flex-1 truncate">{match.description}</span>
                        <span className="font-mono text-muted-foreground">{match.hours}h</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
              {cccSuggestions.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs text-primary">CCC Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-1.5">
                    {cccSuggestions.map((c, i) => (
                      <Badge key={i} variant="outline" className="text-[10px]">
                        {c.code} — {c.description} ({c.conditionCode})
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Paste extra parts / additional repair lines */}
          <PasteExtractor
            onRepairLinesExtracted={handlePasteRepairLines}
            onPartsExtracted={handlePasteParts}
            onVehicleExtracted={handlePasteVehicle}
            onBsiExtracted={(bsi) => { setBsiNumber(bsi); setClaimNumber(normalizeBsiNumber(bsi)); }}
            onRoExtracted={setRoNumber}
            existingLines={warrantyLines}
          />

          {/* Warranty Repair Lines */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-primary flex items-center gap-1.5">
              Warranty Repair Lines ({warrantyLines.length})
            </h2>
            <Button variant="outline" size="sm" onClick={addManualLine} className="text-xs gap-1">
              <Plus className="h-3 w-3" /> Add Line
            </Button>
          </div>

          {warrantyLines.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No warranty lines yet. Paste a BSI quote into the Quick Paste box above, upload a Quote PDF, or add a line manually.
              </CardContent>
            </Card>
          )}

          {warrantyLines.map((line, idx) => {
            const lineText = [
              line.operationDescription,
              getLineComment(line.itemNumber).complaint,
              getLineComment(line.itemNumber).cause,
              getLineComment(line.itemNumber).correction,
            ].filter(Boolean).join(" ");
            const lineCCC = suggestCCCCodes(lineText);
            const lineSLTSuggestions = !sltMatches.has(line.opCode) ? suggestSLTFromDescription(lineText) : [];
            return (
              <RepairLineCard
                key={`${line.itemNumber}-${idx}`}
                line={line}
                lineIndex={idx}
                comments={getLineComment(line.itemNumber)}
                sltMatch={sltMatches.get(line.opCode)}
                sltSuggestions={lineSLTSuggestions}
                cccMatches={lineCCC}
                labourRate={labourRate}
                onUpdateComments={(field, value) => updateLineComment(line.itemNumber, field, value)}
                onUpdateParts={(parts) => updateWarrantyLine(idx, { parts })}
                onUpdateLine={(updates) => updateWarrantyLine(idx, updates)}
                onApplySLT={(slt) => {
                  updateWarrantyLine(idx, { opCode: slt.opCode, labourHours: slt.hours, operationDescription: slt.description });
                  setSltMatches(prev => new Map(prev).set(slt.opCode, slt));
                }}
                onGenerateCOR={() => generateCOR(buildCORData(idx), claimNumber || "DRAFT").then(() => toast({ title: "COR Generated" }))}
                onGenerateAWA={() => generateAWA(buildAWAData(idx), claimNumber || "DRAFT").then(() => toast({ title: "AWA Generated" }))}
                onGenerateOWS={() => { generateOWSClaim(buildOWSData(idx), claimNumber || "DRAFT"); toast({ title: "OWS Generated" }); }}
                onRemoveLine={() => removeWarrantyLine(idx)}
              />
            );
          })}

          {/* Warranty History */}
          {warrantyHistory && warrantyHistory.entries.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-primary flex items-center gap-1.5">
                  <History className="h-3.5 w-3.5" /> Warranty History ({warrantyHistory.entries.length} entries)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="border-b text-muted-foreground">
                        <th className="text-left py-1 pr-2">Doc #</th>
                        <th className="text-left py-1 pr-2">Date</th>
                        <th className="text-left py-1 pr-2">Dealer</th>
                        <th className="text-left py-1">Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {warrantyHistory.entries.slice(0, 20).map((entry, i) => (
                        <tr key={i} className="border-b border-muted/30">
                          <td className="py-1 pr-2 font-mono">{entry.docNumber}</td>
                          <td className="py-1 pr-2">{entry.repairDate}</td>
                          <td className="py-1 pr-2">{entry.dealership}</td>
                          <td className="py-1 max-w-xs truncate">{entry.customerComments || entry.techComments}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {warrantyHistory.entries.length > 20 && (
                    <p className="text-[10px] text-muted-foreground mt-1">Showing first 20 of {warrantyHistory.entries.length} entries</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {warrantyLines.length > 0 && (
            <div className="flex justify-end">
              <Button onClick={() => setActiveTab("generate")} size="sm" className="gap-1">
                Continue to Generate <Zap className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </TabsContent>

        {/* ===== GENERATE TAB ===== */}
        <TabsContent value="generate" className="space-y-4 mt-4">
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="text-sm text-primary">Generate Claim Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>Claim: <strong className="font-mono text-foreground">{claimNumber || "DRAFT"}</strong></p>
                <p className="mt-1">{warrantyLines.length} warranty line(s) × 3 files (COR + AWA + OWS) = <strong>{warrantyLines.length * 3} documents</strong></p>
                {uploadedFiles.length > 0 && <p className="mt-1">+ {uploadedFiles.length} renamed upload(s)</p>}
              </div>

              <Separator />

              {warrantyLines.map((line, idx) => {
                const partsTotal = line.parts.reduce((s, p) => s + p.qty * p.unitPrice, 0);
                const labTotal = line.labourHours * labourRate;
                return (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium">Line {line.itemNumber}: <span className="font-mono text-primary">{line.opCode}</span></p>
                      <p className="text-xs text-muted-foreground">{line.operationDescription} — R {(partsTotal + labTotal).toFixed(2)}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => generateCOR(buildCORData(idx), claimNumber || "DRAFT").then(() => toast({ title: "COR Downloaded" }))}>COR</Button>
                      <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => generateAWA(buildAWAData(idx), claimNumber || "DRAFT").then(() => toast({ title: "AWA Downloaded" }))}>AWA</Button>
                      <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => { generateOWSClaim(buildOWSData(idx), claimNumber || "DRAFT"); toast({ title: "OWS Downloaded" }); }}>OWS</Button>
                    </div>
                  </div>
                );
              })}

              <Separator />

              <Button onClick={handleGenerateAll} disabled={loading} size="lg" className="w-full gap-2">
                <Download className="h-5 w-5" />
                {loading ? "Generating ZIP…" : `Download Complete Claim Pack (ZIP)`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, value, onChange, className = "" }: {
  label: string; value: string; onChange: (v: string) => void; className?: string;
}) {
  return (
    <div>
      <Label className="text-[10px] text-muted-foreground">{label}</Label>
      <Input value={value} onChange={e => onChange(e.target.value)} className={`h-7 text-xs ${className}`} />
    </div>
  );
}
