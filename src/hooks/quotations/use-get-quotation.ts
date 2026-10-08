import { getQuotationsPage } from '@/features/quotations/get-quotation'
import { usePaginatedDocuments } from '@/hooks/use-paginated-documents'
import { FilterType } from '@/schemas/filter.type'

export function usePaginatedQuotations(filter: FilterType) {
  return usePaginatedDocuments(['quotations', 'paginated', filter], (cursor) =>
    getQuotationsPage(filter, cursor),
  )
}
