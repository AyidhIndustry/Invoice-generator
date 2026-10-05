import { createWithSequentialId, parseOrThrow } from '@/lib/firestore'
import { CreateInvoiceDTO } from '@/schemas/invoice.schema'

export async function createInvoice(payload: unknown) {
  // Firestore rejects undefined values, so drop an unset due date.
  const { dueDate, ...data } = parseOrThrow(CreateInvoiceDTO, payload)

  return createWithSequentialId(
    'invoices',
    // Invoice numbers continue from an earlier system, so the counter must
    // never silently restart from 1.
    { name: 'invoice', prefix: 'INV', allowInitialize: false },
    { ...data, ...(dueDate ? { dueDate } : {}) },
  )
}
