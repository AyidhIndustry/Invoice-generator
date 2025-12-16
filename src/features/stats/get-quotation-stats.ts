import { Quarter } from '@/context/stat.context'
import { db } from '@/lib/firebase-client'
import { normalizeToDate } from '@/lib/normalize-dates'
import { getQuarterRange } from '@/lib/quarter'
import { collection, getDocs } from 'firebase/firestore'

export async function getQuotationStats(year: number, quarter: Quarter) {
  const { start, end } = getQuarterRange(year, quarter)
  const snap = await getDocs(collection(db, 'quotations'))
  let quotationCount = 0

  snap.forEach((doc) => {
    const data = doc.data()
    const createdAt = normalizeToDate(data?.createdAt)

    if (createdAt && createdAt >= start && createdAt < end) {
      quotationCount++
    }
  })

  return {
    quotationCount
  }
}
