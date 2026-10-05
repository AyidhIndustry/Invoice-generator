import { deleteDocumentById } from '@/lib/firestore'

export function deleteQuotation(id: string) {
  return deleteDocumentById('quotations', id)
}
