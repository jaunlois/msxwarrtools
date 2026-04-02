import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type { WarrantyRepairLine, ClaimVehicleInfo } from "./types";

export interface CORExportData {
  dealershipName: string;
  branch: string;
  dealerCode: string;
  todaysDate: string;
  phone: string;
  email: string;
  customerName: string;
  vehicleType: string;
  vin: string;
  regNo: string;
  repairOrder: string;
  repairLineNumber: string;
  warrantyStartDate: string;
  kilometers: string;
  complaint: string;
  comment: string;
  parts: { code: string; description: string; qty: number; fob: number; markup: number; total: number }[];
  labour: { serial: number; opCode: string; hours: number; amount: number }[];
  claimTotal: number;
  // Page 2
  causeDetailed: string;
  correction: string;
}

function h(cell: ExcelJS.Cell, value: any, opts?: { bold?: boolean; size?: number; color?: string }) {
  cell.value = value;
  cell.font = { name: "Arial", size: opts?.size || 9, bold: opts?.bold || false, color: { argb: opts?.color || "FF000000" } };
  cell.alignment = { vertical: "top", wrapText: true };
}

export async function generateCOR(data: CORExportData, claimNumber: string): Promise<string> {
  const wb = new ExcelJS.Workbook();

  // ===== Sheet 1: COR Form =====
  const ws = wb.addWorksheet("COR Form", {
    pageSetup: { paperSize: 9, orientation: "portrait", fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });

  ws.columns = [
    { width: 16 }, // A - PARTS / labels
    { width: 30 }, // B - Description / values
    { width: 8 },  // C - Qnt
    { width: 12 }, // D - FOB
    { width: 12 }, // E - Mark Up
    { width: 12 }, // F - Total
    { width: 4 },  // G
    { width: 14 }, // H
  ];

  let row = 1;

  // Title
  ws.mergeCells("D1:H1");
  h(ws.getCell("D1"), "Prior Approval Authorization Request Form", { bold: true, size: 12, color: "FF003478" });
  row = 2;

  // Ford Protect / Prior Approval Team
  ws.mergeCells("D2:H2");
  h(ws.getCell("D2"), "Ford Protect", { bold: true, size: 10 });
  h(ws.getCell("H2"), `Phone : ${data.phone}`, { size: 8 });
  row = 3;
  ws.mergeCells("D3:H3");
  h(ws.getCell("D3"), "Prior Approval Team", { size: 9 });
  h(ws.getCell("H3"), `E-Mail: ${data.email}`, { size: 8 });
  row = 5;

  // From / To
  h(ws.getCell("A5"), "From:", { bold: true });
  h(ws.getCell("B5"), data.dealershipName);
  row = 6;
  h(ws.getCell("A6"), "To:", { bold: true });
  h(ws.getCell("B6"), "Ford Protect Prior Approval");
  row = 7;
  h(ws.getCell("A7"), "Dealership Name:", { bold: true });
  ws.mergeCells("B7:D7");
  h(ws.getCell("B7"), data.dealershipName);
  h(ws.getCell("H7"), "Number of Pages:", { size: 8 });
  row = 9;
  h(ws.getCell("A9"), "Branch Location:", { bold: true });
  ws.mergeCells("B9:D9");
  h(ws.getCell("B9"), data.branch);
  row = 10;
  h(ws.getCell("A10"), "Dealer Code:", { bold: true });
  h(ws.getCell("B10"), data.dealerCode);
  h(ws.getCell("F10"), "Today's Date:", { bold: true });
  h(ws.getCell("G10"), data.todaysDate);

  // Customer Information
  row = 13;
  ws.mergeCells("A13:H13");
  h(ws.getCell("A13"), "Customer Information", { bold: true, size: 10, color: "FF003478" });

  row = 14;
  h(ws.getCell("A14"), "Customer Name:", { bold: true });
  ws.mergeCells("B14:D14");
  h(ws.getCell("B14"), data.customerName);
  h(ws.getCell("F14"), "Repair Order #:", { bold: true });
  h(ws.getCell("G14"), data.repairOrder);

  row = 16;
  h(ws.getCell("A16"), "Vehicle Type:", { bold: true });
  ws.mergeCells("B16:D16");
  h(ws.getCell("B16"), data.vehicleType);
  h(ws.getCell("F16"), "Repair Line #:", { bold: true });
  h(ws.getCell("G16"), data.repairLineNumber);

  row = 18;
  h(ws.getCell("A18"), "Vehicle VIN#", { bold: true });
  ws.mergeCells("B18:D18");
  h(ws.getCell("B18"), data.vin);
  h(ws.getCell("F18"), "Claim Total :", { bold: true });
  h(ws.getCell("G18"), `R ${data.claimTotal.toFixed(2)}`);

  row = 20;
  h(ws.getCell("A20"), "Warranty Start Date:", { bold: true });
  h(ws.getCell("B20"), data.warrantyStartDate);
  h(ws.getCell("D20"), "Kilometers On Vehicle when concern reported:", { size: 8 });
  h(ws.getCell("F20"), data.kilometers);

  // Complaint
  row = 23;
  h(ws.getCell("A23"), "Complain:", { bold: true });
  ws.mergeCells("B23:H23");
  h(ws.getCell("B23"), data.complaint);

  row = 24;
  h(ws.getCell("A24"), "Comment", { bold: true });
  ws.mergeCells("B24:H27");
  h(ws.getCell("B24"), data.comment);
  ws.getRow(24).height = 60;

  // PARTS TABLE
  row = 29;
  h(ws.getCell("A29"), "PARTS", { bold: true, size: 10, color: "FF003478" });
  row = 30;
  const partHeaders = ["PARTS", "Description", "Qnt", "FOB", "Mark Up", "Total"];
  partHeaders.forEach((ph, i) => {
    const cell = ws.getCell(30, i + 1);
    cell.value = ph;
    cell.font = { name: "Arial", size: 9, bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF003478" } };
    cell.alignment = { horizontal: i >= 2 ? "right" : "left", vertical: "middle" };
  });

  row = 31;
  const partsTotal = data.parts.reduce((s, p) => s + p.total, 0);
  
  data.parts.forEach((part) => {
    h(ws.getCell(`A${row}`), part.code);
    h(ws.getCell(`B${row}`), part.description);
    ws.getCell(`C${row}`).value = part.qty;
    ws.getCell(`C${row}`).numFmt = "0.00";
    ws.getCell(`C${row}`).alignment = { horizontal: "right" };
    ws.getCell(`D${row}`).value = part.fob;
    ws.getCell(`D${row}`).numFmt = "#,##0.00";
    ws.getCell(`E${row}`).value = part.markup;
    ws.getCell(`E${row}`).numFmt = "#,##0.00";
    ws.getCell(`F${row}`).value = part.total;
    ws.getCell(`F${row}`).numFmt = "#,##0.00";
    row++;
  });

  // Parts cap note
  if (partsTotal > 5000) {
    h(ws.getCell(`F${row}`), "Above R5000 Parts Cap at PHA R910", { size: 7, color: "FFFF0000" });
    row++;
  }

  // Parts total
  row++;
  h(ws.getCell(`C${row}`), "TOTAL", { bold: true });
  ws.getCell(`F${row}`).value = partsTotal;
  ws.getCell(`F${row}`).numFmt = "#,##0.00";
  ws.getCell(`F${row}`).font = { name: "Arial", size: 9, bold: true };
  row += 2;

  // LABOR TABLE
  h(ws.getCell(`A${row}`), "LABOR", { bold: true, size: 10, color: "FF003478" });
  row++;
  const labHeaders = ["Ser", "Op. code", "Lab Hours", "Amount", "", "TOTAL"];
  labHeaders.forEach((lh, i) => {
    const cell = ws.getCell(row, i + 1);
    cell.value = lh;
    cell.font = { name: "Arial", size: 9, bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF003478" } };
    cell.alignment = { horizontal: i >= 2 ? "right" : "left", vertical: "middle" };
  });
  row++;

  const labourTotal = data.labour.reduce((s, l) => s + l.amount, 0);
  const grandTotal = partsTotal + labourTotal;

  // Grand total in first row
  ws.getCell(`F${row}`).value = grandTotal;
  ws.getCell(`F${row}`).numFmt = "#,##0.00";
  ws.getCell(`F${row}`).font = { name: "Arial", size: 10, bold: true, color: { argb: "FF003478" } };
  row++;

  data.labour.forEach((lab) => {
    ws.getCell(`A${row}`).value = lab.serial;
    h(ws.getCell(`B${row}`), lab.opCode);
    ws.getCell(`C${row}`).value = lab.hours;
    ws.getCell(`C${row}`).numFmt = "0.00";
    ws.getCell(`D${row}`).value = lab.amount;
    ws.getCell(`D${row}`).numFmt = "#,##0.00";
    row++;
  });

  // Labour total
  h(ws.getCell(`C${row}`), "TOTAL", { bold: true });
  ws.getCell(`D${row}`).value = labourTotal;
  ws.getCell(`D${row}`).numFmt = "#,##0.00";
  ws.getCell(`D${row}`).font = { name: "Arial", size: 9, bold: true };

  // ===== Sheet 2: Cause & Correction =====
  const ws2 = wb.addWorksheet("Cause & Correction", {
    pageSetup: { paperSize: 9, orientation: "portrait", fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });
  ws2.columns = [{ width: 20 }, { width: 80 }];

  h(ws2.getCell("A1"), "Complaint", { bold: true, size: 11, color: "FF003478" });
  h(ws2.getCell("B1"), data.complaint);

  h(ws2.getCell("A3"), "Cause (detailed)", { bold: true, size: 11, color: "FF003478" });
  h(ws2.getCell("B3"), data.causeDetailed);
  ws2.getCell("B3").alignment = { wrapText: true, vertical: "top" };
  ws2.getRow(3).height = 200;

  h(ws2.getCell("A5"), "Correction", { bold: true, size: 11, color: "FF003478" });
  h(ws2.getCell("B5"), data.correction);
  ws2.getCell("B5").alignment = { wrapText: true, vertical: "top" };
  ws2.getRow(5).height = 60;

  // Generate
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const fileName = `${claimNumber}-Cost of Repair.xlsx`;
  if (returnBlob) return { blob, fileName };
  saveAs(blob, fileName);
  return fileName;
}

