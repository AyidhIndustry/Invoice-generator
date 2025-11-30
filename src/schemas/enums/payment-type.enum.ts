import { z } from "zod";

export const PaymentTypeEnum = z.enum([
  "CREDIT_CARD",
  "BANK_TRANSFER",
  "CASH",
]);

export const PaymentTypeErrorMessage =
  "Payment type must be one of 'CREDIT CARD', 'BANK TRANSFER', or 'CASH'";

export type PaymentType = z.infer<typeof PaymentTypeEnum>;
