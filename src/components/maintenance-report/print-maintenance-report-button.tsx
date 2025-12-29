'use client'
import { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Button } from '@/components/ui/button'
import { Printer, Loader2 } from 'lucide-react'
import { MaintenanceReportPrintable } from './maintenance-report--printable'
import { MaintenanceReport } from '@/schemas/maintenance-report.schema'

export function PrintMaintenanceReportButton({
  report,
}: {
  report: MaintenanceReport
}) {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [isReady, setIsReady] = useState(false)

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `${report.id}`,
    preserveAfterPrint: true,
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
        <MaintenanceReportPrintable
          ref={contentRef}
          report={report}
          onReady={() => setIsReady(true)}
        />
      </div>

      <Button
        onClick={reactToPrintFn}
        size="sm"
        variant="outline"
        aria-label={`Print report ${report.id}`}
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
