'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ErrorState, LoadingState } from '@/components/ui/load-state'
import { useGetAccountById } from '@/hooks/accounts/use-get-account-by-id'

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="mt-1 text-sm font-medium whitespace-pre-wrap break-words">
        {value || '—'}
      </div>
    </div>
  )
}

export default function AccountView({ accountId }: { accountId: string }) {
  const {
    data: account,
    isPending,
    isError,
    error,
  } = useGetAccountById(accountId)

  if (isPending) {
    return <LoadingState message={`Loading account ${accountId}...`} />
  }

  if (isError || !account) {
    return <ErrorState message={error?.message ?? 'Failed to load account.'} />
  }

  return (
    <Card>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Detail label="Account ID" value={account.id} />
        <Detail label="Company Name" value={account.name} />
        <Detail label="VAT Number" value={account.VATNumber} />
        <Detail label="Phone Number" value={account.phoneNumber} />
        <Detail label="Email" value={account.email} />
        <div className="md:col-span-2">
          <Detail label="Address" value={account.address} />
        </div>
        <div className="md:col-span-2">
          <Detail label="Additional Notes" value={account.notes} />
        </div>
      </CardContent>
    </Card>
  )
}
