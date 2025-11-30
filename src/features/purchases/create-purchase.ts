// lib/purchases/create-purchase.ts
import { db } from '@/lib/firebase-client'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { CreatePurchaseDTO } from '@/schemas/purchase.schema'

function generatePurchaseId() {
  // generates exactly 8 digits (10000000–99999999)
  const num = Math.floor(10000000 + Math.random() * 90000000)
  return `PUR-${num}`
}

export async function createPurchase(payload: any) {
  try {
    // Validate again using Zod schema
    const result = CreatePurchaseDTO.safeParse(payload)

    if (!result.success) {
      const msg = result.error.issues
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ')
      throw new Error(msg)
    }

    const data = result.data

    // Generate random ID
    const id = generatePurchaseId()

    // Create doc with custom ID
    await setDoc(doc(db, 'purchases', id), {
      ...data,
      id,
      createdAt: serverTimestamp(),
    })

    return { id }
  } catch (err: any) {
    throw new Error(err.message ?? 'Failed to create purchase.')
  }
}
