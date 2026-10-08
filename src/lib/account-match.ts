import { Account } from '@/schemas/account.schema'
import { Customer } from '@/schemas/customer.schema'

/**
 * Matching key for a company name: letters and digits only, lowercased, so
 * "Acme Co." and "ACME  Co" are the same company.
 */
export function accountNameKey(name: string | undefined): string {
  return (name ?? '').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')
}

/**
 * Matching key for a VAT number, ignoring spaces, dashes and case.
 * Blank and all-zero placeholders such as 300000000000003 return '' so they
 * never match, since many unrelated customers share them.
 */
export function accountVatKey(vat: string | undefined): string {
  const key = (vat ?? '').replace(/[\s-]/g, '').toUpperCase()
  return /^3?0*3?$/.test(key) ? '' : key
}

export type AccountMatch =
  /** A saved account has the same VAT number and company name. */
  | { type: 'same'; account: Account }
  /** A saved account has the same VAT number under a different name. */
  | { type: 'vat-conflict'; account: Account }
  /** No saved account is this company. */
  | { type: 'none' }

/**
 * Finds the saved account for `customer` by VAT number.
 *
 * A customer without a usable VAT number is matched by company name instead,
 * so picking a saved company that has no VAT number never duplicates it.
 */
export function matchAccount(
  customer: Customer,
  accounts: Account[],
): AccountMatch {
  const nameKey = accountNameKey(customer.name)
  const vatKey = accountVatKey(customer.VATNumber)

  if (vatKey) {
    const account = accounts.find((a) => accountVatKey(a.VATNumber) === vatKey)
    if (!account) return { type: 'none' }
    return accountNameKey(account.name) === nameKey
      ? { type: 'same', account }
      : { type: 'vat-conflict', account }
  }

  const account = accounts.find((a) => accountNameKey(a.name) === nameKey)
  return account ? { type: 'same', account } : { type: 'none' }
}
