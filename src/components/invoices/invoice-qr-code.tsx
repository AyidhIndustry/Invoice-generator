// components/InvoiceQRCode.tsx
import React from 'react'
import QRCode from 'react-qr-code'
import { Invoice } from '@/schemas/invoice.schema'
import { buildInvoiceQrPayload, QRBuildOptions } from '@/lib/build-invoice-qr'

type Props = {
  invoice: Invoice
  size?: number
  showCaption?: boolean
  caption?: string
  payloadOptions?: QRBuildOptions
  className?: string
}

export default function InvoiceQRCode({
  invoice,
  size = 120,
  payloadOptions,
  className = '',
}: Props) {
  // build payload (JSON by default)
  const payload = buildInvoiceQrPayload(invoice, payloadOptions)
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="bg-white p-1 border border-black inline-block">
        <QRCode value={payload} size={size} />
      </div>
    </div>
  )
}
