import { AgeAnalysisClaim, SBIInvoice } from './types';
import { normalizeRO } from './parsePDF';

export function matchClaimsWithSBI(
  claims: AgeAnalysisClaim[],
  sbiInvoices: SBIInvoice[]
): AgeAnalysisClaim[] {
  return claims.map(claim => {
    const claimRO = normalizeRO(claim.roNumber);
    const claimNoNorm = normalizeRO(claim.claimNo);

    for (const sbi of sbiInvoices) {
      for (const sbiClaim of sbi.claims) {
        const sbiRO = normalizeRO(sbiClaim.repairOrderNo);
        if (sbiRO === claimRO || sbiRO === claimNoNorm) {
          const paidAmount = sbiClaim.totalIncVAT || claim.total;
          return {
            ...claim,
            totalPD: paidAmount,
            diff: paidAmount - claim.total,
            comment: `Paid ${sbi.invoiceNumber}`,
            matched: true,
            matchedSBI: sbi.invoiceNumber,
          };
        }
      }
    }
    return claim;
  });
}
