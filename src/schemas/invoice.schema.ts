import z from 'zod'
import { BankDetailsSchema } from './company.schema'
import { CustomerSchema } from './customer.schema'
import { SellerSchema } from './seller.schema'
import { Item, ItemSchema } from './item.schema'

export const InvoiceSchema = z.object({
  id: z.string(),
  date: z.date(),
  dueDate: z.date().optional(),
  seller: SellerSchema.optional(),
  customer: CustomerSchema,
  items: z.array(ItemSchema).min(1, 'Invoice must contain at least one item'),
  subTotal: z.number().min(0, 'Subtotal cannot be negative'),
  taxTotal: z.number().min(0, 'Tax total cannot be negative').optional(),
  total: z.number().min(0, 'Total cannot be negative'),
  remarks: z.string().optional(),
  bankDetails: BankDetailsSchema.optional(),
  /** ID of the quotation this invoice was generated from, if any. */
  quotationId: z.string().optional(),
})

export type Invoice = z.infer<typeof InvoiceSchema>

/** Shape of the values managed by the create-invoice form. */
export type InvoiceFormValues = {
  date: Date
  dueDate?: Date
  customer: {
    name: string
    email: string
    address: string
    phoneNumber: string
    VATNumber: string
  }
  items: Item[]
  subTotal: number
  taxTotal: number
  total: number
  remarks: string
  quotationId?: string
}
export const CreateInvoiceDTO = InvoiceSchema.extend({
  id: z.string().optional(),
})
  .omit({ taxTotal: true, total: true, subTotal: true, seller: true })
  .extend({
    taxTotal: z.number().optional(),
    total: z.number().optional(),
    subTotal: z.number().optional(),
  })

export type CreateInvoiceDTOType = z.infer<typeof CreateInvoiceDTO>

export const UpdateInvoiceDTO = CreateInvoiceDTO.partial()
export type UpdateInvoiceDTOType = z.infer<typeof UpdateInvoiceDTO>
