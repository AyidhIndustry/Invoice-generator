import { db } from '@/lib/firebase-client'
import { parseOrThrow } from '@/lib/firestore'
import { CreateAccountDTO } from '@/schemas/account.schema'
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'

export interface UpdateAccountInput {
  id: string
  payload: unknown
}

/** Replaces the editable fields of an existing account. */
export async function updateAccount({ id, payload }: UpdateAccountInput) {
  if (!id) throw new Error('Invalid account id')

  // The account ID is the document key and cannot be changed.
  const data = parseOrThrow(CreateAccountDTO.omit({ id: true }), payload)

  // updateDoc fails if the account no longer exists, unlike setDoc.
  await updateDoc(doc(db, 'accounts', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })

  return { id }
}
