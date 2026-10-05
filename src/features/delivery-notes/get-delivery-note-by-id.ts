import { getDocumentById } from '@/lib/firestore'
import { DeliveryNote } from '@/schemas/delivery-note.schema'

export function getDeliveryNoteById(id: string) {
  return getDocumentById<DeliveryNote>(
    'delivery-notes',
    id,
    'Delivery note not found',
  )
}
