import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  QueryConstraint,
  runTransaction,
  serverTimestamp,
  Timestamp,
  where,
} from 'firebase/firestore'
import { endOfDay, endOfMonth, startOfDay, startOfMonth } from 'date-fns'
import { z } from 'zod'
import { db } from '@/lib/firebase-client'
import { FilterType } from '@/schemas/filter.type'

export type CollectionName =
  | 'invoices'
  | 'quotations'
  | 'purchases'
  | 'delivery-notes'
  | 'maintenance-reports'

/** Returns a readable message from any thrown value. */
export function getErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback
}

/** Validates `payload` with `schema`, throwing one readable error on failure. */
export function parseOrThrow<S extends z.ZodType>(
  schema: S,
  payload: unknown,
): z.output<S> {
  const result = schema.safeParse(payload)

  if (!result.success) {
    throw new Error(
      result.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', '),
    )
  }

  return result.data
}

interface SequentialCounter {
  /** Document ID in the `counters` collection. */
  name: string
  /** Prefix of the generated ID, e.g. `INV` produces `INV-00042`. */
  prefix: string
  /**
   * Whether a missing counter may start from 1. Disable this when numbering
   * continues from an earlier system, so a lost counter fails loudly instead
   * of reissuing old numbers.
   */
  allowInitialize: boolean
}

/**
 * Creates a document whose ID comes from a sequential counter.
 *
 * Reserving the number and writing the document happen in one transaction,
 * so a failed write never leaves a gap, and an existing document is never
 * overwritten if the counter falls out of sync.
 */
export async function createWithSequentialId(
  collectionName: CollectionName,
  counter: SequentialCounter,
  data: DocumentData,
): Promise<{ id: string }> {
  const counterRef = doc(db, 'counters', counter.name)

  return runTransaction(db, async (transaction) => {
    const counterSnap = await transaction.get(counterRef)

    if (!counterSnap.exists() && !counter.allowInitialize) {
      throw new Error(
        `The "${counter.name}" counter is missing. Restore it before creating new records.`,
      )
    }

    const next = counterSnap.exists() ? Number(counterSnap.data().last) + 1 : 1

    if (!Number.isInteger(next) || next < 1) {
      throw new Error(`The "${counter.name}" counter is corrupted.`)
    }

    const id = `${counter.prefix}-${String(next).padStart(5, '0')}`
    const docRef = doc(db, collectionName, id)

    if ((await transaction.get(docRef)).exists()) {
      throw new Error(
        `${id} already exists. The "${counter.name}" counter is out of sync.`,
      )
    }

    transaction.set(counterRef, { last: next })
    transaction.set(docRef, { ...data, id, createdAt: serverTimestamp() })

    return { id }
  })
}

/** Fetches one document, throwing `notFoundMessage` if it does not exist. */
export async function getDocumentById<T>(
  collectionName: CollectionName,
  id: string,
  notFoundMessage: string,
): Promise<T> {
  const snap = await getDoc(doc(db, collectionName, id))

  if (!snap.exists()) {
    throw new Error(notFoundMessage)
  }

  return { id: snap.id, ...snap.data() } as T
}

/**
 * Lists a collection, newest first, optionally restricted to one day or
 * month by its `date` field. An incomplete filter lists everything.
 */
export async function getFilteredDocuments<T>(
  collectionName: CollectionName,
  filter: FilterType = { type: 'all' },
): Promise<T[]> {
  const range = getFilterRange(filter)
  const constraints: QueryConstraint[] = range
    ? [
        where('date', '>=', Timestamp.fromDate(range.start)),
        where('date', '<=', Timestamp.fromDate(range.end)),
        orderBy('date', 'desc'),
      ]
    : [orderBy('createdAt', 'desc')]

  const snap = await getDocs(
    query(collection(db, collectionName), ...constraints),
  )

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T)
}

function getFilterRange(filter: FilterType): { start: Date; end: Date } | null {
  if (filter.type === 'date' && filter.date) {
    return { start: startOfDay(filter.date), end: endOfDay(filter.date) }
  }

  if (filter.type === 'month' && filter.year && filter.month) {
    const month = new Date(filter.year, filter.month - 1)
    return { start: startOfMonth(month), end: endOfMonth(month) }
  }

  return null
}

export async function deleteDocumentById(
  collectionName: CollectionName,
  id: string,
): Promise<{ id: string }> {
  if (!id) throw new Error('Invalid id')
  await deleteDoc(doc(db, collectionName, id))
  return { id }
}
