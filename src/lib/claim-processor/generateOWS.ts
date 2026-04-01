import { saveAs } from "file-saver";
import type { WarrantyRepairLine, ClaimVehicleInfo } from "./types";

export interface OWSClaimData {
  roNumber: string;
  roDate: string;
  vin: string;
  regNo: string;
  vehicleModel: string;
  kilometers: string;
  customerName: string;
  warrantyStartDate: string;
  dealerCode: string;
  dealerName: string;
  repairLine: WarrantyRepairLine;
  complaint: string;
  cause: string;
  correction: string;
  lineNumber: number;
}

export function generateOWSClaim(data: OWSClaimData, claimNumber: string): string {
  const line = data.repairLine;
  const partsTotal = line.parts.reduce((s, p) => s + p.qty * p.unitPrice, 0);
  const labourTotal = line.labourAmount;
  const total = partsTotal + labourTotal;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${claimNumber} - OWS Claim</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 10px; margin: 20px; color: #000; }
    h1 { font-size: 14px; color: #003478; border-bottom: 2px solid #003478; padding-bottom: 4px; }
    h2 { font-size: 11px; color: #003478; margin-top: 16px; }
    table { border-collapse: collapse; width: 100%; margin: 8px 0; }
    th, td { border: 1px solid #ccc; padding: 4px 6px; text-align: left; font-size: 9px; }
    th { background: #003478; color: white; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 20px; }
    .info-grid .label { font-weight: bold; color: #333; }
    .right { text-align: right; }
    .total-row { font-weight: bold; background: #f0f4f8; }
    .comments { background: #f9fafb; border: 1px solid #e5e7eb; padding: 8px; margin: 8px 0; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>OWS Warranty Claim — ${claimNumber}</h1>

  <h2>Claim Information</h2>
  <div class="info-grid">
    <div><span class="label">RO Number:</span> ${data.roNumber}</div>
    <div><span class="label">RO Date:</span> ${data.roDate}</div>
    <div><span class="label">VIN:</span> ${data.vin}</div>
    <div><span class="label">Reg No:</span> ${data.regNo}</div>
    <div><span class="label">Vehicle:</span> ${data.vehicleModel}</div>
    <div><span class="label">Kilometers:</span> ${data.kilometers}</div>
    <div><span class="label">Customer:</span> ${data.customerName}</div>
    <div><span class="label">Warranty Start:</span> ${data.warrantyStartDate}</div>
    <div><span class="label">Dealer Code:</span> ${data.dealerCode}</div>
    <div><span class="label">Dealer:</span> ${data.dealerName}</div>
  </div>

  <h2>Repair Line ${data.lineNumber}</h2>
  <div class="info-grid">
    <div><span class="label">Operation:</span> ${line.opCode} — ${line.operationDescription}</div>
    <div><span class="label">Payment Method:</span> ${line.paymentMethod}</div>
  </div>

  <h2>Comments</h2>
  <div class="comments">
    <strong>Complaint:</strong> ${data.complaint}
    
<strong>Cause:</strong> ${data.cause}

<strong>Correction:</strong> ${data.correction}
  </div>

  <h2>Parts</h2>
  <table>
    <tr><th>Part Code</th><th>Description</th><th class="right">Qty</th><th class="right">Unit Price</th><th class="right">Total</th></tr>
    ${line.parts.map(p => `<tr><td>${p.code}</td><td>${p.description}</td><td class="right">${p.qty}</td><td class="right">R ${p.unitPrice.toFixed(2)}</td><td class="right">R ${(p.qty * p.unitPrice).toFixed(2)}</td></tr>`).join("")}
    <tr class="total-row"><td colspan="4">Parts Total</td><td class="right">R ${partsTotal.toFixed(2)}</td></tr>
  </table>

  <h2>Labour</h2>
  <table>
    <tr><th>Op. Code</th><th>Description</th><th class="right">Hours</th><th class="right">Amount</th></tr>
    <tr><td>${line.opCode}</td><td>${line.operationDescription}</td><td class="right">${line.labourHours.toFixed(1)}</td><td class="right">R ${labourTotal.toFixed(2)}</td></tr>
    <tr class="total-row"><td colspan="3">Labour Total</td><td class="right">R ${labourTotal.toFixed(2)}</td></tr>
  </table>

  <h2>Repair Line SubTotal</h2>
  <table>
    <tr><td><strong>Parts</strong></td><td class="right">R ${partsTotal.toFixed(2)}</td></tr>
    <tr><td><strong>Labour</strong></td><td class="right">R ${labourTotal.toFixed(2)}</td></tr>
    <tr class="total-row"><td><strong>TOTAL</strong></td><td class="right">R ${total.toFixed(2)}</td></tr>
  </table>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const fileName = `${claimNumber}-OWS Claim Line ${data.lineNumber}.html`;
  saveAs(blob, fileName);
  return fileName;
}
