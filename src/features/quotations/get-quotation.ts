import { getDocumentsPage, PageCursor } from '@/lib/firestore'
import { FilterType } from '@/schemas/filter.type'
import { Quotation } from '@/schemas/quotation.schema'

export function getQuotationsPage(filter: FilterType, cursor: PageCursor) {
  return getDocumentsPage<Quotation>('quotations', filter, cursor)
}
