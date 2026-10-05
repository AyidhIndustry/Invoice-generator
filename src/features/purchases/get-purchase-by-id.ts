import { getDocumentById } from '@/lib/firestore'
import { Purchase } from '@/schemas/purchase.schema'

export function getPurchaseById(id: string) {
  return getDocumentById<Purchase>('purchases', id, 'Purchase not found')
}
