import { PageMeta } from "@/components/PageMeta";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sltSections } from "@/data/slt-data";

export default function ScheduledMaintenance() {
  const maintenanceSection = sltSections.find((s) => s.id === "14");
  const mbasicOp = maintenanceSection?.operations[0];

  if (!mbasicOp) {
    return <p className="text-muted-foreground">No maintenance data found.</p>;
  }

  return (
    <div className="space-y-4">
      <PageMeta
        title="Scheduled Maintenance — MBASIC Intervals"
        description="MBASIC service operations and fluid change intervals for Ford drivetrains, including engine oil, brake fluid, and coolant schedules."
        path="/maintenance"
      />
      <div>
        <h1 className="text-2xl font-bold">Scheduled Maintenance</h1>
        <p className="text-sm text-muted-foreground">
          MBASIC service operations and combination maintenance items
        </p>
      </div>

      {/* Base MBASIC */}
      <Card className="ford-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{mbasicOp.description}</CardTitle>
            <Badge className="font-mono text-xs bg-primary/10 text-primary border-primary/20">
              {mbasicOp.opCode}
            </Badge>
          </div>
          {mbasicOp.notes && (
            <p className="text-xs text-muted-foreground">{mbasicOp.notes}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-sm">
            Base time:{" "}
            <span className="font-mono font-semibold">
              {mbasicOp.baseTime?.toFixed(1)} hrs
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Combination Operations */}
      {mbasicOp.combinations && mbasicOp.combinations.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Combination Operations</h2>
          <p className="text-xs text-muted-foreground">
            Additional operations to be used with MBASIC
          </p>

          {mbasicOp.combinations.map((combo, i) => (
            <Card key={i} className="ford-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{combo.description}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="text-xs">Engine</TableHead>
                      <TableHead className="text-xs">Drivetrain</TableHead>
                      <TableHead className="text-xs">Op Code</TableHead>
                      <TableHead className="text-xs text-right">Time (hrs)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {combo.variants.map((v, vi) => (
                      <TableRow key={vi}>
                        <TableCell className="text-xs font-mono">{v.engine}</TableCell>
                        <TableCell className="text-xs">{v.drivetrain || "—"}</TableCell>
                        <TableCell className="text-xs font-mono text-primary">{v.opCode}</TableCell>
                        <TableCell className="text-xs text-right font-mono font-semibold">
                          {v.time.toFixed(1)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
