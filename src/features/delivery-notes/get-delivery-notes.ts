import { getDocumentsPage, PageCursor } from '@/lib/firestore'
import { FilterType } from '@/schemas/filter.type'
import { DeliveryNote } from '@/schemas/delivery-note.schema'

export function getDeliveryNotesPage(filter: FilterType, cursor: PageCursor) {
  return getDocumentsPage<DeliveryNote>('delivery-notes', filter, cursor)
}
