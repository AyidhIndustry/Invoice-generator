import { getPurchasesPage } from '@/features/purchases/get-purchases'
import { usePaginatedDocuments } from '@/hooks/use-paginated-documents'
import { FilterType } from '@/schemas/filter.type'

export function usePaginatedPurchases(filter: FilterType) {
  return usePaginatedDocuments(['purchases', 'paginated', filter], (cursor) =>
    getPurchasesPage(filter, cursor),
  )
}
