import { QueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { CustomerAccountResult } from '@/features/accounts/add-customer-account'

/**
 * Tells the user when a document's customer was added to Accounts, when its
 * VAT number already belongs to another company, or when adding it failed,
 * and refreshes the account lists after an addition.
 */
export function notifyCustomerAccount(
  qc: QueryClient,
  result: CustomerAccountResult,
) {
  if (result.status === 'created') {
    toast.info(`New company "${result.name}" was added to Accounts.`)
    qc.invalidateQueries({ queryKey: ['accounts'] })
  } else if (result.status === 'vat-conflict') {
    toast.warning(
      `VAT number ${result.VATNumber} already belongs to "${result.account.name}" (${result.account.id}), so "${result.name}" was not added to Accounts. Check the customer details.`,
      { autoClose: false },
    )
  } else if (result.status === 'failed') {
    toast.warning(
      `"${result.name}" could not be added to Accounts: ${result.message} Add it from the Accounts page.`,
    )
  }
}
