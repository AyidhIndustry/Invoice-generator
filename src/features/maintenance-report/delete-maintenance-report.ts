    import { db } from '@/lib/firebase-client'
import { doc, deleteDoc } from 'firebase/firestore'

export async function deleteMaintenanceReport(id: string) {
  if (!id) throw new Error('Invalid id')
  await deleteDoc(doc(db, 'maintenance-reports', id))
  return { id }
}
