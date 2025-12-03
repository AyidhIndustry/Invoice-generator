import z from "zod"
import { CustomerSchema } from "./customer.schema"
import { PaymentTypeEnum } from "./enums/payment-type.enum"

export const DeliveryNoteSchema = z.object({
  id: z.string().optional(),
  invId: z.string().optional(),
  date: z.date(),
  dueDate: z.date(),
  customer: CustomerSchema,
  paymentType: PaymentTypeEnum,
  items: z
    .array(
      z.object({
        title: z.string().min(1, 'Item title is required'),
        quantity: z
          .number()
          .int('Item quantity must be an integer')
          .min(1, 'Quantity must be at least 1'),
      })
    )
    .min(1, 'Delivery note must contain at least one item'),
  driverDetails: z.string().optional(),
})

export type DeliveryNote = z.infer<typeof DeliveryNoteSchema>

export const CreateDeliveryNoteDTO = DeliveryNoteSchema.omit({
  id: true,
})

export type CreateDeliveryNoteDTOType= z.infer<typeof CreateDeliveryNoteDTO>
export const UpdateDeliveryNoteDTO = DeliveryNoteSchema.partial()

export type UpdateDeliveryNoteDTOType = z.infer<typeof UpdateDeliveryNoteDTO>