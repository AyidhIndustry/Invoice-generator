import { DeliveryNote } from '@/schemas/delivery-note.schema'
import { PaymentTypeEnum } from '@/schemas/enums/payment-type.enum'
import { Invoice } from '@/schemas/invoice.schema'

export const getEmptyDeliveryNoteValues = (): DeliveryNote => ({
  invId: '',
  date: new Date(),
  dueDate: new Date(),
  customer: {
    name: '',
    address: '',
    VATNumber: '',
    email: '',
  },
  paymentType: PaymentTypeEnum.enum.CASH,
  items: [{ title: '', quantity: 1 }],
  driverDetails: '',
})

/** The delivery note fields that are copied from an invoice. */
export type InvoiceDerivedDeliveryNoteFields = Pick<
  DeliveryNote,
  'invId' | 'customer' | 'items'
>

/**
 * Copies the invoice reference, customer and items into delivery note
 * fields. A delivery note only carries each item's title and quantity.
 */
export function invoiceToDeliveryNoteFields(
  invoice: Invoice,
): InvoiceDerivedDeliveryNoteFields {
  const { customer, items } = invoice

  return {
    invId: invoice.id,
    customer: {
      name: customer?.name ?? '',
      email: customer?.email ?? '',
      address: customer?.address ?? '',
      VATNumber: customer?.VATNumber ?? '',
    },
    items: items?.length
      ? items.map(({ title, quantity }) => ({
          title: title ?? '',
          quantity: Number(quantity) || 1,
        }))
      : [{ title: '', quantity: 1 }],
  }
}
