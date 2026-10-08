import z from 'zod'

export const AccountSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Company name is required'),
  VATNumber: z.string().optional(),
  address: z.string().optional(),
  email: z.union([z.email('Email must be valid'), z.literal('')]).optional(),
  phoneNumber: z.string().optional(),
  notes: z.string().optional(),
})

export type Account = z.infer<typeof AccountSchema>

export const CreateAccountDTO = AccountSchema
export type CreateAccountDTOType = z.infer<typeof CreateAccountDTO>
