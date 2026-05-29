import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { type SLTOperation, type SLTSection } from "@/data/slt-data";
import { getMergedSltSections } from "@/lib/slt/mergedSltData";
import { PageMeta } from "@/components/PageMeta";

export default function SLTLookup() {
  const [search, setSearch] = useState("");
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [sltSections, setSltSections] = useState<SLTSection[]>(() => getMergedSltSections());

  useEffect(() => {
    const refresh = () => setSltSections(getMergedSltSections());
    window.addEventListener("slt-custom-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("slt-custom-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const filteredSections = useMemo(() => {
    let sections = selectedSection === "all"
      ? sltSections
      : sltSections.filter((s) => s.id === selectedSection);

    if (search.trim()) {
      const q = search.toLowerCase();
      sections = sections
        .map((section) => ({
          ...section,
          operations: section.operations.filter(
            (op) =>
              op.description.toLowerCase().includes(q) ||
              op.opCode.toLowerCase().includes(q) ||
              op.variants.some((v) => v.opCode.toLowerCase().includes(q))
          ),
        }))
        .filter((s) => s.operations.length > 0);
    }

    return sections;
  }, [search, selectedSection, sltSections]);

  const totalOps = filteredSections.reduce((a, s) => a + s.operations.length, 0);

  return (
    <div className="space-y-4">
      <PageMeta
        title="SLT Lookup — Standard Labour Times"
        description="Search Ford standard labour times by section, operation code, or part number for the 2022 U704A Everest and other models."
        path="/slt"
      />
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Standard Labour Time Lookup</h1>
          <p className="text-sm text-muted-foreground">
            2022 U704A Everest — Browse by section or search operations
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="gap-1.5 shrink-0">
          <Link to="/slt/import">
            <Upload className="h-3.5 w-3.5" />
            Bulk Import
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by operation, description, or part number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>
        <Select value={selectedSection} onValueChange={setSelectedSection}>
          <SelectTrigger className="w-full sm:w-72 bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            {sltSections.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.id} - {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {totalOps} operations across {filteredSections.length} sections
      </p>

      {filteredSections.map((section) => (
        <SectionBlock key={section.id} section={section} />
      ))}

      {filteredSections.length === 0 && (
        <Card className="ford-card">
          <CardContent className="py-8 text-center text-muted-foreground">
            No operations found matching your search.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SectionBlock({ section }: { section: SLTSection }) {
  return (
    <Card className="ford-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">
            {section.id}
          </Badge>
          {section.name}
          <span className="text-muted-foreground text-xs font-normal ml-auto">
            ({section.range})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 p-0">
        {section.operations.map((op) => (
          <OperationRow key={op.opCode} operation={op} />
        ))}
      </CardContent>
    </Card>
  );
}

function OperationRow({ operation }: { operation: SLTOperation }) {
  const [open, setOpen] = useState(false);
  const hasCombinations = operation.combinations && operation.combinations.length > 0;
  const hasSupplements = operation.supplements && operation.supplements.length > 0;
  const hasOverlaps = operation.overlaps && operation.overlaps.length > 0;
  const hasExtra = hasCombinations || hasSupplements || hasOverlaps;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="border-t border-border first:border-t-0">
        <CollapsibleTrigger className="w-full text-left px-4 py-3 hover:bg-muted/30 transition-colors flex items-start gap-3">
          <ChevronDown
            className={`h-4 w-4 mt-0.5 text-muted-foreground shrink-0 transition-transform ${
              open ? "rotate-0" : "-rotate-90"
            }`}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium leading-tight">
                {operation.description}
              </p>
              <Badge className="shrink-0 font-mono text-[10px] bg-primary/10 text-primary border-primary/20">
                {operation.opCode}
              </Badge>
            </div>
            {operation.notes && (
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {operation.notes}
              </p>
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-3">
            {/* Variants Table */}
            <div className="rounded border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs">Engine</TableHead>
                    <TableHead className="text-xs">Drivetrain</TableHead>
                    <TableHead className="text-xs">Qualifier</TableHead>
                    <TableHead className="text-xs">Op Code</TableHead>
                    <TableHead className="text-xs text-right">Time (hrs)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operation.variants.map((v, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-xs font-mono">{v.engine}</TableCell>
                      <TableCell className="text-xs">{v.drivetrain || "—"}</TableCell>
                      <TableCell className="text-xs">{v.qualifier || "—"}</TableCell>
                      <TableCell className="text-xs font-mono text-primary">{v.opCode}</TableCell>
                      <TableCell className="text-xs text-right font-mono font-semibold">
                        {v.time.toFixed(1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Overlaps */}
            {hasOverlaps && (
              <div className="bg-destructive/5 border border-destructive/20 rounded p-3">
                <p className="text-xs font-semibold text-destructive mb-1">
                  Overlap Rules
                </p>
                {operation.overlaps!.map((rule, i) => (
                  <p key={i} className="text-xs text-muted-foreground">
                    When claiming <span className="font-mono text-foreground">{rule.claiming}</span>:
                    Do not use with{" "}
                    <span className="font-mono text-destructive">
                      {rule.doNotUseWith.join(", ")}
                    </span>
                    {rule.condition && (
                      <span className="italic"> ({rule.condition})</span>
                    )}
                  </p>
                ))}
              </div>
            )}

            {/* Supplements */}
            {hasSupplements && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">Supplements</p>
                {operation.supplements!.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-muted/30 rounded px-3 py-1.5">
                    <span>{s.description}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-primary">{s.opCode}</span>
                      <span className="font-mono font-semibold">{s.time.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Combinations */}
            {hasCombinations && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">
                  Combination Operations
                </p>
                {operation.combinations!.map((combo, i) => (
                  <div key={i} className="bg-muted/20 rounded border border-border p-2 mb-1">
                    <p className="text-xs font-medium mb-1">{combo.description}</p>
                    <div className="space-y-0.5">
                      {combo.variants.map((v, vi) => (
                        <div key={vi} className="flex items-center justify-between text-xs px-2">
                          <span className="text-muted-foreground">
                            {v.engine} {v.qualifier && `· ${v.qualifier}`}
                          </span>
                          <div className="flex gap-3">
                            <span className="font-mono text-primary">{v.opCode}</span>
                            <span className="font-mono font-semibold">{v.time.toFixed(1)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
