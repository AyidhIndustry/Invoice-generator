import { getDeliveryNotesPage } from '@/features/delivery-notes/get-delivery-notes'
import { usePaginatedDocuments } from '@/hooks/use-paginated-documents'
import { FilterType } from '@/schemas/filter.type'

export function usePaginatedDeliveryNotes(filter: FilterType) {
  return usePaginatedDocuments(['delivery-notes', 'paginated', filter], (cursor) =>
    getDeliveryNotesPage(filter, cursor),
  )
}
