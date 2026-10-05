import { deleteDocumentById } from '@/lib/firestore'

export function deleteDeliveryNote(id: string) {
  return deleteDocumentById('delivery-notes', id)
}
