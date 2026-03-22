import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export interface CORPartLine {
  code: string;
  description: string;
  qty: number;
  unitPrice: number;
}

export interface CORLabourLine {
  description: string;
  opCode: string;
  hours: number;
  rate: number;
}

export interface CORFormData {
  // Dealer
  dealershipName: string;
  branch: string;
  dealerCode: string;
  todaysDate: string;
  priorApprovalTeam: string;
  phone: string;
  email: string;

  // Customer/Vehicle
  customerName: string;
  company: string;
  repairOrder: string;
  jobcardNumber: string;
  vin: string;
  regNo: string;
  engineNo: string;
  warrantyStartDate: string;
  kilometers: string;
  vehicleModel: string;

  // Complaint/Cause/Correction
  complaint: string;
  causeSummary: string;
  causeDetailed: string;
  correction: string;

  // Lines
  parts: CORPartLine[];
  labour: CORLabourLine[];
}

function applyHeaderStyle(cell: ExcelJS.Cell, isBold = true) {
  cell.font = { name: "Arial", size: 9, bold: isBold, color: { argb: "FF1F2937" } };
  cell.alignment = { vertical: "top", wrapText: true };
}

function applyValueStyle(cell: ExcelJS.Cell) {
  cell.font = { name: "Arial", size: 9, color: { argb: "FF111827" } };
  cell.alignment = { vertical: "top", wrapText: true };
}

function applyMoneyFormat(cell: ExcelJS.Cell) {
  cell.numFmt = '#,##0.00';
  cell.font = { name: "Arial", size: 9, color: { argb: "FF111827" } };
  cell.alignment = { vertical: "top", horizontal: "right" };
}

