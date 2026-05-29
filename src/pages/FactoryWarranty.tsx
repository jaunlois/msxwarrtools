import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Check, X, ShieldCheck } from "lucide-react";
import { factoryWarrantyData } from "@/data/factory-warranty";

export default function FactoryWarranty() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let result = factoryWarrantyData;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.item.toLowerCase().includes(q) ||
          p.comments.toLowerCase().includes(q) ||
          p.limited.toLowerCase().includes(q)
      );
    }
    if (filter === "covered") result = result.filter((p) => p.covered === "yes");
    else if (filter === "limited") result = result.filter((p) => p.limited.trim() !== "");
    else if (filter === "notcovered") result = result.filter((p) => p.covered === "no" && !p.limited.trim());
    return result;
  }, [search, filter]);

  return (
    <div className="space-y-4">
      <PageMeta
        title="Ford Factory Warranty Reference — 4yr / 120 000 km"
        description="Reference for the Ford South Africa factory warranty: 4-year / 120 000 km cover, component schedules, and exclusions."
        path="/factory-warranty"
      />
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          Ford Factory Warranty Coverage
        </h1>
        <p className="text-sm text-muted-foreground">
          New Vehicle Limited Warranty (NVLW) — 4 years / 120,000km. Reference for components covered or with limited coverage.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by item, limit or comment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-56 bg-card">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="covered">Fully Covered</SelectItem>
            <SelectItem value="limited">Limited Coverage</SelectItem>
            <SelectItem value="notcovered">Not Covered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {factoryWarrantyData.length} items
      </p>

      <Card className="ford-card overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-xs">Item</TableHead>
                <TableHead className="text-xs text-center w-24">Covered</TableHead>
                <TableHead className="text-xs w-40">Limited Coverage</TableHead>
                <TableHead className="text-xs">Comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.item}>
                  <TableCell className="text-xs font-medium">{p.item}</TableCell>
                  <TableCell className="text-center">
                    {p.covered === "yes" ? (
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px] gap-1">
                        <Check className="h-3 w-3" /> Yes
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] gap-1">
                        <X className="h-3 w-3" /> No
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">
                    {p.limited ? (
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-[10px]">
                        {p.limited}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.comments || ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="py-8 text-center text-muted-foreground text-sm">
              No items found.
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-[10px] text-muted-foreground italic">
        Source: Ford Dealer Bulletin WAR20200730A. Refer to the full Warranty &amp; Policy Manual for detailed coverages.
      </p>
    </div>
  );
}