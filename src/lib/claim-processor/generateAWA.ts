import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type { ClaimPartLine } from "./types";

export interface AWAFormData {
  dealershipName: string;
  branch: string;
  dealerCode: string;
  todaysDate: string;
  phone: string;
  email: string;
  customerName: string;
  vehicleType: string;
  vehicleYear: string;
  monthsOld: string;
  vin: string;
  regNo: string;
  roNumber: string;
  roDate: string;
  fleetCode: string;
  fleetName: string;
  warrantyStartDate: string;
  currentKilometers: string;
  customerPhone: string;
  complaint: string;
  justification: string;
  loyaltyAnswers: boolean[];
  ifYesPreviousAWA: string;
  serviceHistory: { date: string; mileage: string; service: string }[];
  /** Optional quote breakdown — auto-fills the QUOTE tab when present. */
  quoteParts?: { code: string; description: string; qty: number; unitPrice: number }[];
  quoteLabour?: { opCode: string; description: string; hours: number; rate: number }[];
}

function s(cell: ExcelJS.Cell, value: any, opts?: { bold?: boolean; size?: number; color?: string; align?: "left" | "center" | "right" }) {
  cell.value = value;
  cell.font = { name: "Arial", size: opts?.size || 9, bold: opts?.bold || false, color: { argb: opts?.color || "FF000000" } };
  cell.alignment = { vertical: "top", wrapText: true, horizontal: opts?.align || "left" };
}

