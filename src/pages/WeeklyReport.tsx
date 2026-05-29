import { PageMeta } from "@/components/PageMeta";
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Upload, FileText, FileSpreadsheet, X, Download, ArrowLeft, BarChart3, ClipboardPaste, Image as ImageIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { parseAgeAnalysisExcel, parseWIPExcel } from '@/lib/report/parseExcel';
import { parseSBIPdf } from '@/lib/report/parsePDF';
import { parseDmsText } from '@/lib/report/parseDmsText';
import { matchClaimsWithSBI } from '@/lib/report/matchClaims';
import { generateWeeklyReport, generateSBPayments } from '@/lib/report/generateExcel';
import { AgeAnalysisClaim, WIPEntry, SBIInvoice } from '@/lib/report/types';

type Step = 'upload' | 'review';

export default function WeeklyReport() {
  const [step, setStep] = useState<Step>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [claims, setClaims] = useState<AgeAnalysisClaim[]>([]);
  const [wipEntries, setWipEntries] = useState<WIPEntry[]>([]);
  const [sbiInvoices, setSbiInvoices] = useState<SBIInvoice[]>([]);
  const [generatedOn, setGeneratedOn] = useState('');
  const [generatedBy, setGeneratedBy] = useState('');

  // File states
  const [ageFiles, setAgeFiles] = useState<File[]>([]);
  const [sbiFiles, setSbiFiles] = useState<File[]>([]);
  const [wipFiles, setWipFiles] = useState<File[]>([]);
  const [dmsFiles, setDmsFiles] = useState<File[]>([]);
  const [dmsRawLines, setDmsRawLines] = useState<string[][]>([]);

  type ZoneType = 'age' | 'sbi' | 'wip' | 'dms';

  const handleDrop = useCallback((e: React.DragEvent, type: ZoneType) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (type === 'sbi') {
      setSbiFiles(prev => [...prev, ...files.filter(f => f.name.endsWith('.pdf'))]);
    } else if (type === 'dms') {
      setDmsFiles(prev => [...prev, ...files.filter(f =>
        f.name.endsWith('.txt') || f.name.endsWith('.csv') ||
        f.type.startsWith('image/') || f.name.match(/\.(png|jpe?g|webp)$/i)
      )]);
    } else {
      const excels = files.filter(f => f.name.endsWith('.xlsx') || f.name.endsWith('.xls'));
      if (type === 'age') setAgeFiles(prev => [...prev, ...excels]);
      else setWipFiles(prev => [...prev, ...excels]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: ZoneType) => {
    const files = Array.from(e.target.files || []);
    if (type === 'age') setAgeFiles(prev => [...prev, ...files]);
    else if (type === 'wip') setWipFiles(prev => [...prev, ...files]);
    else if (type === 'sbi') setSbiFiles(prev => [...prev, ...files]);
    else setDmsFiles(prev => [...prev, ...files]);
    e.target.value = '';
  }, []);

  const handlePasteText = useCallback((type: ZoneType, text: string) => {
    if (!text.trim()) return;
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const file = new File([text], `pasted-${type}-${ts}.txt`, { type: 'text/plain' });
    if (type === 'age') setAgeFiles(prev => [...prev, file]);
    else if (type === 'wip') setWipFiles(prev => [...prev, file]);
    else if (type === 'sbi') setSbiFiles(prev => [...prev, file]);
    else setDmsFiles(prev => [...prev, file]);
    toast.success(`Pasted ${text.length} chars added as ${file.name}`);
  }, []);

  const removeFile = (type: ZoneType, index: number) => {
    if (type === 'age') setAgeFiles(prev => prev.filter((_, i) => i !== index));
    else if (type === 'wip') setWipFiles(prev => prev.filter((_, i) => i !== index));
    else if (type === 'sbi') setSbiFiles(prev => prev.filter((_, i) => i !== index));
    else setDmsFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = useCallback(async () => {
    setIsProcessing(true);
    try {
      let allClaims: AgeAnalysisClaim[] = [];
      let genOn = '', genBy = '';
      for (const file of ageFiles) {
        if (file.name.endsWith('.txt')) {
          // Treat pasted text as raw DMS-style age data — feed into DMS sheet too
          const text = await file.text();
          const parsed = parseDmsText(text);
          setDmsRawLines(prev => [...prev, ...parsed]);
        } else {
          const buffer = await file.arrayBuffer();
          const result = parseAgeAnalysisExcel(buffer);
          allClaims = [...allClaims, ...result.claims];
          if (result.generatedOn) genOn = result.generatedOn;
          if (result.generatedBy) genBy = result.generatedBy;
        }
      }
      const seen = new Set<string>();
      allClaims = allClaims.filter(c => {
        const key = c.claimNo + '|' + c.roNumber;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      setGeneratedOn(genOn);
      setGeneratedBy(genBy);

      const invoices: SBIInvoice[] = [];
      for (const file of sbiFiles) {
        const buffer = await file.arrayBuffer();
        invoices.push(await parseSBIPdf(buffer, file.name));
      }
      setSbiInvoices(invoices);

      let allWip: WIPEntry[] = [];
      for (const file of wipFiles) {
        if (file.name.endsWith('.txt')) continue; // skip text for WIP (excel-only parser)
        const buffer = await file.arrayBuffer();
        allWip = [...allWip, ...parseWIPExcel(buffer)];
      }
      setWipEntries(allWip);

      // Process DMS files
      let dmsRows: string[][] = [];
      for (const file of dmsFiles) {
        if (file.name.endsWith('.txt') || file.name.endsWith('.csv')) {
          const text = await file.text();
          dmsRows = [...dmsRows, ...parseDmsText(text)];
        } else {
          dmsRows.push([`[Image attached: ${file.name}] — paste as snip into DMS Screenshot sheet`]);
        }
      }
      setDmsRawLines(prev => [...prev, ...dmsRows]);

      const matched = matchClaimsWithSBI(allClaims, invoices);
      setClaims(matched);
      const matchedCount = matched.filter(c => c.matched).length;
      toast.success(`Processed ${matched.length} claims, ${matchedCount} auto-matched with SBI`);
      setStep('review');
    } catch (err) {
      console.error(err);
      toast.error('Error processing files. Check formats.');
    } finally {
      setIsProcessing(false);
    }
  }, [ageFiles, sbiFiles, wipFiles, dmsFiles]);

  const handleClaimChange = useCallback((index: number, field: 'totalPD' | 'comment', value: string | number | null) => {
    setClaims(prev => prev.map((c, i) => {
      if (i !== index) return c;
      if (field === 'totalPD') {
        const pd = value as number | null;
        return { ...c, totalPD: pd, diff: pd !== null ? pd - c.total : null };
      }
      return { ...c, comment: value as string };
    }));
  }, []);

  const handleWipCommentChange = useCallback((index: number, value: string) => {
    setWipEntries(prev => prev.map((e, i) => i === index ? { ...e, comment: value } : e));
  }, []);

  const handleDownload = useCallback(() => {
    try {
      const buf = generateWeeklyReport({ ageAnalysisClaims: claims, wipEntries, sbiInvoices, generatedOn, generatedBy, dmsRawLines });
      const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `Weekly_Reporting_${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(a.href);
      toast.success('Report downloaded!');
    } catch (err) { console.error(err); toast.error('Error generating report'); }
  }, [claims, wipEntries, sbiInvoices, generatedOn, generatedBy, dmsRawLines]);

  const handleDownloadSB = useCallback(() => {
    try {
      const buf = generateSBPayments(sbiInvoices, claims);
      const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `SB_Payments_${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(a.href);
      toast.success('SB Payments downloaded!');
    } catch (err) { console.error(err); toast.error('Error generating SB Payments'); }
  }, [sbiInvoices, claims]);

  const fmt = (n: number) => n === 0 ? '0' : n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (step === 'review') {
    const matchedCount = claims.filter(c => c.matched).length;
    const unmatchedCount = claims.filter(c => !c.matched).length;
    const grandTotal = claims.reduce((s, c) => s + c.total, 0);
    const grandPD = claims.reduce((s, c) => s + (c.totalPD || 0), 0);
    const grandDiff = claims.reduce((s, c) => s + (c.diff || 0), 0);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-bold">Review & Edit</h1>
            <p className="text-sm text-muted-foreground">
              <span className="text-[hsl(var(--success))] font-medium">{matchedCount} matched</span>
              {' · '}
              <span className="text-[hsl(var(--warning))] font-medium">{unmatchedCount} unmatched</span>
              {' · '}{claims.length} total claims
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep('upload')}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button variant="outline" onClick={handleDownloadSB}>
              <FileSpreadsheet className="h-4 w-4 mr-1" /> SB Payments
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" /> Download Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="age">
          <TabsList>
            <TabsTrigger value="age">Age Analysis ({claims.length})</TabsTrigger>
            <TabsTrigger value="wip">Warranty WIP ({wipEntries.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="age">
            <Card className="ford-card overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-primary text-primary-foreground">
                        <th className="px-2 py-2 text-left font-medium">Claim No</th>
                        <th className="px-2 py-2 text-left font-medium">RO Number</th>
                        <th className="px-2 py-2 text-left font-medium">VIN</th>
                        <th className="px-2 py-2 text-left font-medium">Job</th>
                        <th className="px-2 py-2 text-right font-medium">0-30</th>
                        <th className="px-2 py-2 text-right font-medium">31-60</th>
                        <th className="px-2 py-2 text-right font-medium">61-90</th>
                        <th className="px-2 py-2 text-right font-medium">150+</th>
                        <th className="px-2 py-2 text-right font-medium">Total</th>
                        <th className="px-2 py-2 text-right font-medium">Total PD</th>
                        <th className="px-2 py-2 text-right font-medium">Diff</th>
                        <th className="px-2 py-2 text-left font-medium min-w-[200px]">Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {claims.map((claim, idx) => (
                        <tr key={idx} className={`border-b border-border ${claim.matched ? 'bg-[hsl(var(--success))]/10' : 'bg-[hsl(var(--warning))]/10'}`}>
                          <td className="px-2 py-1.5">{claim.claimNo}</td>
                          <td className="px-2 py-1.5">{claim.roNumber}</td>
                          <td className="px-2 py-1.5 font-mono text-[10px]">{claim.vinNumber}</td>
                          <td className="px-2 py-1.5">{claim.jobType}</td>
                          <td className="px-2 py-1.5 text-right">{fmt(claim.days0to30)}</td>
                          <td className="px-2 py-1.5 text-right">{fmt(claim.days31to60)}</td>
                          <td className="px-2 py-1.5 text-right">{fmt(claim.days61to90)}</td>
                          <td className="px-2 py-1.5 text-right">{fmt(claim.days150plus)}</td>
                          <td className="px-2 py-1.5 text-right font-medium">{fmt(claim.total)}</td>
                          <td className="px-2 py-1.5 text-right">
                            <input type="number" step="0.01"
                              className="w-20 text-right bg-card border border-input rounded px-1 py-0.5 text-xs"
                              value={claim.totalPD ?? ''}
                              onChange={e => handleClaimChange(idx, 'totalPD', e.target.value === '' ? null : parseFloat(e.target.value))}
                            />
                          </td>
                          <td className="px-2 py-1.5 text-right font-medium">{claim.diff !== null ? fmt(claim.diff) : ''}</td>
                          <td className="px-2 py-1.5">
                            <input type="text"
                              className="w-full bg-card border border-input rounded px-1.5 py-0.5 text-xs"
                              value={claim.comment}
                              onChange={e => handleClaimChange(idx, 'comment', e.target.value)}
                              placeholder="Add comment..."
                            />
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-muted font-bold text-sm">
                        <td className="px-2 py-2" colSpan={8}>Grand Total</td>
                        <td className="px-2 py-2 text-right">{fmt(grandTotal)}</td>
                        <td className="px-2 py-2 text-right">{fmt(grandPD)}</td>
                        <td className="px-2 py-2 text-right">{fmt(grandDiff)}</td>
                        <td className="px-2 py-2"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wip">
            <Card className="ford-card overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-primary text-primary-foreground">
                        <th className="px-2 py-2 text-left font-medium">RO Number</th>
                        <th className="px-2 py-2 text-left font-medium">Service Advisor</th>
                        <th className="px-2 py-2 text-left font-medium">Date</th>
                        <th className="px-2 py-2 text-left font-medium">Customer</th>
                        <th className="px-2 py-2 text-left font-medium">VIN</th>
                        <th className="px-2 py-2 text-right font-medium">Days</th>
                        <th className="px-2 py-2 text-left font-medium min-w-[250px]">Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wipEntries.map((entry, idx) => (
                        <tr key={idx} className="border-b border-border">
                          <td className="px-2 py-1.5">{entry.roNumber}</td>
                          <td className="px-2 py-1.5">{entry.serviceAdvisor}</td>
                          <td className="px-2 py-1.5">{entry.dateCreated}</td>
                          <td className="px-2 py-1.5">{entry.customerName}</td>
                          <td className="px-2 py-1.5 font-mono text-[10px]">{entry.vinNumber}</td>
                          <td className="px-2 py-1.5 text-right">{entry.daysOutstanding}</td>
                          <td className="px-2 py-1.5">
                            <input type="text"
                              className="w-full bg-card border border-input rounded px-1.5 py-0.5 text-xs"
                              value={entry.comment}
                              onChange={e => handleWipCommentChange(idx, e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Upload step
  return (
    <div className="space-y-4">
      <PageMeta
        title="Weekly Warranty Report — Reconcile DMS vs SBI"
        description="Upload Age Analysis, SBI invoices and WIP files to reconcile DMS data with SBI and produce the weekly warranty report."
        path="/report"
      />
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Weekly Warranty Report
        </h1>
        <p className="text-sm text-muted-foreground">
          Upload Age Analysis, SBI PDFs, and WIP files to generate your weekly report
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DropZone
          title="Age Analysis Excel(s)"
          description="Excel export — or paste raw text"
          accept=".xlsx,.xls,.txt"
          type="age"
          icon={<FileSpreadsheet className="h-5 w-5 text-primary" />}
          files={ageFiles}
          onDrop={handleDrop}
          onSelect={handleFileSelect}
          onRemove={removeFile}
          onPasteText={handlePasteText}
        />
        <DropZone
          title="Self-Billing Invoice PDFs"
          description="ZA-91106-SB*.pdf — or paste text"
          accept=".pdf,.txt"
          type="sbi"
          icon={<FileText className="h-5 w-5 text-primary" />}
          files={sbiFiles}
          onDrop={handleDrop}
          onSelect={handleFileSelect}
          onRemove={removeFile}
          onPasteText={handlePasteText}
        />
        <DropZone
          title="Service WIP Ageing Report"
          description="WIP Excel export"
          accept=".xlsx,.xls,.txt"
          type="wip"
          icon={<FileSpreadsheet className="h-5 w-5 text-primary" />}
          files={wipFiles}
          onDrop={handleDrop}
          onSelect={handleFileSelect}
          onRemove={removeFile}
          onPasteText={handlePasteText}
        />
        <DropZone
          title="DMS Screenshot / Raw Dump"
          description="TXT, CSV or image — or paste DMS text"
          accept=".txt,.csv,.png,.jpg,.jpeg,.webp"
          type="dms"
          icon={<ImageIcon className="h-5 w-5 text-primary" />}
          files={dmsFiles}
          onDrop={handleDrop}
          onSelect={handleFileSelect}
          onRemove={removeFile}
          onPasteText={handlePasteText}
        />
      </div>

      <div className="flex justify-center">
        <Button size="lg" disabled={(ageFiles.length === 0 && sbiFiles.length === 0 && wipFiles.length === 0 && dmsFiles.length === 0) || isProcessing} onClick={handleProcess} className="px-8">
          {isProcessing ? 'Processing…' : 'Process Files'}
        </Button>
      </div>
      <p className="text-xs text-center text-muted-foreground">
        All processing happens in your browser — no data leaves your machine.
      </p>
    </div>
  );
}

function DropZone({
  title, description, accept, type, icon, files, onDrop, onSelect, onRemove, onPasteText,
}: {
  title: string;
  description: string;
  accept: string;
  type: 'age' | 'sbi' | 'wip' | 'dms';
  icon: React.ReactNode;
  files: File[];
  onDrop: (e: React.DragEvent, type: 'age' | 'sbi' | 'wip' | 'dms') => void;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>, type: 'age' | 'sbi' | 'wip' | 'dms') => void;
  onRemove: (type: 'age' | 'sbi' | 'wip' | 'dms', index: number) => void;
  onPasteText: (type: 'age' | 'sbi' | 'wip' | 'dms', text: string) => void;
}) {
  const inputId = `file-${type}`;
  const [showPaste, setShowPaste] = useState(false);
  const [pasteValue, setPasteValue] = useState('');
  return (
    <Card className="ford-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">{icon}{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-primary hover:bg-muted/30"
          onDragOver={e => e.preventDefault()}
          onDrop={e => onDrop(e, type)}
          onClick={() => document.getElementById(inputId)?.click()}
        >
          <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Drop files here or click to browse</p>
          <input id={inputId} type="file" accept={accept} multiple className="hidden" onChange={e => onSelect(e, type)} />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPaste(s => !s)}
          className="w-full mt-2 text-xs gap-1.5 h-7"
        >
          <ClipboardPaste className="h-3 w-3" />
          {showPaste ? 'Hide paste box' : 'Or paste raw text'}
        </Button>
        {showPaste && (
          <div className="mt-2 space-y-1.5">
            <Textarea
              value={pasteValue}
              onChange={e => setPasteValue(e.target.value)}
              onPaste={e => {
                const t = e.clipboardData.getData('text');
                if (t) {
                  e.preventDefault();
                  onPasteText(type, t);
                  setPasteValue('');
                  setShowPaste(false);
                }
              }}
              rows={4}
              placeholder="Paste copied text from DMS / OWS / system here..."
              className="text-[10px] font-mono"
            />
            <Button
              size="sm"
              variant="outline"
              disabled={!pasteValue.trim()}
              onClick={() => { onPasteText(type, pasteValue); setPasteValue(''); setShowPaste(false); }}
              className="text-xs h-7 w-full"
            >
              Save pasted text
            </Button>
          </div>
        )}
        {files.length > 0 && (
          <div className="mt-2 space-y-1">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between bg-muted rounded px-2 py-1.5 text-xs">
                <span className="truncate">{f.name}</span>
                <button onClick={() => onRemove(type, i)} className="text-muted-foreground hover:text-destructive ml-2">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
