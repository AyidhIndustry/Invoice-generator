import { Pencil } from 'lucide-react'
import { IconLinkButton } from '@/components/ui/icon-link-button'

export function EditAccountButton({ accountId }: { accountId?: string }) {
  if (!accountId) return null

  return (
    <IconLinkButton
      href={`/accounts/${encodeURIComponent(accountId)}/edit`}
      label={`Edit account ${accountId}`}
      icon={Pencil}
    />
  )
}
