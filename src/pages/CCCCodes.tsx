import { useState, useMemo } from "react";
import { Search, Copy, Check, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cccCodes, conditionCodes, cccCategories } from "@/data/ccc-data";
import { useToast } from "@/hooks/use-toast";

const CCCCodes = () => {
  const [search, setSearch] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    return cccCodes.filter((c) => {
      const matchesSearch =
        !search ||
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchesCondition = !selectedCondition || c.conditionCode === selectedCondition;
      const matchesCategory = !selectedCategory || c.category === selectedCategory;
      return matchesSearch && matchesCondition && matchesCategory;
    });
  }, [search, selectedCondition, selectedCategory]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({ title: "Copied!", description: `${code} copied to clipboard` });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Customer Concern Codes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Search CCC codes for warranty claim forms — click any code to copy
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search code or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Condition Code Filter */}
      <Card className="ford-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs flex items-center gap-1">
            <Filter className="h-3 w-3" /> Condition Codes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant={selectedCondition === null ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => setSelectedCondition(null)}
            >
              All
            </Badge>
            {conditionCodes.map((cc) => (
              <Badge
                key={cc.code}
                variant={selectedCondition === cc.code ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => setSelectedCondition(selectedCondition === cc.code ? null : cc.code)}
                title={cc.description}
              >
                {cc.code} - {cc.description}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-1.5">
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className="cursor-pointer text-xs"
          onClick={() => setSelectedCategory(null)}
        >
          All Categories
        </Badge>
        {cccCategories.map((cat) => (
          <Badge
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            className="cursor-pointer text-xs"
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {/* Results */}
      <div className="text-xs text-muted-foreground">
        {filtered.length} codes found
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-2 font-medium text-muted-foreground w-24">Code</th>
              <th className="text-left px-4 py-2 font-medium text-muted-foreground">Description</th>
              <th className="text-left px-4 py-2 font-medium text-muted-foreground w-16">Cond.</th>
              <th className="text-left px-4 py-2 font-medium text-muted-foreground w-28">Category</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.code}
                className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => handleCopy(c.code)}
              >
                <td className="px-4 py-2 font-mono font-bold text-primary">{c.code}</td>
                <td className="px-4 py-2 text-foreground">{c.description}</td>
                <td className="px-4 py-2">
                  <Badge variant="outline" className="text-xs">
                    {c.conditionCode}
                  </Badge>
                </td>
                <td className="px-4 py-2 text-xs text-muted-foreground">{c.category}</td>
                <td className="px-4 py-2">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    {copiedCode === c.code ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CCCCodes;
