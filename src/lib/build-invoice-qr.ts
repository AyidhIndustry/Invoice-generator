// lib/build-invoice-qr.ts
import { Invoice } from '@/schemas/invoice.schema'
import { formatTimestamp } from './format-timestring'

export type QRBuildOptions = {
  asUrl?: boolean
  baseUrl?: string
  minify?: boolean
}

export function buildInvoiceQrPayload(
  invoice: Invoice,
  opts: QRBuildOptions = {},
): string {
  const { asUrl = false, baseUrl = '', minify = true } = opts

  if (asUrl && baseUrl) {
    const safeId = encodeURIComponent(String(invoice.id))
    return `${baseUrl.replace(/\/$/, '')}/${safeId}`
  }
  const payload = {
    id: invoice.id,
    date: formatTimestamp(invoice.date),
    subTotal:
      typeof invoice.subTotal === 'number'
        ? invoice.subTotal
        : Number(invoice.subTotal ?? 0),
    taxTotal:
      typeof invoice.taxTotal === 'number'
        ? invoice.taxTotal
        : Number(invoice.taxTotal ?? 0),
    total:
      typeof invoice.total === 'number'
        ? invoice.total
        : Number(invoice.total ?? 0),
    customer: {
      name: invoice.customer?.name ?? '',
      VATNumber: invoice.customer?.VATNumber ?? '',
      phone: invoice.customer?.phoneNumber ?? '',
    },
  }

  return minify ? JSON.stringify(payload) : JSON.stringify(payload, null, 2)
}
