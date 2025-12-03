import z from 'zod'
import { CustomerSchema } from './customer.schema'
import { SellerSchema } from './seller.schema'
import { ItemSchema } from './item.schema'

export const QuotationSchema = z.object({
  id: z.string().optional(),
  date: z.date().optional(),
  seller: SellerSchema.optional(),
  customer: CustomerSchema,
  subject: z.string().optional(),
  items: z.array(ItemSchema).min(1, 'Quotation must contain at least one item'),
  subTotal: z.number().min(0, 'Subtotal cannot be negative'),
  taxTotal: z.number().min(0, 'Tax total cannot be negative').optional(),
  total: z.number().min(0, 'Total cannot be negative'),
  details: z.string().optional(),
  createdAt: z.date().optional(),
})

export type Quotation = z.infer<typeof QuotationSchema>

export const CreateQuotationDTO = QuotationSchema.extend({
  id: z.string().optional(),
})
  .omit({ taxTotal: true, total: true, subTotal: true, seller: true })
  .extend({
    taxTotal: z.number().optional(),
    total: z.number().optional(),
    subTotal: z.number().optional(),
  })

export type CreateQuotationDTOType = z.infer<typeof CreateQuotationDTO>

export const UpdateQuotationDTO = CreateQuotationDTO.partial()
export type UpdateQuotationDTOType = z.infer<typeof UpdateQuotationDTO>
