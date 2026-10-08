import { addCustomerAccountIfNew } from '@/features/accounts/add-customer-account'
import { createWithSequentialId, parseOrThrow } from '@/lib/firestore'
import { CreateQuotationDTO } from '@/schemas/quotation.schema'

export async function createQuotation(payload: unknown) {
  const data = parseOrThrow(CreateQuotationDTO, payload)

  const { id } = await createWithSequentialId(
    'quotations',
    { name: 'quotation', prefix: 'QUO', allowInitialize: true },
    data,
  )

  const customerAccount = await addCustomerAccountIfNew(data.customer)
  return { id, customerAccount }
}
