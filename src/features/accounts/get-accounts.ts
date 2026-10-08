import { getDocumentsPage, getFilteredDocuments, PageCursor } from '@/lib/firestore'
import { Account } from '@/schemas/account.schema'

export function getAllAccounts() {
  return getFilteredDocuments<Account>('accounts')
}

export function getAccountsPage(cursor: PageCursor) {
  return getDocumentsPage<Account>('accounts', undefined, cursor)
}
