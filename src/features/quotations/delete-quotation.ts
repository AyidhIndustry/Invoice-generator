// lib/purchases/delete-purchase.ts
import { db } from '@/lib/firebase-client'
import { doc, deleteDoc } from 'firebase/firestore'

export async function deleteQuotation(id: string) {
  if (!id) throw new Error('Invalid id')
  await deleteDoc(doc(db, 'quotations', id))
  return { id }
}
