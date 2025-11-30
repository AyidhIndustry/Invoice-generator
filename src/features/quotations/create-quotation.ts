// lib/purchases/create-purchase.ts
import { db } from '@/lib/firebase-client'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { CreateQuotationDTO } from '@/schemas/quotation.schema'

function generateQuotationId() {
  const num = Math.floor(10000000 + Math.random() * 90000000)
  return `QUO-${num}`
}

export async function createQuotation(payload: any) {
  try {
    // Validate again using Zod schema
    const result = CreateQuotationDTO.safeParse(payload)

    if (!result.success) {
      const msg = result.error.issues
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ')
      throw new Error(msg)
    }

    const data = result.data

    // Generate random ID
    const id = generateQuotationId()

    // Create doc with custom ID
    await setDoc(doc(db, 'quotations', id), {
      ...data,
      id,
      createdAt: serverTimestamp(),
    })

    return { id }
  } catch (err: any) {
    throw new Error(err.message ?? 'Failed to create quotation.')
  }
}
