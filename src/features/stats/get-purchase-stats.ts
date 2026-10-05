import { db } from '@/lib/firebase-client'
import { parseToDate } from '@/lib/format-timestring'
import { getQuarterRange, Quarter } from '@/lib/quarter'
import { getDocs, collection } from 'firebase/firestore'

export async function getPurchaseStats(year: number, quarter: Quarter) {
  const { start, end } = getQuarterRange(year, quarter)
  const snap = await getDocs(collection(db, 'purchases'))

  let purchaseCount = 0
  let totalTaxPaid = 0

  snap.forEach((doc) => {
    const data = doc.data()
    const createdAt = parseToDate(data?.createdAt)

    if (createdAt && createdAt >= start && createdAt < end) {
      purchaseCount++

      const taxRaw = data?.taxTotal ?? 0
      const tax =
        typeof taxRaw === 'number' ? taxRaw : parseFloat(String(taxRaw)) || 0

      totalTaxPaid += tax
    }
  })

  return {
    purchaseCount,
    totalTaxPaid: Math.round(totalTaxPaid * 100) / 100,
  }
}
