import { createWithSequentialId, parseOrThrow } from '@/lib/firestore'
import { CreateQuotationDTO } from '@/schemas/quotation.schema'

export async function createQuotation(payload: unknown) {
  const data = parseOrThrow(CreateQuotationDTO, payload)

  return createWithSequentialId(
    'quotations',
    { name: 'quotation', prefix: 'QUO', allowInitialize: true },
    data,
  )
}
