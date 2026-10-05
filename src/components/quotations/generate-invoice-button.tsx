import { FileOutput } from 'lucide-react'
import { IconLinkButton } from '@/components/ui/icon-link-button'

export function GenerateInvoiceButton({
  quotationId,
}: {
  quotationId?: string
}) {
  if (!quotationId) return null

  return (
    <IconLinkButton
      href={`/invoices/create?quotationId=${encodeURIComponent(quotationId)}`}
      label={`Generate invoice from ${quotationId}`}
      icon={FileOutput}
    />
  )
}
