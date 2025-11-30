import { db } from '@/lib/firebase-client'
import { CreateInvoiceDTO } from '@/schemas/invoice.schema'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'


function generateInvoiceId() {
  // generates exactly 8 digits (10000000–99999999)
  const num = Math.floor(10000000 + Math.random() * 90000000)
  return `INV-${num}`
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
    const id = generateInvoiceId()

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
