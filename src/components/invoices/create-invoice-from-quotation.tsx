'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ErrorState, LoadingState } from '@/components/ui/load-state'
import { useGetQuotationById } from '@/hooks/quotations/use-get-quotation-by-id'
import { quotationToInvoiceFormValues } from '@/lib/quotation-to-invoice'
import CreateInvoiceForm from './create-invoice.form'

interface CreateInvoiceFromQuotationProps {
  quotationId: string
}

export default function CreateInvoiceFromQuotation({
  quotationId,
}: CreateInvoiceFromQuotationProps) {
  const router = useRouter()
  const {
    data: quotation,
    isPending,
    isError,
    error,
  } = useGetQuotationById(quotationId)

  const initialValues = useMemo(
    () => (quotation ? quotationToInvoiceFormValues(quotation) : undefined),
    [quotation],
  )

  if (isPending) {
    return <LoadingState message={`Loading quotation ${quotationId}...`} />
  }

  if (isError || !initialValues) {
    return (
      <ErrorState message={error?.message ?? 'Failed to load quotation.'} />
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Prefilled from quotation{' '}
        <span className="font-medium text-foreground">{quotationId}</span>.
        Review the details before creating the invoice.
      </p>
      <CreateInvoiceForm
        key={quotationId}
        initialValues={initialValues}
        onCreated={() => router.push('/invoices')}
      />
    </div>
  )
}
