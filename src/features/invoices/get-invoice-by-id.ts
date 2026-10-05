import { getDocumentById } from '@/lib/firestore'
import { Invoice } from '@/schemas/invoice.schema'

export function getInvoiceById(id: string) {
  return getDocumentById<Invoice>('invoices', id, 'Invoice not found')
}
