import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, ShieldAlert, Info } from "lucide-react";
import type { OwsValidationResult } from "@/lib/claim-processor/owsValidation";

const sevStyles: Record<string, string> = {
  error: "border-rose-500/50 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  warning: "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  info: "border-sky-500/50 bg-sky-500/10 text-sky-700 dark:text-sky-300",
};

export function OwsValidationCard({ result }: { result: OwsValidationResult }) {
  if (result.findings.length === 0) {
    return (
      <Card className="border-emerald-500/40 bg-emerald-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> OWS Pre-Validation Passed
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          No issues detected against the OWS Claiming Guide v10.5 rule set.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={result.passes ? "border-amber-500/40" : "border-rose-500/50"}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-rose-500" />
          OWS Pre-Validation
          <Badge variant="outline" className="text-[10px] border-rose-500/50">
            {result.errorCount} errors
          </Badge>
          <Badge variant="outline" className="text-[10px] border-amber-500/50">
            {result.warningCount} warnings
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {result.findings.map((f, i) => {
          const Icon = f.severity === "error" ? AlertTriangle : f.severity === "warning" ? ShieldAlert : Info;
          return (
            <div key={i} className={`flex items-start gap-2 rounded-md border px-2 py-1.5 text-[11px] ${sevStyles[f.severity]}`}>
              <Icon className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] opacity-80">{f.code}</span>
                  {f.lineNumber !== undefined && (
                    <Badge variant="outline" className="text-[9px] h-4 px-1">Line {f.lineNumber}</Badge>
                  )}
                </div>
                <p className="leading-tight mt-0.5">
                  {f.message}
                  {f.detail && <span className="opacity-70"> — {f.detail}</span>}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}