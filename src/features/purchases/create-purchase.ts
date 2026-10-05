import { createWithSequentialId, parseOrThrow } from '@/lib/firestore'
import { CreatePurchaseDTO } from '@/schemas/purchase.schema'

export async function createPurchase(payload: unknown) {
  const data = parseOrThrow(CreatePurchaseDTO, payload)

  return createWithSequentialId(
    'purchases',
    { name: 'purchase', prefix: 'PUR', allowInitialize: true },
    data,
  )
}
