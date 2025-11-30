import z from "zod";
import { CompanySchema } from "./company.schema";

export const SellerSchema = CompanySchema.pick({
  address: true,
  email: true,
  VATNumber: true,
  CRNumber: true,
  phoneNumber: true,
})

export type Seller = z.infer<typeof SellerSchema>