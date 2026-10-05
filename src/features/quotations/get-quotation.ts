import { getFilteredDocuments } from '@/lib/firestore'
import { FilterType } from '@/schemas/filter.type'
import { Quotation } from '@/schemas/quotation.schema'

export function getAllQuotations(filter?: FilterType) {
  return getFilteredDocuments<Quotation>('quotations', filter)
}
