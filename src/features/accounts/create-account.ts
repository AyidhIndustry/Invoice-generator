import { createWithSequentialId, parseOrThrow } from '@/lib/firestore'
import { CreateAccountDTO } from '@/schemas/account.schema'

export async function createAccount(payload: unknown) {
  const data = parseOrThrow(CreateAccountDTO, payload)

  return createWithSequentialId(
    'accounts',
    { name: 'account', prefix: 'ACC', allowInitialize: true },
    data,
  )
}
