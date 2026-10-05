import { db } from '@/lib/firebase-client'
import { parseToDate } from '@/lib/format-timestring'
import { getQuarterRange, Quarter } from '@/lib/quarter'
import { collection, getDocs } from 'firebase/firestore'

export async function getQuotationStats(year: number, quarter: Quarter) {
  const { start, end } = getQuarterRange(year, quarter)
  const snap = await getDocs(collection(db, 'quotations'))
  let quotationCount = 0

  snap.forEach((doc) => {
    const data = doc.data()
    const createdAt = parseToDate(data?.createdAt)

    if (createdAt && createdAt >= start && createdAt < end) {
      quotationCount++
    }
  })

  return {
    quotationCount,
  }
}
