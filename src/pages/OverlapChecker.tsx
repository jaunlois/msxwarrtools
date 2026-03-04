import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Plus, X } from "lucide-react";
import { checkOverlaps, type OverlapConflict } from "@/data/slt-data";

export default function OverlapChecker() {
  const [opCodes, setOpCodes] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const addOp = () => {
    const code = inputValue.trim().toUpperCase();
    if (code && !opCodes.includes(code)) {
      setOpCodes([...opCodes, code]);
      setInputValue("");
    }
  };

  const removeOp = (code: string) => {
    setOpCodes(opCodes.filter((c) => c !== code));
  };

  const conflicts = useMemo(() => checkOverlaps(opCodes), [opCodes]);
  const hasConflicts = conflicts.length > 0;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Overlap Validation Checker</h1>
        <p className="text-sm text-muted-foreground">
          Enter operation numbers to check for warranty claim conflicts
        </p>
      </div>

      <Card className="ford-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Operations on Repair Order</CardTitle>
          <CardDescription className="text-xs">
            Add operation codes to validate against overlap rules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Enter operation code (e.g. 1007D, 9438A)..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addOp()}
              className="bg-background font-mono"
            />
            <Button onClick={addOp} size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>

          {opCodes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {opCodes.map((code) => {
                const isConflicted = conflicts.some(
                  (c) =>
                    c.claimingOp.replace(/\*$/, '').toUpperCase() === code ||
                    c.conflictsWith.replace(/\*$/, '').toUpperCase() === code
                );
                return (
                  <Badge
                    key={code}
                    variant="outline"
                    className={`font-mono text-xs px-3 py-1 ${
                      isConflicted
                        ? "bg-destructive/10 border-destructive/30 text-destructive"
                        : "bg-success/10 border-success/30 text-success"
                    }`}
                  >
                    {code}
                    <button
                      onClick={() => removeOp(code)}
                      className="ml-2 hover:opacity-70"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {opCodes.length >= 2 && (
        <Card
          className={`ford-card ${
            hasConflicts ? "border-destructive/30" : "border-success/30"
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              {hasConflicts ? (
                <AlertTriangle className="h-5 w-5 text-destructive" />
              ) : (
                <CheckCircle className="h-5 w-5 text-success" />
              )}
              <CardTitle className="text-base">
                {hasConflicts
                  ? `${conflicts.length} Conflict${conflicts.length > 1 ? "s" : ""} Found`
                  : "No Conflicts Detected"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {hasConflicts ? (
              <div className="space-y-2">
                {conflicts.map((conflict, i) => (
                  <div
                    key={i}
                    className="bg-destructive/5 border border-destructive/20 rounded p-3 text-sm"
                  >
                    <p>
                      When claiming{" "}
                      <span className="font-mono font-semibold text-foreground">
                        {conflict.claimingOp}
                      </span>
                      : Do not use with{" "}
                      <span className="font-mono font-semibold text-destructive">
                        {conflict.conflictsWith}
                      </span>
                    </p>
                    {conflict.rule.condition && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        Condition: {conflict.rule.condition}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                All selected operations can be claimed together without conflicts.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {opCodes.length < 2 && (
        <Card className="ford-card">
          <CardContent className="py-8 text-center text-muted-foreground text-sm">
            Add at least 2 operation codes to check for overlaps.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
