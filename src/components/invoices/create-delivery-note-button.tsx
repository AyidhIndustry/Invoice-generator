import { Truck } from 'lucide-react'
import { IconLinkButton } from '@/components/ui/icon-link-button'

export function CreateDeliveryNoteButton({
  invoiceId,
}: {
  invoiceId?: string
}) {
  if (!invoiceId) return null

  return (
    <IconLinkButton
      href={`/delivery-notes/create?invoiceId=${encodeURIComponent(invoiceId)}`}
      label={`Create delivery note from ${invoiceId}`}
      icon={Truck}
    />
  )
}
