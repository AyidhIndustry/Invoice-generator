import z from 'zod'
import { matchAccount } from '@/lib/account-match'
import { getErrorMessage } from '@/lib/firestore'
import { CreateAccountDTOType } from '@/schemas/account.schema'
import { Customer } from '@/schemas/customer.schema'
import { createAccount } from './create-account'
import { getAllAccounts } from './get-accounts'

/** What happened when a document's customer was checked against Accounts. */
export type CustomerAccountResult =
  | { status: 'existing' }
  | { status: 'created'; id: string; name: string }
  /** Not created: the VAT number belongs to an account with another name. */
  | {
      status: 'vat-conflict'
      name: string
      VATNumber: string
      account: { id: string; name: string }
    }
  | { status: 'failed'; name: string; message: string }

/**
 * Adds the customer of a saved document to Accounts unless an account with
 * the same VAT number exists (see `matchAccount`). A VAT number saved under a
 * different company name is reported as a conflict instead of creating a
 * second account for it.
 *
 * Never throws: the document is already saved by the time this runs, so a
 * failure here is reported in the result instead of failing the save, which
 * would invite a retry that creates the document twice.
 */
export async function addCustomerAccountIfNew(
  customer: Customer,
): Promise<CustomerAccountResult> {
  const name = customer.name.trim()

  try {
    // Read fresh accounts rather than the cached list, so an account added
    // moments ago (e.g. in another tab) is not created twice.
    const accounts = await getAllAccounts()
    const match = matchAccount(customer, accounts)

    if (match.type === 'same') return { status: 'existing' }
    if (match.type === 'vat-conflict') {
      return {
        status: 'vat-conflict',
        name,
        VATNumber: customer.VATNumber?.trim() ?? '',
        account: { id: match.account.id ?? '', name: match.account.name },
      }
    }

    const { id } = await createAccount(customerToAccount(customer))
    return { status: 'created', id, name }
  } catch (err) {
    return {
      status: 'failed',
      name,
      message: getErrorMessage(err, 'Could not create the account.'),
    }
  }
}

/**
 * Account fields from a customer, trimmed, with empty values left out since
 * Firestore rejects undefined. An email the account form would reject is
 * dropped rather than blocking the account.
 */
function customerToAccount(customer: Customer): CreateAccountDTOType {
  const account: CreateAccountDTOType = { name: customer.name.trim() }

  const optional = {
    VATNumber: customer.VATNumber,
    address: customer.address,
    phoneNumber: customer.phoneNumber,
  }
  for (const [key, value] of Object.entries(optional)) {
    const trimmed = value?.trim()
    if (trimmed) account[key as keyof typeof optional] = trimmed
  }

  const email = customer.email?.trim()
  if (email && z.email().safeParse(email).success) account.email = email

  return account
}
