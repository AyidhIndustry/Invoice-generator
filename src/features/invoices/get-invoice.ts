import { getFilteredDocuments } from '@/lib/firestore'
import { FilterType } from '@/schemas/filter.type'
import { Invoice } from '@/schemas/invoice.schema'

export function getAllInvoices(filter?: FilterType) {
  return getFilteredDocuments<Invoice>('invoices', filter)
}
