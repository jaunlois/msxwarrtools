import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldX, Calendar, Gauge } from "lucide-react";
import { checkWarrantyValidity } from "@/lib/claim-processor/matchSLT";
import type { ClaimVehicleInfo } from "@/lib/claim-processor/types";

interface ClaimSummaryBarProps {
  bsiNumber: string;
  claimNumber: string;
  roNumber: string;
  vehicle: ClaimVehicleInfo;
  lineCount: number;
}

export function ClaimSummaryBar({ bsiNumber, claimNumber, roNumber, vehicle, lineCount }: ClaimSummaryBarProps) {
  const warrantyCheck = vehicle.warrantyStartDate
    ? checkWarrantyValidity(vehicle.warrantyStartDate, vehicle.kilometers)
    : null;

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="pt-4 pb-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <InfoChip label="BSI #" value={bsiNumber} mono />
          <InfoChip label="Claim" value={claimNumber} mono />
          <InfoChip label="RO" value={roNumber} mono />
          <InfoChip label="VIN" value={vehicle.vin} mono small />
          <InfoChip label="Reg" value={vehicle.regNo} />
          <InfoChip label="Customer" value={vehicle.customerName} />
          <InfoChip label="Model" value={vehicle.vehicleModel} />
          {vehicle.kilometers && (
            <div className="flex items-center gap-1 text-xs">
              <Gauge className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono">{parseInt(vehicle.kilometers).toLocaleString()} km</span>
            </div>
          )}
          {lineCount > 0 && (
            <Badge variant="secondary" className="text-[10px]">{lineCount} line(s)</Badge>
          )}
        </div>

        {/* Warranty Status Banner */}
        {warrantyCheck && (
          <div className={`mt-3 flex items-center gap-2 rounded-md p-2.5 text-xs ${
            warrantyCheck.inWarranty
              ? "bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400"
              : "bg-destructive/10 border border-destructive/30 text-destructive"
          }`}>
            {warrantyCheck.inWarranty
              ? <ShieldCheck className="h-4 w-4 shrink-0" />
              : <ShieldX className="h-4 w-4 shrink-0" />
            }
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span className="font-medium">Warranty Start: {vehicle.warrantyStartDate}</span>
              </span>
              <span>{warrantyCheck.reason}</span>
              {warrantyCheck.daysRemaining !== undefined && warrantyCheck.daysRemaining > 0 && (
                <span className="font-mono">{warrantyCheck.daysRemaining} days left</span>
              )}
              {warrantyCheck.kmRemaining !== undefined && warrantyCheck.kmRemaining > 0 && (
                <span className="font-mono">{warrantyCheck.kmRemaining.toLocaleString()} km left</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function InfoChip({ label, value, mono, small }: { label: string; value: string; mono?: boolean; small?: boolean }) {
  if (!value) return null;
  return (
    <div>
      <span className="text-muted-foreground text-[10px]">{label}</span>
      <p className={`font-medium leading-tight ${mono ? "font-mono" : ""} ${small ? "text-[11px]" : "text-xs"}`}>
        {value}
      </p>
    </div>
  );
}
