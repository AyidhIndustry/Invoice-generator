// lib/purchases/delete-purchase.ts
import { db } from '@/lib/firebase-client'
import { doc, deleteDoc } from 'firebase/firestore'

export async function deletePurchase(id: string) {
  if (!id) throw new Error('Invalid id')
  await deleteDoc(doc(db, 'purchases', id))
  return { id }
}
