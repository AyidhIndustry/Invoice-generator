'use client'

import { useCreateInvoice } from '@/hooks/invoices/use-create-invoice'
import { InvoiceFormValues } from '@/schemas/invoice.schema'
import InvoiceForm, { getEmptyInvoiceFormValues } from './invoice.form'

interface CreateInvoiceFormProps {
  /** Prefills the form, e.g. when generating an invoice from a quotation. */
  initialValues?: InvoiceFormValues
  /** Called with the new invoice ID after it is created successfully. */
  onCreated?: (invoiceId: string) => void
}

export default function CreateInvoiceForm({
  initialValues,
  onCreated,
}: CreateInvoiceFormProps = {}) {
  const { mutateAsync: createInvoice, isPending } = useCreateInvoice()

  const handleSubmit = async (values: InvoiceFormValues) => {
    const { id } = await createInvoice(values)
    onCreated?.(id)
  }

  return (
    <InvoiceForm
      title="New Invoice"
      submitLabel="Create Invoice"
      submittingLabel="Creating..."
      isSubmitting={isPending}
      initialValues={initialValues ?? getEmptyInvoiceFormValues()}
      onSubmit={handleSubmit}
    />
  )
}
