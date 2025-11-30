import { db } from '@/lib/firebase-client'
import { CreateDeliveryNoteDTO } from '@/schemas/delivery-note.schema'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'


function generateDeliveryNoteId() {
  // generates exactly 8 digits (10000000–99999999)
  const num = Math.floor(10000000 + Math.random() * 90000000)
  return `DEL-${num}`
}

export async function createDeliveryNote(payload: any) {
  try {
    // Validate again using Zod schema
    const result = CreateDeliveryNoteDTO.safeParse(payload)

    if (!result.success) {
      const msg = result.error.issues
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ')
      throw new Error(msg)
    }

    const data = result.data

    // Generate random ID
    const id = generateDeliveryNoteId()

    // Create doc with custom ID
    await setDoc(doc(db, 'delivery-notes', id), {
      ...data,
      id,
      createdAt: serverTimestamp(),
    })

    return { id }
  } catch (err: any) {
    throw new Error(err.message ?? 'Failed to create delivery note.')
  }
}
