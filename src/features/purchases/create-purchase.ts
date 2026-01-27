// lib/purchases/create-purchase.ts
import { db } from '@/lib/firebase-client'
import { doc, setDoc, serverTimestamp, runTransaction } from 'firebase/firestore'
import { CreatePurchaseDTO } from '@/schemas/purchase.schema'

async function generatePurchaseId(): Promise<string> {
  const counterRef = doc(db, 'counters', 'purchase')

  const nextNumber = await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(counterRef)

    if (!snap.exists()) {
      transaction.set(counterRef, { last: 1 })
      return 1
    }

    const next = snap.data().last + 1
    transaction.update(counterRef, { last: next })
    return next
  })

  return `PUR-${String(nextNumber).padStart(5, '0')}`
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
    const id = await generatePurchaseId()

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
