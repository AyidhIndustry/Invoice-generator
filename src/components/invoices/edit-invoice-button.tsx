import { Pencil } from 'lucide-react'
import { IconLinkButton } from '@/components/ui/icon-link-button'

export function EditInvoiceButton({ invoiceId }: { invoiceId?: string }) {
  if (!invoiceId) return null

  return (
    <IconLinkButton
      href={`/invoices/${encodeURIComponent(invoiceId)}/edit`}
      label={`Edit invoice ${invoiceId}`}
      icon={Pencil}
    />
  )
}
