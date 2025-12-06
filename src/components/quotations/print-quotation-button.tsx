// PrintQuotationButton.tsx
'use client'
import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Printer, Loader2 } from 'lucide-react'
import { Quotation } from '@/schemas/quotation.schema'
import { QuotationPrintable } from './quotation-printable'

export function PrintQuotationButton({ quotation }: { quotation: Quotation }) {
  const [isReady, setIsReady] = useState(false)
  const [printing, setPrinting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const printContainerRef = useRef<HTMLDivElement | null>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    setMounted(true)
    // Create hidden container for print content
    const container = document.createElement('div')
    container.id = `print-container-${quotation.id}`
    container.style.cssText = 'position:absolute;left:-9999px;top:0;'
    document.body.appendChild(container)
    printContainerRef.current = container

    return () => {
      if (container && document.body.contains(container)) {
        document.body.removeChild(container)
      }
    }
  }, [quotation.id])

  const handlePrint = async () => {
    setPrinting(true)

    try {
      // Create iframe
      const iframe = document.createElement('iframe')
      iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:none;'
      document.body.appendChild(iframe)
      iframeRef.current = iframe

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (!iframeDoc) {
        console.error('Could not access iframe document')
        setPrinting(false)
        return
      }

      // Get the HTML content from the hidden container
      await new Promise(resolve => setTimeout(resolve, 100)) // Wait for render

      const printContent = printContainerRef.current?.innerHTML || ''

      // Write content to iframe
      iframeDoc.open()
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Quotation ${quotation.id}</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              @page {
                size: A4;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
              }
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `)
      iframeDoc.close()

      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 500))

      // Focus and print
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()

      // Clean up after print dialog closes
      setTimeout(() => {
        if (iframe && document.body.contains(iframe)) {
          document.body.removeChild(iframe)
        }
        iframeRef.current = null
        setPrinting(false)
      }, 1000)
    } catch (error) {
      console.error('Print error:', error)
      setPrinting(false)
    }
  }

  if (!mounted) {
    return (
      <Button size="sm" variant="outline" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading…
      </Button>
    )
  }

  return (
    <>
      {mounted && printContainerRef.current &&
        createPortal(
          <QuotationPrintable
            quotation={quotation}
            onReady={() => setIsReady(true)}
          />,
          printContainerRef.current
        )}

      <Button
        onClick={handlePrint}
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