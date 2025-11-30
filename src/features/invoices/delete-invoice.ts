    import { db } from '@/lib/firebase-client'
import { doc, deleteDoc } from 'firebase/firestore'

export async function deleteInvoice(id: string) {
  if (!id) throw new Error('Invalid id')
  await deleteDoc(doc(db, 'invoices', id))
  return { id }
}
