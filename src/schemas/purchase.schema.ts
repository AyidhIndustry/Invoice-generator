import z from "zod";

export const PurchaseSchema = z.object({
  id: z.string().optional(),
  date: z.date(),
  description: z.string().optional(),
  subTotal: z.number().min(0, "Subtotal cannot be negative"),
  taxTotal: z.number().min(0, "Tax total cannot be negative"),
  total: z.number().min(0, "Total cannot be negative"),
});

export type Purchase = z.infer<typeof PurchaseSchema>;

export const CreatePurchaseDTO = PurchaseSchema.extend({
  id: z.string().optional(),
})
  .omit({ taxTotal: true, total: true, subTotal: true })
  .extend({
    taxTotal: z.number().optional(),
    total: z.number().optional(),
    subTotal: z.number().optional(),
  });

export type CreatePurchaseDTOType = z.infer<typeof CreatePurchaseDTO>;

export const UpdatePurchaseDTO = CreatePurchaseDTO.partial();
export type UpdatePurchaseDTOType = z.infer<typeof UpdatePurchaseDTO>;
