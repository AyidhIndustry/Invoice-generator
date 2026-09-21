// lib/build-invoice-qr.ts
import { Invoice } from '@/schemas/invoice.schema'
import { companyInfo } from '@/data/company-info'
import { toZatcaTimestamp } from './format-timestring'

export type QRBuildOptions = {
  asUrl?: boolean
  baseUrl?: string
}

function tlvField(tag: number, value: string): Uint8Array {
  const valueBytes = new TextEncoder().encode(value)
  if (valueBytes.length > 255) {
    throw new Error(`ZATCA QR field (tag ${tag}) exceeds 255 bytes`)
  }
  const field = new Uint8Array(2 + valueBytes.length)
  field[0] = tag
  field[1] = valueBytes.length
  field.set(valueBytes, 2)
  return field
}

function bytesToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64')
  }
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

const toAmountString = (value: unknown): string => {
  const num = typeof value === 'number' ? value : Number(value ?? 0)
  return (Number.isFinite(num) ? num : 0).toFixed(2)
}

/**
 * Builds the ZATCA Phase 1 (Generation phase) simplified tax invoice QR
 * payload: a Base64 string wrapping 5 TLV fields (seller name, seller VAT
 * number, invoice timestamp, total incl. VAT, VAT total).
 */
export function buildInvoiceQrPayload(
  invoice: Invoice,
  opts: QRBuildOptions = {},
): string {
  const { asUrl = false, baseUrl = '' } = opts

  if (asUrl && baseUrl) {
    const safeId = encodeURIComponent(String(invoice.id))
    return `${baseUrl.replace(/\/$/, '')}/${safeId}`
  }

  // Seller.name isn't part of SellerSchema (name is only ever set at the
  // company level), so the legal seller name always comes from companyInfo.
  const sellerName = companyInfo.name
  const sellerVatNumber = invoice.seller?.VATNumber || companyInfo.VATNumber || ''

  const fields = [
    tlvField(1, sellerName),
    tlvField(2, sellerVatNumber),
    tlvField(3, toZatcaTimestamp(invoice.date)),
    tlvField(4, toAmountString(invoice.total)),
    tlvField(5, toAmountString(invoice.taxTotal)),
  ]

  const totalLength = fields.reduce((sum, f) => sum + f.length, 0)
  const buffer = new Uint8Array(totalLength)
  let offset = 0
  for (const field of fields) {
    buffer.set(field, offset)
    offset += field.length
  }

  return bytesToBase64(buffer)
}
