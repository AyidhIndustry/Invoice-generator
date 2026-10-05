import { getDocumentById } from '@/lib/firestore'
import { Quotation } from '@/schemas/quotation.schema'

export function getQuotationById(id: string) {
  return getDocumentById<Quotation>('quotations', id, 'Quotation not found')
}
