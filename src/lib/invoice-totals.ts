import { Item } from '@/schemas/item.schema'

/** VAT rate in percent, from `NEXT_PUBLIC_TAX`. Defaults to 0 if unset. */
export const TAX_PERCENT = (() => {
  const n = Number(process.env.NEXT_PUBLIC_TAX ?? 0)
  return Number.isFinite(n) ? n : 0
})()

const round2 = (n: number) => Number(n.toFixed(2))

/** Treats empty or invalid numeric input (NaN) as 0. */
const toAmount = (value: unknown) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

export interface InvoiceTotals {
  items: Item[]
  subTotal: number
  taxTotal: number
  total: number
}

/**
 * Computes each item's net total and tax, and the invoice totals, from
 * quantities and unit prices. Every amount is rounded to 2 decimals.
 */
export function computeInvoiceTotals(
  items: ReadonlyArray<Partial<Item>>,
  taxPercent: number = TAX_PERCENT,
): InvoiceTotals {
  const computedItems = items.map((item) => {
    const quantity = toAmount(item.quantity)
    const unitPrice = toAmount(item.unitPrice)
    const unitTotal = round2(quantity * unitPrice)

    return {
      title: item.title ?? '',
      quantity,
      unitPrice,
      unitTotal,
      taxAmount: round2((unitTotal * taxPercent) / 100),
    }
  })

  const subTotal = round2(computedItems.reduce((s, it) => s + it.unitTotal, 0))
  const taxTotal = round2(computedItems.reduce((s, it) => s + it.taxAmount, 0))

  return {
    items: computedItems,
    subTotal,
    taxTotal,
    total: round2(subTotal + taxTotal),
  }
}
