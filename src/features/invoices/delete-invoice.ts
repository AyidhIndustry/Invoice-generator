import { deleteDocumentById } from '@/lib/firestore'

export function deleteInvoice(id: string) {
  return deleteDocumentById('invoices', id)
}
