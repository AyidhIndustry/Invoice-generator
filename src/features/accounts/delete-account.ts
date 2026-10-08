import { deleteDocumentById } from '@/lib/firestore'

export function deleteAccount(id: string) {
  return deleteDocumentById('accounts', id)
}