export async function generateCORExcel(data: CORFormData) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Ford Service Tool - COR Generator";
  wb.created = new Date();

  // ===================== PAGE 1 =====================
  const ws1 = wb.addWorksheet("COR Form", {
    pageSetup: { paperSize: 9, orientation: "portrait", fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
    properties: { defaultColWidth: 14 },
  });

  // Column widths
  ws1.columns = [
    { width: 22 }, // A
    { width: 48 }, // B
    { width: 12 }, // C
    { width: 16 }, // D
    { width: 18 }, // E
    { width: 14 }, // F
  ];

  // Title row
  const titleCell = ws1.getCell("A1");
  titleCell.value = "Prior Approval Authorization Request Form – Ford Protect";
  titleCell.font = { name: "Arial", size: 13, bold: true, color: { argb: "FF003478" } };
  ws1.mergeCells("A1:F1");

  // Blank row 2
  let row = 3;

  // Dealer info block
  const dealerFields = [
    ["Dealership Name:", data.dealershipName, "Branch:", data.branch],
    ["Dealer Code:", data.dealerCode, "Today's Date:", data.todaysDate],
    ["Prior Approval Team:", data.priorApprovalTeam, "Phone:", data.phone],
    ["E-Mail:", data.email, "", ""],
  ];

  dealerFields.forEach((fields) => {
    const r = ws1.getRow(row);
    applyHeaderStyle(r.getCell(1)); r.getCell(1).value = fields[0];
    applyValueStyle(r.getCell(2)); r.getCell(2).value = fields[1];
    if (fields[2]) {
      applyHeaderStyle(r.getCell(4)); r.getCell(4).value = fields[2];
      applyValueStyle(r.getCell(5)); r.getCell(5).value = fields[3];
    }
    row++;
  });

  row++; // blank

  // Vehicle/Customer info
  const vehicleFields = [
    ["Customer Name:", data.customerName, "Company:", data.company],
    ["Repair Order #:", data.repairOrder, "Jobcard #:", data.jobcardNumber],
    ["VIN:", data.vin, "Reg No.:", data.regNo],
    ["Engine No.:", data.engineNo, "Warranty Start Date:", data.warrantyStartDate],
    ["Vehicle Model:", data.vehicleModel, "Kilometers:", data.kilometers],
  ];

  vehicleFields.forEach((fields) => {
    const r = ws1.getRow(row);
    applyHeaderStyle(r.getCell(1)); r.getCell(1).value = fields[0];
    applyValueStyle(r.getCell(2)); r.getCell(2).value = fields[1];
    applyHeaderStyle(r.getCell(4)); r.getCell(4).value = fields[2];
    applyValueStyle(r.getCell(5)); r.getCell(5).value = fields[3];
    row++;
  });

  // Claim total
  const partsTotal = data.parts.reduce((s, p) => s + p.qty * p.unitPrice, 0);
  const labourTotal = data.labour.reduce((s, l) => s + l.hours * l.rate, 0);
  const claimTotal = partsTotal + labourTotal;

  const claimRow = ws1.getRow(row);
  applyHeaderStyle(claimRow.getCell(4)); claimRow.getCell(4).value = "Claim Total";
  applyMoneyFormat(claimRow.getCell(5)); claimRow.getCell(5).value = claimTotal;
  row++;
  row++; // blank

  // Complaint
  const complaintRow = ws1.getRow(row);
  applyHeaderStyle(complaintRow.getCell(1)); complaintRow.getCell(1).value = "Complaint:";
  applyValueStyle(complaintRow.getCell(2)); complaintRow.getCell(2).value = data.complaint;
  ws1.mergeCells(`B${row}:F${row}`);
  row++;

  // Cause (summary)
  const causeRow = ws1.getRow(row);
  applyHeaderStyle(causeRow.getCell(1)); causeRow.getCell(1).value = "Cause (summary):";
  applyValueStyle(causeRow.getCell(2)); causeRow.getCell(2).value = data.causeSummary;
  ws1.mergeCells(`B${row}:F${row + 3}`);
  causeRow.height = 80;
  row += 4;

  // Correction
  const corrRow = ws1.getRow(row);
  applyHeaderStyle(corrRow.getCell(1)); corrRow.getCell(1).value = "Correction:";
  applyValueStyle(corrRow.getCell(2)); corrRow.getCell(2).value = data.correction;
  ws1.mergeCells(`B${row}:F${row}`);
  row++;
  row++; // blank

  // PARTS header
  const partsHeaderRow = ws1.getRow(row);
  partsHeaderRow.getCell(1).value = "PARTS";
  partsHeaderRow.getCell(1).font = { name: "Arial", size: 10, bold: true, color: { argb: "FF003478" } };
  row++;

  const colHeaders = ["Code", "Description", "Qty", "Unit (ex VAT)", "Line Total (ex VAT)"];
  const headerRow = ws1.getRow(row);
  colHeaders.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.font = { name: "Arial", size: 9, bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF003478" } };
    cell.alignment = { horizontal: i >= 2 ? "right" : "left", vertical: "middle" };
    cell.border = {
      bottom: { style: "thin", color: { argb: "FF003478" } },
    };
  });
  row++;

  // Parts data rows
  data.parts.forEach((part) => {
    const r = ws1.getRow(row);
    applyValueStyle(r.getCell(1)); r.getCell(1).value = part.code;
    r.getCell(1).font = { ...r.getCell(1).font, name: "Arial", size: 9 };
    applyValueStyle(r.getCell(2)); r.getCell(2).value = part.description;
    applyValueStyle(r.getCell(3)); r.getCell(3).value = part.qty;
    r.getCell(3).alignment = { horizontal: "right" };
    applyMoneyFormat(r.getCell(4)); r.getCell(4).value = part.unitPrice;
    applyMoneyFormat(r.getCell(5)); r.getCell(5).value = part.qty * part.unitPrice;
    row++;
  });

  // Parts total
  const ptRow = ws1.getRow(row);
  applyHeaderStyle(ptRow.getCell(4)); ptRow.getCell(4).value = "Parts Total (ex VAT)";
  ptRow.getCell(4).alignment = { horizontal: "right" };
  applyMoneyFormat(ptRow.getCell(5)); ptRow.getCell(5).value = partsTotal;
  ptRow.getCell(5).font = { ...ptRow.getCell(5).font, bold: true };
  row++;
  row++; // blank

  // LABOUR header
  const labHeaderRow = ws1.getRow(row);
  labHeaderRow.getCell(1).value = "LABOUR";
  labHeaderRow.getCell(1).font = { name: "Arial", size: 10, bold: true, color: { argb: "FF003478" } };
  row++;

  const labColHeaders = ["Operation Description", "Op. Code", "Hours", "Amount (ex VAT)"];
  const labHdrRow = ws1.getRow(row);
  labColHeaders.forEach((h, i) => {
    const cell = labHdrRow.getCell(i + 1);
    cell.value = h;
    cell.font = { name: "Arial", size: 9, bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF003478" } };
    cell.alignment = { horizontal: i >= 2 ? "right" : "left", vertical: "middle" };
    cell.border = {
      bottom: { style: "thin", color: { argb: "FF003478" } },
    };
  });
  // TOTAL column header
  const totalHeaderCell = labHdrRow.getCell(6);
  totalHeaderCell.value = "TOTAL";
  totalHeaderCell.font = { name: "Arial", size: 9, bold: true, color: { argb: "FFFFFFFF" } };
  totalHeaderCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF003478" } };
  totalHeaderCell.alignment = { horizontal: "right", vertical: "middle" };
  row++;

  // Grand total in first labour row
  const firstLabRow = ws1.getRow(row);
  applyMoneyFormat(firstLabRow.getCell(6)); firstLabRow.getCell(6).value = claimTotal;
  firstLabRow.getCell(6).font = { name: "Arial", size: 10, bold: true, color: { argb: "FF003478" } };
  row++;

  // Labour data rows
  data.labour.forEach((lab) => {
    const r = ws1.getRow(row);
    applyValueStyle(r.getCell(1)); r.getCell(1).value = lab.description;
    applyValueStyle(r.getCell(2)); r.getCell(2).value = lab.opCode;
    applyValueStyle(r.getCell(3)); r.getCell(3).value = lab.hours;
    r.getCell(3).alignment = { horizontal: "right" };
    r.getCell(3).numFmt = '0.00';
    applyMoneyFormat(r.getCell(4)); r.getCell(4).value = lab.hours * lab.rate;
    row++;
  });

  // Labour total
  const ltRow = ws1.getRow(row);
  applyHeaderStyle(ltRow.getCell(3)); ltRow.getCell(3).value = "Labour Total (ex VAT)";
  ltRow.getCell(3).alignment = { horizontal: "right" };
  applyMoneyFormat(ltRow.getCell(4)); ltRow.getCell(4).value = labourTotal;
  ltRow.getCell(4).font = { ...ltRow.getCell(4).font, bold: true };

  // ===================== PAGE 2 =====================
  const ws2 = wb.addWorksheet("Cause & Correction", {
    pageSetup: { paperSize: 9, orientation: "portrait", fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });

  ws2.columns = [
    { width: 20 },
    { width: 80 },
  ];

  const p2Title = ws2.getCell("A1");
  p2Title.value = "Complaint";
  p2Title.font = { name: "Arial", size: 11, bold: true, color: { argb: "FF003478" } };
  ws2.getCell("B1").value = data.complaint;
  applyValueStyle(ws2.getCell("B1"));

  ws2.getCell("A3").value = "Cause (detailed)";
  ws2.getCell("A3").font = { name: "Arial", size: 11, bold: true, color: { argb: "FF003478" } };
  ws2.getCell("B3").value = data.causeDetailed || data.causeSummary;
  applyValueStyle(ws2.getCell("B3"));
  ws2.getCell("B3").alignment = { wrapText: true, vertical: "top" };
  ws2.getRow(3).height = 200;

  ws2.getCell("A5").value = "Correction";
  ws2.getCell("A5").font = { name: "Arial", size: 11, bold: true, color: { argb: "FF003478" } };
  ws2.getCell("B5").value = data.correction;
  applyValueStyle(ws2.getCell("B5"));
  ws2.getCell("B5").alignment = { wrapText: true, vertical: "top" };
  ws2.getRow(5).height = 60;

  // Generate and download
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const fileName = `COR_${data.jobcardNumber || "DRAFT"}_${data.repairOrder || "NEW"}.xlsx`;
  saveAs(blob, fileName);

  return fileName;
}
