import { getFilteredDocuments } from '@/lib/firestore'
import { FilterType } from '@/schemas/filter.type'
import { DeliveryNote } from '@/schemas/delivery-note.schema'

export function getAllDeliveryNotes(filter?: FilterType) {
  return getFilteredDocuments<DeliveryNote>('delivery-notes', filter)
}
