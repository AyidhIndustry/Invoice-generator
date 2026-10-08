import { addCustomerAccountIfNew } from '@/features/accounts/add-customer-account'
import { createWithSequentialId, parseOrThrow } from '@/lib/firestore'
import { CreateDeliveryNoteDTO } from '@/schemas/delivery-note.schema'

export async function createDeliveryNote(payload: unknown) {
  const data = parseOrThrow(CreateDeliveryNoteDTO, payload)

  const { id } = await createWithSequentialId(
    'delivery-notes',
    { name: 'deliveryNote', prefix: 'DEL', allowInitialize: true },
    data,
  )

  const customerAccount = await addCustomerAccountIfNew(data.customer)
  return { id, customerAccount }
}
