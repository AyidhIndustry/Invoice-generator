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

  useEffect(() => {
    setMounted(true)
    return () => {
      if (printContainerRef.current && document.body.contains(printContainerRef.current)) {
        document.body.removeChild(printContainerRef.current)
      }
    }
  }, [])

  const handlePrint = async () => {
    setPrinting(true)

    try {
      // Create temporary container if it doesn't exist
      if (!printContainerRef.current) {
        const container = document.createElement('div')
        container.style.cssText = 'display:none;'
        document.body.appendChild(container)
        printContainerRef.current = container
      }

      // Wait for React to render into the container
      await new Promise(resolve => setTimeout(resolve, 300))

      // Get the rendered HTML
      const printContent = printContainerRef.current?.innerHTML || ''

      if (!printContent) {
        console.error('No print content found')
        setPrinting(false)
        return
      }

      // Get all stylesheet links and inline styles
      const styleLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .map(link => `<link rel="stylesheet" href="${(link as HTMLLinkElement).href}">`)
        .join('\n')

      const inlineStyles = Array.from(document.querySelectorAll('style'))
        .map(style => `<style>${style.innerHTML}</style>`)
        .join('\n')

      // Create iframe for printing
      const iframe = document.createElement('iframe')
      iframe.style.cssText = 'position:fixed;width:0;height:0;border:none;'
      document.body.appendChild(iframe)

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (!iframeDoc) {
        console.error('Could not access iframe document')
        setPrinting(false)
        return
      }

      // Write content to iframe
      iframeDoc.open()
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Quotation-${quotation.id}</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet">
            ${styleLinks}
            ${inlineStyles}
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
              
              .font-anton {
                font-family: 'Anton', sans-serif;
              }
              
              @page {
                size: A4 portrait;
                margin: 0;
              }
              
              @media print {
                html, body {
                  margin: 0;
                  padding: 0;
                  width: 100%;
                  height: 100%;
                }
                
                * {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
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

      // Wait for stylesheets to load
      await new Promise(resolve => {
        if (iframe.contentWindow) {
          iframe.contentWindow.addEventListener('load', resolve)
          setTimeout(resolve, 1500) // Fallback timeout
        } else {
          setTimeout(resolve, 1500)
        }
      })

      // Trigger print
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()

      // Clean up
      setTimeout(() => {
        if (iframe && document.body.contains(iframe)) {
          document.body.removeChild(iframe)
        }
        setPrinting(false)
      }, 1000)
    } catch (error) {
      console.error('Print error:', error)
      setPrinting(false)
    }
  }

  useEffect(() => {
    if (mounted && !printContainerRef.current) {
      const container = document.createElement('div')
      container.style.cssText = 'display:none;'
      document.body.appendChild(container)
      printContainerRef.current = container
    }
  }, [mounted])

  if (!mounted) {
    return (
      <Button size="sm" variant="outline" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
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