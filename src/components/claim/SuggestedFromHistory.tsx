import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Brain } from "lucide-react";
import { suggestFromLibrary, type SuggestionInput, type SuggestionResult } from "@/lib/claim-library/suggest";

interface Props {
  input: SuggestionInput;
  onAddLaborOp: (op: { opCode: string; description: string; hours: number }) => void;
  onAddPart: (part: { code: string; description: string; qty: number }) => void;
}

export function SuggestedFromHistory({ input, onAddLaborOp, onAddPart }: Props) {
  const [result, setResult] = useState<SuggestionResult>({ laborOps: [], parts: [], matches: [] });

  useEffect(() => {
    const refresh = () => setResult(suggestFromLibrary(input));
    refresh();
    window.addEventListener("claim-library-updated", refresh);
    return () => window.removeEventListener("claim-library-updated", refresh);
  }, [input.ccc, input.causalPart, input.customerConcern, input.model]);

  if (result.matches.length === 0) return null;

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          Suggested from past claims
          <Badge variant="secondary" className="ml-1">{result.matches.length} similar</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {result.laborOps.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Labor Ops</p>
            <div className="flex flex-wrap gap-1.5">
              {result.laborOps.slice(0, 10).map((op) => (
                <Button
                  key={op.opCode}
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1.5 text-xs font-mono"
                  onClick={() => onAddLaborOp(op)}
                >
                  <Plus className="h-3 w-3" />
                  {op.opCode}
                  <span className="text-muted-foreground font-sans">({op.count})</span>
                </Button>
              ))}
            </div>
          </div>
        )}
        {result.parts.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Parts</p>
            <div className="flex flex-wrap gap-1.5">
              {result.parts.slice(0, 12).map((p) => (
                <Button
                  key={p.code}
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1.5 text-xs font-mono"
                  onClick={() => onAddPart(p)}
                >
                  <Plus className="h-3 w-3" />
                  {p.code}
                  <span className="text-muted-foreground font-sans">({p.count})</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}