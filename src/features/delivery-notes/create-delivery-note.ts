import { createWithSequentialId, parseOrThrow } from '@/lib/firestore'
import { CreateDeliveryNoteDTO } from '@/schemas/delivery-note.schema'

export async function createDeliveryNote(payload: unknown) {
  const data = parseOrThrow(CreateDeliveryNoteDTO, payload)

  return createWithSequentialId(
    'delivery-notes',
    { name: 'deliveryNote', prefix: 'DEL', allowInitialize: true },
    data,
  )
}
