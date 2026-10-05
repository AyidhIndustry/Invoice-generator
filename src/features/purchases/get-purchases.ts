import { getFilteredDocuments } from '@/lib/firestore'
import { parseToDate } from '@/lib/format-timestring'
import { FilterType } from '@/schemas/filter.type'
import { Purchase } from '@/schemas/purchase.schema'

type StoredPurchase = Omit<Purchase, 'date'> & { date?: unknown }

/** Lists purchases with dates converted and amounts coerced to numbers. */
export async function getAllPurchases(filter?: FilterType) {
  const purchases = await getFilteredDocuments<StoredPurchase>(
    'purchases',
    filter,
  )

  return purchases.map((purchase) => ({
    id: purchase.id,
    date: parseToDate(purchase.date) ?? undefined,
    description: purchase.description ?? '',
    subTotal: Number(purchase.subTotal ?? 0),
    taxTotal: Number(purchase.taxTotal ?? 0),
    total: Number(purchase.total ?? 0),
  }))
}

export type PurchaseListItem = Awaited<
  ReturnType<typeof getAllPurchases>
>[number]
