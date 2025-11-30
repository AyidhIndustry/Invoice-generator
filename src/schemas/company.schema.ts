import z from 'zod'

export const CompanySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  address: z.string().optional(),
  email: z.email('Company email must be valid').optional(),
  phoneNumber: z.string().optional(),
  VATNumber: z.string().optional(),
  CRNumber: z.string().optional(),

  bankDetails: z.object({
    bankName: z.string().min(1, 'Bank name is required'),
    IBAN: z.string().min(1, 'IBAN is required'),
    accountNumber: z.string().min(1, 'Account number is required'),
  }).optional(),
})

export type Company = z.infer<typeof CompanySchema>
