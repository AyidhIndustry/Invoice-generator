'use client'

import { useCreateAccount } from '@/hooks/accounts/use-create-account'
import AccountForm from './account.form'

export const CreateAccountForm = () => {
  const { mutateAsync: createAccount, isPending } = useCreateAccount()

  return (
    <AccountForm
      submitLabel="Submit"
      submittingLabel="Creating..."
      isSubmitting={isPending}
      resetOnSuccess
      onSubmit={createAccount}
    />
  )
}
