'use client'

import { useRouter } from 'next/navigation'
import { ErrorState, LoadingState } from '@/components/ui/load-state'
import { useGetInvoiceById } from '@/hooks/invoices/use-get-invoice-by-id'
import DeliveryNoteForm from './create-delivery-note.form'

interface CreateDeliveryNoteFromInvoiceProps {
  invoiceId: string
}

export default function CreateDeliveryNoteFromInvoice({
  invoiceId,
}: CreateDeliveryNoteFromInvoiceProps) {
  const router = useRouter()
  const {
    data: invoice,
    isPending,
    isError,
    error,
  } = useGetInvoiceById(invoiceId)

  if (isPending) {
    return <LoadingState message={`Loading invoice ${invoiceId}...`} />
  }

  if (isError || !invoice) {
    return <ErrorState message={error?.message ?? 'Failed to load invoice.'} />
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Prefilled from invoice{' '}
        <span className="font-medium text-foreground">{invoiceId}</span>. Review
        the details before creating the delivery note.
      </p>
      <DeliveryNoteForm
        key={invoiceId}
        initialInvoice={invoice}
        onCreated={() => router.push('/delivery-notes')}
      />
    </div>
  )
}
