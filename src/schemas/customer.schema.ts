import z from "zod";

export const CustomerSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  email: z.string('Customer email must be valid').optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  VATNumber: z.string().optional(),
})

export type Customer = z.infer<typeof CustomerSchema>