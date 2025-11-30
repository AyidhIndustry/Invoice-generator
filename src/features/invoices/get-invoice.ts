
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

export type InvoiceFilter =
  | { type: 'all' }
  | { type: 'date'; date: Date }    // exact day
  | { type: 'month'; year: number; month: number } // month: 1-12

export async function getAllInvoices(filter: InvoiceFilter = { type: 'all' }) {
  const colRef = collection(db, 'invoices')
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
    return d.data()
  })

  return items
}
