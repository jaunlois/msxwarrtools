import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Check, Minus } from "lucide-react";
import { partsData, type PlanTier, planTierLabels, getHighestPlan } from "@/data/parts-data";

export default function PartsCoverage() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 100;

  const filtered = useMemo(() => {
    let result = partsData;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.partNumber.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (planFilter !== "all") {
      result = result.filter((p) => p[planFilter as PlanTier]);
    }

    return result;
  }, [search, planFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Reset page when filters change
  const handleSearch = (val: string) => { setSearch(val); setPage(0); };
  const handlePlanFilter = (val: string) => { setPlanFilter(val); setPage(0); };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Ford Protect Parts Coverage</h1>
        <p className="text-sm text-muted-foreground">
          Search by part number or description — view coverage across all plan tiers
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by part number or description..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>
        <Select value={planFilter} onValueChange={handlePlanFilter}>
          <SelectTrigger className="w-full sm:w-56 bg-card">
            <SelectValue placeholder="Filter by plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            {(Object.keys(planTierLabels) as PlanTier[]).map((tier) => (
              <SelectItem key={tier} value={tier}>
                {planTierLabels[tier]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} parts (from {partsData.length} total)
      </p>

      <Card className="ford-card overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-xs">Part #</TableHead>
                <TableHead className="text-xs">Description</TableHead>
                <TableHead className="text-xs text-center">WearCare</TableHead>
                <TableHead className="text-xs text-center">Powertrain</TableHead>
                <TableHead className="text-xs text-center">Extra Care</TableHead>
                <TableHead className="text-xs text-center">Premium</TableHead>
                <TableHead className="text-xs">Min. Plan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((part) => (
                <TableRow key={part.partNumber}>
                  <TableCell className="font-mono text-xs text-primary">
                    {part.partNumber}
                  </TableCell>
                  <TableCell className="text-xs">{part.description}</TableCell>
                  <TableCell className="text-center">
                    <CoverageIcon covered={part.wearCare} />
                  </TableCell>
                  <TableCell className="text-center">
                    <CoverageIcon covered={part.powertrainCare} />
                  </TableCell>
                  <TableCell className="text-center">
                    <CoverageIcon covered={part.extraCare} />
                  </TableCell>
                  <TableCell className="text-center">
                    <CoverageIcon covered={part.premiumMaintenance} />
                  </TableCell>
                  <TableCell>
                    <PlanBadge plan={getHighestPlan(part)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="py-8 text-center text-muted-foreground text-sm">
              No parts found matching your search.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CoverageIcon({ covered }: { covered: boolean }) {
  return covered ? (
    <Check className="h-4 w-4 text-success mx-auto" />
  ) : (
    <Minus className="h-4 w-4 text-muted-foreground/40 mx-auto" />
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const colors: Record<string, string> = {
    WearCare: "bg-success/10 text-success border-success/20",
    "Powertrain Care": "bg-primary/10 text-primary border-primary/20",
    "Extra Care": "bg-warning/10 text-warning border-warning/20",
    "Premium Maintenance": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "Not Covered": "bg-muted text-muted-foreground border-border",
  };
  return (
    <Badge variant="outline" className={`text-[10px] ${colors[plan] || ""}`}>
      {plan}
    </Badge>
  );
}
