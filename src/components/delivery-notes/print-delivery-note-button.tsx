'use client'
import { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Button } from '@/components/ui/button'
import { Printer, Loader2 } from 'lucide-react'
import { DeliveryNote } from '@/schemas/delivery-note.schema'
import { DeliveryNotePrintable } from './deivery-note-printable'

export function PrintDeliveryNoteButton({ deliveryNote }: { deliveryNote: DeliveryNote }) {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [isReady, setIsReady] = useState(false)

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `${deliveryNote.id}`,
    preserveAfterPrint: true
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
        <DeliveryNotePrintable
          ref={contentRef}
          deliveryNote={deliveryNote}
          onReady={() => setIsReady(true)}
        />
      </div>

      <Button
        onClick={reactToPrintFn}
        size="sm"
        variant="outline"
        aria-label={`Print DeliveryNote ${deliveryNote.id}`}
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
