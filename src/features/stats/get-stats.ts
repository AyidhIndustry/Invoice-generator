import { Quarter } from 'date-fns'
import { getInvoiceStats } from './get-invoice-stats'
import { getPurchaseStats } from './get-purchase-stats'
import { getQuotationStats } from './get-quotation-stats'

export async function getStats(year: number, quarter: Quarter) {
  const [invoice, purchase, quotation] = await Promise.all([
    getInvoiceStats(year, quarter),
    getPurchaseStats(year, quarter),
    getQuotationStats(year, quarter),
  ])

  return {
    ...invoice,
    ...purchase,
    ...quotation,
    netTax:
      Math.round((invoice.totalTaxReceived - purchase.totalTaxPaid) * 100) /
      100,
  }
}
  