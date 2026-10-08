import { getDocumentsPage, getFilteredDocuments, PageCursor } from '@/lib/firestore'
import { FilterType } from '@/schemas/filter.type'
import { Invoice } from '@/schemas/invoice.schema'

export function getAllInvoices(filter?: FilterType) {
  return getFilteredDocuments<Invoice>('invoices', filter)
}

export function getInvoicesPage(filter: FilterType, cursor: PageCursor) {
  return getDocumentsPage<Invoice>('invoices', filter, cursor)
}
