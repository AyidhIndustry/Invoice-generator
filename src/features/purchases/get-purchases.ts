import { getDocumentsPage, PageCursor } from '@/lib/firestore'
import { parseToDate } from '@/lib/format-timestring'
import { FilterType } from '@/schemas/filter.type'
import { Purchase } from '@/schemas/purchase.schema'

type StoredPurchase = Omit<Purchase, 'date'> & { date?: unknown }

/** Converts a stored purchase's date and coerces its amounts to numbers. */
function toPurchaseListItem(purchase: StoredPurchase) {
  return {
    id: purchase.id,
    date: parseToDate(purchase.date) ?? undefined,
    description: purchase.description ?? '',
    subTotal: Number(purchase.subTotal ?? 0),
    taxTotal: Number(purchase.taxTotal ?? 0),
    total: Number(purchase.total ?? 0),
  }
}

export type PurchaseListItem = ReturnType<typeof toPurchaseListItem>

export async function getPurchasesPage(filter: FilterType, cursor: PageCursor) {
  const page = await getDocumentsPage<StoredPurchase>(
    'purchases',
    filter,
    cursor,
  )

  return { ...page, items: page.items.map(toPurchaseListItem) }
}
