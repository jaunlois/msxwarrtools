import { SBIInvoice, SBIClaim } from './types';

export async function parseSBIPdf(file: ArrayBuffer, fileName: string): Promise<SBIInvoice> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

  const pdf = await pdfjsLib.getDocument({ data: file }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.filter((item: any) => 'str' in item).map((item: any) => item.str);
    fullText += strings.join(' ') + '\n';
  }

  const invoiceMatch = fullText.match(/INVOICE\s*NUMBER:\s*([\w-]+)/i);
  const invoiceNumber = invoiceMatch ? invoiceMatch[1].replace(/^91106-/, '') : fileName.replace('.pdf', '').replace('ZA-91106-', '');

  const dateMatch = fullText.match(/DATE\s*OF\s*ISSUE:\s*([\d/]+)/i);
  const dateOfIssue = dateMatch ? dateMatch[1] : '';

  const grandTotalMatch = fullText.match(/GRAND\s*TOTAL\s*([\d,]+\.?\d*)/i);
  const grandTotal = grandTotalMatch ? parseFloat(grandTotalMatch[1].replace(/,/g, '')) : 0;

  const claims: SBIClaim[] = [];

  const roPattern = /(\w{3,}-\d+)\s+(\d+)\s+(\w*)\s+(\w{17})\s+(\d{2}\/\d{2}\/\d{4})\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/g;
  let match;
  while ((match = roPattern.exec(fullText)) !== null) {
    claims.push({
      repairOrderNo: match[1].replace(/^0+/, ''),
      claimType: match[2],
      subCode: match[3],
      vin: match[4],
      dateOfRepair: match[5],
      netAmount: parseFloat(match[6]),
      vatRate: parseFloat(match[7]),
      vatAmount: parseFloat(match[8]),
      totalIncVAT: parseFloat(match[9]),
    });
  }

  if (claims.length === 0) {
    const amountPattern = /([A-Z0-9]{17})\s+(\d{2}\/\d{2}\/\d{4})\s+([\d,.]+)\s+([\d,.]+)\s+([\d,.]+)\s+([\d,.]+)/g;
    const lines = fullText.split(/\s+/);
    const roNumbers: string[] = [];
    for (const token of lines) {
      if (/^(B?\d[\w]*-\d+|0{2,}\d+-\d+)$/.test(token)) roNumbers.push(token);
    }
    let amMatch;
    while ((amMatch = amountPattern.exec(fullText)) !== null) {
      const roIdx = claims.length;
      claims.push({
        repairOrderNo: roNumbers[roIdx] || '',
        claimType: '',
        subCode: '',
        vin: amMatch[1],
        dateOfRepair: amMatch[2],
        netAmount: parseFloat(amMatch[3].replace(/,/g, '')),
        vatRate: parseFloat(amMatch[4].replace(/,/g, '')),
        vatAmount: parseFloat(amMatch[5].replace(/,/g, '')),
        totalIncVAT: parseFloat(amMatch[6].replace(/,/g, '')),
      });
    }
  }

  if (claims.length === 0) {
    const simpleRoPattern = /(\d{6}-\d+|B\d{4,}-\d+)/g;
    const foundROs: string[] = [];
    let roMatch;
    while ((roMatch = simpleRoPattern.exec(fullText)) !== null) foundROs.push(roMatch[1]);
    const vinPattern = /([A-Z0-9]{17})/g;
    const foundVins: string[] = [];
    let vinMatch;
    while ((vinMatch = vinPattern.exec(fullText)) !== null) {
      if (vinMatch[1] !== '4660165335' && vinMatch[1] !== '4690104908') foundVins.push(vinMatch[1]);
    }
    for (let i = 0; i < foundROs.length; i++) {
      claims.push({
        repairOrderNo: foundROs[i],
        claimType: '',
        subCode: '',
        vin: foundVins[i] || '',
        dateOfRepair: '',
        netAmount: 0,
        vatRate: 15,
        vatAmount: 0,
        totalIncVAT: 0,
      });
    }
  }

  return { invoiceNumber, dateOfIssue, claims, grandTotal };
}

export function normalizeRO(ro: string): string {
  let cleaned = ro.replace(/-\d+$/, '');
  cleaned = cleaned.replace(/^RO/i, '');
  cleaned = cleaned.replace(/^0+/, '');
  return cleaned.toUpperCase();
}
