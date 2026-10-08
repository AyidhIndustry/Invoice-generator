import { addCustomerAccountIfNew } from '@/features/accounts/add-customer-account'
import { db } from '@/lib/firebase-client'
import { parseOrThrow } from '@/lib/firestore'
import { CreateInvoiceDTO } from '@/schemas/invoice.schema'
import {
  deleteField,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'

export interface UpdateInvoiceInput {
  id: string
  payload: unknown
}

/**
 * Replaces the editable fields of an existing invoice.
 * The invoice number and creation time are never changed.
 */
export async function updateInvoice({ id, payload }: UpdateInvoiceInput) {
  if (!id) throw new Error('Invalid invoice id')

  // The invoice number is the document key and cannot be changed.
  const { dueDate, ...data } = parseOrThrow(
    CreateInvoiceDTO.omit({ id: true }),
    payload,
  )

  // updateDoc fails if the invoice no longer exists, unlike setDoc.
  await updateDoc(doc(db, 'invoices', id), {
    ...data,
    // Clearing the due date in the form removes it from the stored invoice.
    dueDate: dueDate ?? deleteField(),
    updatedAt: serverTimestamp(),
  })

  const customerAccount = await addCustomerAccountIfNew(data.customer)
  return { id, customerAccount }
}
