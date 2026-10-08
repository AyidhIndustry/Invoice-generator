'use client'

import { useRouter } from 'next/navigation'
import { ErrorState, LoadingState } from '@/components/ui/load-state'
import { useGetAccountById } from '@/hooks/accounts/use-get-account-by-id'
import { useUpdateAccount } from '@/hooks/accounts/use-update-account'
import { CreateAccountDTOType } from '@/schemas/account.schema'
import AccountForm, { emptyAccount } from './account.form'

export default function EditAccountForm({ accountId }: { accountId: string }) {
  const router = useRouter()
  const {
    data: account,
    isPending,
    isError,
    error,
  } = useGetAccountById(accountId)
  const { mutateAsync: updateAccount, isPending: isUpdating } =
    useUpdateAccount()

  const handleSubmit = async (values: CreateAccountDTOType) => {
    await updateAccount({ id: accountId, payload: values })
    router.push('/accounts')
  }

  if (isPending) {
    return <LoadingState message={`Loading account ${accountId}...`} />
  }

  if (isError || !account) {
    return <ErrorState message={error?.message ?? 'Failed to load account.'} />
  }

  return (
    <AccountForm
      key={accountId}
      initialValues={{
        ...emptyAccount,
        name: account.name ?? '',
        VATNumber: account.VATNumber ?? '',
        address: account.address ?? '',
        email: account.email ?? '',
        phoneNumber: account.phoneNumber ?? '',
        notes: account.notes ?? '',
      }}
      submitLabel="Save Changes"
      submittingLabel="Saving..."
      isSubmitting={isUpdating}
      onSubmit={handleSubmit}
    />
  )
}
