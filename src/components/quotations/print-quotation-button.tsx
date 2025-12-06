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
      setIsReady(true)
      await setPrinting(true)
    },
    onAfterPrint: () => setPrinting(false),
  })

  return (
    <>
      <div
        aria-hidden
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '210mm',
          height: '297mm', // A4 height
          overflow: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
          // Keep it in the viewport but invisible
          visibility: 'hidden',
        }}
      >
        <QuotationPrintable
          ref={contentRef}
          quotation={quotation}
          onReady={() => setIsReady(true)}
        />
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
          <Printer />
        )}
      </Button>
    </>
  )
}