export async function generateAWA(data: AWAFormData, claimNumber: string, returnBlob?: boolean): Promise<string | { blob: Blob; fileName: string }> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Ford Service Tool - AWA Generator";

  // ===== Sheet 1: AWA (CLP) Request =====
  const ws = wb.addWorksheet("AWA (CLP) Request", {
    pageSetup: { paperSize: 9, orientation: "portrait", fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });

  ws.columns = [
    { width: 4 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 },
    { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 },
    { width: 10 }, { width: 10 },
  ];

  // Title
  ws.mergeCells("C1:H1");
  s(ws.getCell("C1"), "After Warranty Adjustment Request Form", { bold: true, size: 13, color: "FF003478" });

  // Ford header
  ws.mergeCells("C3:G3");
  s(
    ws.getCell("C3"),
    "Ford Motor Company of Southern Africa, International Markets Group (IMG).\nCustomer Resolution Centre (CRC)",
    { size: 8 },
  );
  ws.getRow(3).height = 40;
  s(ws.getCell("H3"), `Phone: ${data.phone}\nE-Mail: ${data.email}`, { size: 8 });

  // To
  s(ws.getCell("B5"), "To:", { bold: true });
  s(ws.getCell("C5"), "B. Bezuidenhout");

  // Dealer info
  s(ws.getCell("B7"), "Dealership Name:", { bold: true });
  ws.mergeCells("C7:F7");
  s(ws.getCell("C7"), data.dealershipName);
  s(ws.getCell("I7"), "Number of Pages", { size: 8 });

  s(ws.getCell("B9"), "Branch Location:", { bold: true });
  ws.mergeCells("C9:F9");
  s(ws.getCell("C9"), data.branch);

  s(ws.getCell("B11"), "Dealer Code", { bold: true });
  s(ws.getCell("C11"), data.dealerCode);
  s(ws.getCell("H11"), "Today's Date:", { bold: true });
  s(ws.getCell("I11"), data.todaysDate);

  // Customer Information header
  let row = 14;
  ws.mergeCells(`D${row}:H${row}`);
  s(ws.getCell(`D${row}`), "Customer Information", { bold: true, size: 10, color: "FF003478" });

  row = 16;
  s(ws.getCell(`B${row}`), "Customer / Fleet Name:", { bold: true });
  ws.mergeCells(`C${row}:F${row}`);
  s(ws.getCell(`C${row}`), data.customerName);
  s(ws.getCell(`G${row}`), "TEL:", { bold: true });
  s(ws.getCell(`H${row}`), data.customerPhone);

  row = 18;
  s(ws.getCell(`B${row}`), "Vehicle Type:", { bold: true });
  ws.mergeCells(`C${row}:F${row}`);
  s(ws.getCell(`C${row}`), data.vehicleType);
  s(ws.getCell(`G${row}`), "Vehicle Year:", { bold: true });
  s(ws.getCell(`H${row}`), data.vehicleYear);
  s(ws.getCell(`J${row}`), "Months Old:", { bold: true });
  s(ws.getCell(`K${row}`), data.monthsOld);

  row = 20;
  s(ws.getCell(`B${row}`), "Vehicle VIN #", { bold: true });
  ws.mergeCells(`C${row}:F${row}`);
  s(ws.getCell(`C${row}`), data.vin);
  s(ws.getCell(`H${row}`), "RO No:", { bold: true });
  s(ws.getCell(`I${row}`), data.roNumber);
  s(ws.getCell(`J${row}`), "RO Date:", { bold: true });
  s(ws.getCell(`K${row}`), data.roDate);

  row = 22;
  s(ws.getCell(`B${row}`), "Vehicle Registration #", { bold: true });
  ws.mergeCells(`C${row}:E${row}`);
  s(ws.getCell(`C${row}`), data.regNo);
  s(ws.getCell(`F${row}`), "Fleet Code:", { bold: true });
  s(ws.getCell(`G${row}`), data.fleetCode);
  s(ws.getCell(`H${row}`), "Fleet Name:", { bold: true });
  ws.mergeCells(`I${row}:K${row}`);
  s(ws.getCell(`I${row}`), data.fleetName);

  row = 24;
  s(ws.getCell(`B${row}`), "Warranty Start Date:", { bold: true });
  ws.mergeCells(`C${row}:E${row}`);
  s(ws.getCell(`C${row}`), data.warrantyStartDate);
  s(ws.getCell(`G${row}`), "Current Kilometers on Vehicle:", { bold: true });
  ws.mergeCells(`H${row}:K${row}`);
  s(ws.getCell(`H${row}`), data.currentKilometers);

  // Loyalty Questions
  row = 27;
  ws.mergeCells(`D${row}:H${row}`);
  s(ws.getCell(`D${row}`), "Owner Loyalty Questions", { bold: true, size: 10, color: "FF003478" });
  s(ws.getCell(`J${row}`), "Tick Yes or NO", { bold: true, size: 8 });

  const questions = [
    "Did the customer purchase the vehicle within the factory warranty period?",
    "Does this vehicle have an extended service contract/warranty?",
    "Did this customer perform all maintenance work at a Ford Franchised Dealer/Distributor?",
    "Does this vehicle have a full service history with Ford a Ford Franchised Dealer/Distributor?",
    "Will the contribution help maintain customer loyalty to the brand?",
    "Has this vehicle received any After Warranty Assistance previously?",
  ];

  row = 29;
  questions.forEach((q, i) => {
    s(ws.getCell(`B${row}`), `${i + 1}. ${q}`, { size: 8 });
    ws.mergeCells(`B${row}:H${row}`);
    s(ws.getCell(`I${row}`), data.loyaltyAnswers[i] ? "Yes" : "", { bold: true });
    s(ws.getCell(`J${row}`), !data.loyaltyAnswers[i] ? "No" : "", { bold: true });
    row++;
  });

  // If yes previous AWA
  s(ws.getCell(`B${row}`), "If yes, for what reason:", { size: 8 });
  ws.mergeCells(`C${row}:K${row}`);
  s(ws.getCell(`C${row}`), data.ifYesPreviousAWA);
  row++;

  // Question 7 & 8
  s(ws.getCell(`B${row}`), "7. Any non approved Ford Accessories fitted or modifications made to the vehicle.", { size: 8 });
  ws.mergeCells(`B${row}:H${row}`);
  s(ws.getCell(`I${row}`), "Yes");
  s(ws.getCell(`J${row}`), "No");
  row++;
  s(ws.getCell(`B${row}`), "8. Does the vehicle comply with the exclusions based on the AWA guidelines?", { size: 8 });
  ws.mergeCells(`B${row}:H${row}`);
  s(ws.getCell(`I${row}`), "Yes");
  s(ws.getCell(`J${row}`), "No");
  row += 2;

  // Customer Concern
  ws.mergeCells(`D${row}:H${row}`);
  s(ws.getCell(`D${row}`), "Customer Concern", { bold: true, size: 10, color: "FF003478" });
  row++;
  s(ws.getCell(`B${row}`), "Please detail:", { bold: true });
  row++;
  ws.mergeCells(`B${row}:K${row + 5}`);
  s(ws.getCell(`B${row}`), data.complaint);
  ws.getRow(row).height = 80;
  row += 7;

  // Dealer Justification
  ws.mergeCells(`D${row}:H${row}`);
  s(ws.getCell(`D${row}`), "Dealer Justification", { bold: true, size: 10, color: "FF003478" });
  row++;
  s(ws.getCell(`B${row}`), "Any additional information supporting this AWA request:", { size: 8 });
  row++;
  ws.mergeCells(`B${row}:K${row + 2}`);
  s(ws.getCell(`B${row}`), data.justification);
  ws.getRow(row).height = 60;
  row += 4;

  // Note
  s(ws.getCell(`B${row}`), "Please note: Attach all relevant documentation to this document in the designated Tabs below.", { size: 7, bold: true });
  row += 2;

  // Agreed Assistance section
  ws.mergeCells(`D${row}:H${row}`);
  s(ws.getCell(`D${row}`), "Agreed Assistance", { bold: true, size: 10, color: "FF003478" });
  row++;

  const headers = ["", "", "Parts %", "Labour %", "Parts Rands", "Labour Rands"];
  headers.forEach((h, i) => s(ws.getCell(row, i + 1), h, { bold: true, size: 8 }));
  row++;

  // Defaults: Actual 100/100, Customer 20/20, Dealer 0/0, Ford 80/80
  const assistRows: { label: string; partsPct: number; labourPct: number }[] = [
    { label: "Actual % / Cost", partsPct: 100, labourPct: 100 },
    { label: "Customer Participation:", partsPct: 20, labourPct: 20 },
    { label: "Dealer Participation:", partsPct: 0, labourPct: 0 },
    { label: "Ford Participation:", partsPct: 80, labourPct: 80 },
  ];
  const partsTotal = (data.quoteParts || []).reduce((s2, p) => s2 + p.qty * p.unitPrice, 0);
  const labourTotal = (data.quoteLabour || []).reduce((s2, l) => s2 + l.hours * l.rate, 0);
  assistRows.forEach((r) => {
    s(ws.getCell(`B${row}`), r.label, { bold: true, size: 8 });
    s(ws.getCell(`C${row}`), `${r.partsPct}%`);
    s(ws.getCell(`D${row}`), `${r.labourPct}%`);
    s(ws.getCell(`E${row}`), partsTotal ? `R${((partsTotal * r.partsPct) / 100).toFixed(2)}` : "R-");
    s(ws.getCell(`F${row}`), labourTotal ? `R${((labourTotal * r.labourPct) / 100).toFixed(2)}` : "R-");
    if (r.label === "Actual % / Cost") {
      s(ws.getCell(`H${row}`), "Total Ford Warranty Labour Contribution R:", { size: 7 });
      s(ws.getCell(`K${row}`), labourTotal ? `R${((labourTotal * 80) / 100).toFixed(2)}` : "R0.00", { bold: true });
    }
    if (r.label === "Customer Participation:") {
      s(ws.getCell(`H${row}`), "Total Ford Warranty Parts Contribution", { size: 7 });
      s(ws.getCell(`K${row}`), partsTotal ? `R${((partsTotal * 80) / 100).toFixed(2)}` : "R0.00", { bold: true });
    }
    if (r.label === "Dealer Participation:") {
      s(ws.getCell(`H${row}`), "TOTAL FORD CONTRIBUTION", { size: 7, bold: true });
      const total = ((partsTotal + labourTotal) * 80) / 100;
      s(ws.getCell(`K${row}`), total ? `R${total.toFixed(2)}` : "R0.00", { bold: true });
    }
    row++;
  });

  row += 2;
  s(ws.getCell(`B${row}`), "CLP/AWA Dealer/Customer Participation - It is encouraged to have dealers and customer participate in the repair cost. The suggested contribution guidelines are:", { size: 7 });
  row++;
  s(ws.getCell(`B${row}`), "25% Customer, 25% Dealer and 50% Ford contribution.", { size: 7, bold: true });
  row += 2;
  s(ws.getCell(`I${row}`), "Approved by:", { bold: true });
  s(ws.getCell(`J${row}`), "B. Bezuidenhout");
  row++;
  s(ws.getCell(`I${row}`), "Signed:", { bold: true });
  row++;
  s(ws.getCell(`I${row}`), "Date:", { bold: true });

  // ===== Sheet 2: Diagnostics, Photos, Videos (placeholder) =====
  const wsDiag = wb.addWorksheet("Diagnostics, Photos, Videos", {
    pageSetup: { paperSize: 9, orientation: "portrait" },
  });
  wsDiag.columns = [{ width: 80 }];
  s(wsDiag.getCell("A1"), "Diagnostics, Photos, Videos", { bold: true, size: 12, color: "FF003478" });
  s(wsDiag.getCell("A3"), "Paste or insert diagnostic reports, photos and videos supporting this AWA request.", { size: 9 });

  // ===== Sheet 3: Service History =====
  const ws2 = wb.addWorksheet("Service History", {
    pageSetup: { paperSize: 9, orientation: "portrait" },
  });
  ws2.columns = [{ width: 20 }, { width: 20 }, { width: 50 }];
  s(ws2.getCell("A1"), "Service date", { bold: true });
  s(ws2.getCell("B1"), "Service mileage", { bold: true });
  s(ws2.getCell("C1"), "Service carried out", { bold: true });

  data.serviceHistory.forEach((sh, i) => {
    ws2.getCell(`A${i + 2}`).value = sh.date;
    ws2.getCell(`B${i + 2}`).value = sh.mileage;
    ws2.getCell(`C${i + 2}`).value = sh.service;
  });

  // ===== Sheet 4: Other Supporting Documents (placeholder) =====
  const wsOther = wb.addWorksheet("Other Supporting Documents", {
    pageSetup: { paperSize: 9, orientation: "portrait" },
  });
  wsOther.columns = [{ width: 80 }];
  s(wsOther.getCell("A1"), "Other Supporting Documents", { bold: true, size: 12, color: "FF003478" });
  s(wsOther.getCell("A3"), "Attach any additional documents (correspondence, prior repair records, etc.) on this tab.", { size: 9 });

  // ===== Sheet 5: QUOTE (auto-filled from claim) =====
  const wsQuote = wb.addWorksheet("QUOTE", {
    pageSetup: { paperSize: 9, orientation: "portrait", fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });
  wsQuote.columns = [
    { width: 16 }, { width: 40 }, { width: 8 }, { width: 14 }, { width: 14 },
  ];
  s(wsQuote.getCell("A1"), "Quotation (auto-filled from claim)", { bold: true, size: 12, color: "FF003478" });
  wsQuote.mergeCells("A1:E1");
  s(wsQuote.getCell("A2"), `RO: ${data.roNumber}  |  VIN: ${data.vin}  |  Customer: ${data.customerName}`, { size: 8 });
  wsQuote.mergeCells("A2:E2");

  // Parts table
  let qr = 4;
  s(wsQuote.getCell(`A${qr}`), "PARTS", { bold: true, size: 10, color: "FF003478" });
  qr++;
  ["Part No", "Description", "Qty", "Unit Price", "Line Total"].forEach((h, i) =>
    s(wsQuote.getCell(qr, i + 1), h, { bold: true, size: 9 }),
  );
  qr++;
  const partsFirst = qr;
  const parts = data.quoteParts || [];
  parts.forEach((p) => {
    wsQuote.getCell(`A${qr}`).value = p.code;
    wsQuote.getCell(`B${qr}`).value = p.description;
    wsQuote.getCell(`C${qr}`).value = p.qty;
    wsQuote.getCell(`D${qr}`).value = p.unitPrice;
    wsQuote.getCell(`D${qr}`).numFmt = '"R"#,##0.00';
    wsQuote.getCell(`E${qr}`).value = { formula: `C${qr}*D${qr}` } as any;
    wsQuote.getCell(`E${qr}`).numFmt = '"R"#,##0.00';
    qr++;
  });
  const partsLast = qr - 1;
  s(wsQuote.getCell(`D${qr}`), "Parts Subtotal", { bold: true, size: 9 });
  if (parts.length > 0) {
    wsQuote.getCell(`E${qr}`).value = { formula: `SUM(E${partsFirst}:E${partsLast})` } as any;
  } else {
    wsQuote.getCell(`E${qr}`).value = 0;
  }
  wsQuote.getCell(`E${qr}`).numFmt = '"R"#,##0.00';
  wsQuote.getCell(`E${qr}`).font = { name: "Arial", size: 9, bold: true };
  const partsSubtotalRow = qr;
  qr += 2;

  // Labour table
  s(wsQuote.getCell(`A${qr}`), "LABOUR", { bold: true, size: 10, color: "FF003478" });
  qr++;
  ["Op Code", "Description", "Hours", "Rate", "Line Total"].forEach((h, i) =>
    s(wsQuote.getCell(qr, i + 1), h, { bold: true, size: 9 }),
  );
  qr++;
  const labFirst = qr;
  const labour = data.quoteLabour || [];
  labour.forEach((l) => {
    wsQuote.getCell(`A${qr}`).value = l.opCode;
    wsQuote.getCell(`B${qr}`).value = l.description;
    wsQuote.getCell(`C${qr}`).value = l.hours;
    wsQuote.getCell(`D${qr}`).value = l.rate;
    wsQuote.getCell(`D${qr}`).numFmt = '"R"#,##0.00';
    wsQuote.getCell(`E${qr}`).value = { formula: `C${qr}*D${qr}` } as any;
    wsQuote.getCell(`E${qr}`).numFmt = '"R"#,##0.00';
    qr++;
  });
  const labLast = qr - 1;
  s(wsQuote.getCell(`D${qr}`), "Labour Subtotal", { bold: true, size: 9 });
  if (labour.length > 0) {
    wsQuote.getCell(`E${qr}`).value = { formula: `SUM(E${labFirst}:E${labLast})` } as any;
  } else {
    wsQuote.getCell(`E${qr}`).value = 0;
  }
  wsQuote.getCell(`E${qr}`).numFmt = '"R"#,##0.00';
  wsQuote.getCell(`E${qr}`).font = { name: "Arial", size: 9, bold: true };
  const labSubtotalRow = qr;
  qr += 2;

  s(wsQuote.getCell(`D${qr}`), "GRAND TOTAL", { bold: true, size: 10, color: "FF003478" });
  wsQuote.getCell(`E${qr}`).value = { formula: `E${partsSubtotalRow}+E${labSubtotalRow}` } as any;
  wsQuote.getCell(`E${qr}`).numFmt = '"R"#,##0.00';
  wsQuote.getCell(`E${qr}`).font = { name: "Arial", size: 10, bold: true, color: { argb: "FF003478" } };

  // ===== Sheet 6: AWA Exclusions =====
  const ws3 = wb.addWorksheet("AWA Exclusions", {
    pageSetup: { paperSize: 9, orientation: "portrait" },
  });
  ws3.columns = [{ width: 5 }, { width: 80 }];
  s(ws3.getCell("A1"), "AWA Exclusion List", { bold: true, size: 11, color: "FF003478" });
  ws3.mergeCells("A1:B1");
  s(ws3.getCell("A2"), "(Do not qualify for AWA assistance if the claim falls into any of the exclusions listed below)", { size: 8 });
  ws3.mergeCells("A2:B2");

  const exclusions = [
    "Repairs for Components covered by extended warranties.",
    "Repairs or Components are covered by any used vehicle warranties (CLP can supplement shortfall).",
    "Any failure caused by misuse, neglect, lack of maintenance, etc.",
    "Refurbishment of Dealership used-car stock.",
    "Written off vehicles",
    "Refunds for non-emergency outside repairs.",
    "Consequential loss or incidental expenses.",
    "Repairs related to accidents, natural disasters or road hazards.",
  ];

  exclusions.forEach((ex, i) => {
    ws3.getCell(`A${i + 4}`).value = i + 1;
    ws3.getCell(`B${i + 4}`).value = ex;
  });

  // Generate
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const fileName = `${claimNumber}-AWA.xlsx`;
  if (returnBlob) return { blob, fileName };
  saveAs(blob, fileName);
  return fileName;
}

