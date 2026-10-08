import { getDocumentById } from '@/lib/firestore'
import { Account } from '@/schemas/account.schema'

export function getAccountById(id: string) {
  return getDocumentById<Account>('accounts', id, 'Account not found')
}
