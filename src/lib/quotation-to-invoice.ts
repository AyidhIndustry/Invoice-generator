import { InvoiceFormValues } from '@/schemas/invoice.schema'
import { Quotation } from '@/schemas/quotation.schema'

/**
 * Builds create-invoice form values from an existing quotation.
 *
 * The invoice is dated today; item tax and totals are copied as a starting
 * point and recomputed by the invoice form with the current tax rate.
 */
export function quotationToInvoiceFormValues(
  quotation: Quotation,
): InvoiceFormValues {
  const { customer, items } = quotation

  return {
    date: new Date(),
    dueDate: undefined,
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
    subTotal: quotation.subTotal ?? 0,
    taxTotal: quotation.taxTotal ?? 0,
    total: quotation.total ?? 0,
    remarks: '',
    quotationId: quotation.id,
  }
}
