    import { db } from '@/lib/firebase-client'
import { doc, deleteDoc } from 'firebase/firestore'

export async function deleteDeliveryNote(id: string) {
  if (!id) throw new Error('Invalid id')
  await deleteDoc(doc(db, 'delivery-notes', id))
  return { id }
}
