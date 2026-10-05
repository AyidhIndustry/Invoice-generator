import { deleteDocumentById } from '@/lib/firestore'

export function deletePurchase(id: string) {
  return deleteDocumentById('purchases', id)
}
