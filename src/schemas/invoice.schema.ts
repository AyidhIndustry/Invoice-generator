import z from 'zod'
import { CompanySchema } from './company.schema'
import { CustomerSchema } from './customer.schema'
import { SellerSchema } from './seller.schema'
import { PaymentTypeEnum } from './enums/payment-type.enum'
import { ItemSchema } from './item.schema'

const BankDetailsSchema = (CompanySchema.shape as any)
  .bankDetails as z.ZodObject<any>

export const InvoiceSchema = z.object({
  id: z.string(),
  date: z.date(),
  seller: SellerSchema.optional(),
  customer: CustomerSchema,
  items: z.array(ItemSchema).min(1, 'Invoice must contain at least one item'),
  subTotal: z.number().min(0, 'Subtotal cannot be negative'),
  taxTotal: z.number().min(0, 'Tax total cannot be negative').optional(),
  total: z.number().min(0, 'Total cannot be negative'),
  remarks: z.string().optional(),
  bankDetails: BankDetailsSchema.optional(),
})

export type Invoice = z.infer<typeof InvoiceSchema>
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
