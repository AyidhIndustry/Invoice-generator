import { parseToDate } from '@/lib/format-timestring'
import { Invoice, InvoiceFormValues } from '@/schemas/invoice.schema'

/**
 * Builds invoice form values from a stored invoice. Firestore returns dates
 * as Timestamps, so they are converted back to `Date` for the date pickers.
 */
export function invoiceToFormValues(invoice: Invoice): InvoiceFormValues {
  const { customer, items } = invoice

  return {
    date: parseToDate(invoice.date) ?? new Date(),
    dueDate: parseToDate(invoice.dueDate) ?? undefined,
    customer: {
      name: customer?.name ?? '',
      email: customer?.email ?? '',
      address: customer?.address ?? '',
      phoneNumber: customer?.phoneNumber ?? '',
      VATNumber: customer?.VATNumber ?? '',
    },
    items: (items ?? []).map(
      ({ title, quantity, unitPrice, taxAmount, unitTotal }) => ({
        title,
        quantity,
        unitPrice,
        taxAmount,
        unitTotal,
      }),
    ),
    subTotal: invoice.subTotal ?? 0,
    taxTotal: invoice.taxTotal ?? 0,
    total: invoice.total ?? 0,
    remarks: invoice.remarks ?? '',
    // Only include the link when present: Firestore rejects undefined values.
    ...(invoice.quotationId ? { quotationId: invoice.quotationId } : {}),
  }
}
