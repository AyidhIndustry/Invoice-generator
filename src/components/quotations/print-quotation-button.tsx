// PrintQuotationButton.tsx
'use client'
import { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Button } from '@/components/ui/button'
import { Printer, Loader2 } from 'lucide-react'
import { Quotation } from '@/schemas/quotation.schema'
import { QuotationPrintable } from './quotation-printable'

export function PrintQuotationButton({ quotation }: { quotation: Quotation }) {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [printing, setPrinting] = useState(false)

  const reactToPrintFn = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `${quotation.id}`,
    onBeforePrint: async () => {
      setPrinting(true)
    },
    onAfterPrint: () => {
      setPrinting(false)
    },
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
        html, body {
          height: 100%;
          overflow: visible;
        }
      }
    `,
  })

  return (
    <>
      {/* Hidden container for print content */}
      <div style={{ display: 'none' }}>
        <div ref={contentRef}>
          <QuotationPrintable
            quotation={quotation}
            onReady={() => setIsReady(true)}
          />
        </div>
      </div>

      <Button
        onClick={reactToPrintFn}
        size="sm"
        variant="outline"
        aria-label={`Print quotation ${quotation.id}`}
        disabled={!isReady || printing}
      >
        {!isReady || printing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {printing ? 'Printing…' : 'Preparing…'}
          </>
        ) : (
          <Printer className="h-4 w-4" />
        )}
      </Button>
    </>
  )
}