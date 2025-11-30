// lib/purchases/get-purchases.ts
import { db } from '@/lib/firebase-client'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  Query,
} from 'firebase/firestore'
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns'

export type PurchasesFilter =
  | { type: 'all' }
  | { type: 'date'; date: Date }    // exact day
  | { type: 'month'; year: number; month: number } // month: 1-12

export async function getAllPurchases(filter: PurchasesFilter = { type: 'all' }) {
  const colRef = collection(db, 'purchases')
  let q: Query = query(colRef, orderBy('createdAt', 'desc'))

  if (filter.type === 'date') {
    const start = startOfDay(filter.date)
    const end = endOfDay(filter.date)
    q = query(colRef, where('date', '>=', Timestamp.fromDate(start)), where('date', '<=', Timestamp.fromDate(end)), orderBy('date', 'desc'))
  } else if (filter.type === 'month') {
    const start = startOfMonth(new Date(filter.year, filter.month - 1))
    const end = endOfMonth(new Date(filter.year, filter.month - 1))
    q = query(colRef, where('date', '>=', Timestamp.fromDate(start)), where('date', '<=', Timestamp.fromDate(end)), orderBy('date', 'desc'))
  }

  const snap = await getDocs(q)
  const items = snap.docs.map((d) => {
    const raw = d.data()
    // normalize date to JS Date if firestore Timestamp
    const dateField = raw.date && (raw.date as any).toDate ? (raw.date as any).toDate() : raw.date
    return {
      id: raw.id ?? d.id,
      date: dateField ? new Date(dateField) : undefined,
      description: raw.description ?? '',
      subTotal: Number(raw.subTotal ?? 0),
      taxTotal: Number(raw.taxTotal ?? 0),
      total: Number(raw.total ?? 0),
      _raw: raw,
    }
  })

  return items
}
