import z from "zod";

export const ItemSchema = z.object({
  title: z.string().min(1, 'Item title is required'),
  quantity: z
    .number()
    .int('Item quantity must be an integer')
    .min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price cannot be negative'),
  taxAmount: z.number().min(0, 'Tax cannot be negative'),
  unitTotal: z.number().min(0, 'Item total cannot be negative'),
})

export type Item = z.infer<typeof ItemSchema>