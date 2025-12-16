import { db } from "@/lib/firebase-client"
import { normalizeToDate } from "@/lib/normalize-dates"
import { getQuarterRange, Quarter } from "@/lib/quarter"
import { collection, getDocs } from "firebase/firestore"

export async function getInvoiceStats(
  year: number,
  quarter: Quarter,
) {
  const { start, end } = getQuarterRange(year, quarter)
  const snap = await getDocs(collection(db, 'invoices'))

  let invoiceCount = 0
  let totalTaxReceived = 0

  snap.forEach((doc) => {
    const data = doc.data()
    const createdAt = normalizeToDate(data?.createdAt)

    if (createdAt && createdAt >= start && createdAt < end) {
      invoiceCount++

      const taxRaw = data?.taxTotal ?? 0
      const tax =
        typeof taxRaw === 'number'
          ? taxRaw
          : parseFloat(String(taxRaw)) || 0

      totalTaxReceived += tax
    }
  })

  return {
    invoiceCount,
    totalTaxReceived: Math.round(totalTaxReceived * 100) / 100,
  }
}
