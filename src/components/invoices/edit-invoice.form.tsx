'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ErrorState, LoadingState } from '@/components/ui/load-state'
import { useGetInvoiceById } from '@/hooks/invoices/use-get-invoice-by-id'
import { useUpdateInvoice } from '@/hooks/invoices/use-update-invoice'
import { invoiceToFormValues } from '@/lib/invoice-to-form-values'
import { InvoiceFormValues } from '@/schemas/invoice.schema'
import InvoiceForm from './invoice.form'

interface EditInvoiceFormProps {
  invoiceId: string
}

export default function EditInvoiceForm({ invoiceId }: EditInvoiceFormProps) {
  const router = useRouter()
  const {
    data: invoice,
    isPending,
    isError,
    error,
  } = useGetInvoiceById(invoiceId)
  const { mutateAsync: updateInvoice, isPending: isUpdating } =
    useUpdateInvoice()

  const initialValues = useMemo(
    () => (invoice ? invoiceToFormValues(invoice) : undefined),
    [invoice],
  )

  const handleSubmit = async (values: InvoiceFormValues) => {
    await updateInvoice({ id: invoiceId, payload: values })
    router.push('/invoices')
  }

  if (isPending) {
    return <LoadingState message={`Loading invoice ${invoiceId}...`} />
  }

  if (isError || !initialValues) {
    return <ErrorState message={error?.message ?? 'Failed to load invoice.'} />
  }

  return (
    <InvoiceForm
      key={invoiceId}
      title={`Invoice ${invoiceId}`}
      submitLabel="Save Changes"
      submittingLabel="Saving..."
      isSubmitting={isUpdating}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  )
}
