'use client'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Button } from '@/components/ui/button'
import { InvoicePrintable } from './invoice-printable'
import { Invoice } from '@/schemas/invoice.schema'
import { Printer } from 'lucide-react'

export function PrintInvoiceButton({ invoice }: { invoice: Invoice }) {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `${invoice.id}`,
  })

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: -9999,
          top: -9999,
          width: '210mm',
        }}
      >
        <InvoicePrintable ref={contentRef} invoice={invoice} />
      </div>

      <Button
        onClick={reactToPrintFn}
        size="sm"
        variant="outline"
        aria-label={`Print invoice ${invoice.id}`}
      >
        <Printer />
      </Button>
    </>
  )
}
