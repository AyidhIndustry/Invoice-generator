'use client'
import { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Button } from '@/components/ui/button'
import { InvoicePrintable } from './invoice-printable'
import { Invoice } from '@/schemas/invoice.schema'
import { Printer, Loader2 } from 'lucide-react'

export function PrintInvoiceButton({ invoice }: { invoice: Invoice }) {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [isReady, setIsReady] = useState(false)

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `${invoice.id}`,
  })

  return (
   <>
      {/* Render invoice in DOM BUT it's hidden on screen via CSS (#invoice-print-container) */}
      <div id="invoice-print-container" aria-hidden={!isReady}>
        <InvoicePrintable
          ref={contentRef}
          invoice={invoice}
          onReady={() => setIsReady(true)}
        />
      </div>

      <Button
        onClick={reactToPrintFn}
        size="sm"
        variant="outline"
        aria-label={`Print invoice ${invoice.id}`}
        disabled={!isReady}
      >
        {!isReady ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Preparing…
          </>
        ) : (
          <Printer />
        )}
      </Button>
    </>
  )
}
