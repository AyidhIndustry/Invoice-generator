import { db } from '@/lib/firebase-client'
import { CreateInvoiceDTO } from '@/schemas/invoice.schema'
import {
  doc,
  setDoc,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore'

async function generateInvoiceId(): Promise<string> {
  const counterRef = doc(db, 'counters', 'invoice')

  const nextNumber = await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(counterRef)

    if (!snap.exists()) {
      // fallback safety (won’t happen if you set last:17)
      transaction.set(counterRef, { last: 18 })
      return 18
    }

    const next = snap.data().last + 1
    transaction.update(counterRef, { last: next })
    return next
  })

  return `INV-${String(nextNumber).padStart(5, '0')}`
}

export async function createInvoice(payload: any) {
  try {
    // Validate again using Zod schema
    const result = CreateInvoiceDTO.safeParse(payload)

    if (!result.success) {
      const msg = result.error.issues
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ')
      throw new Error(msg)
    }

    const data = result.data

    // Generate random ID
    const id = await generateInvoiceId()

    // Create doc with custom ID
    await setDoc(doc(db, 'invoices', id), {
      ...data,
      id,
      createdAt: serverTimestamp(),
    })

    return { id }
  } catch (err: any) {
    throw new Error(err.message ?? 'Failed to create invoice.')
  }
}
