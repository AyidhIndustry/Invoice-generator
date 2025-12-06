// PrintQuotationButton.tsx
'use client'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Printer, Loader2 } from 'lucide-react'
import { Quotation } from '@/schemas/quotation.schema'
import { QuotationPrintable } from './quotation-printable'

export function PrintQuotationButton({ quotation }: { quotation: Quotation }) {
  const [printing, setPrinting] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = async () => {
    setPrinting(true)
    
    // Check if mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
    if (isMobile) {
      // Use iframe method for mobile
      await printWithIframe()
    } else {
      // Use simple CSS method for desktop
      printWithCSS()
    }
  }

  const printWithCSS = () => {
    document.body.classList.add('print-mode')
    
    setTimeout(() => {
      window.print()
      
      setTimeout(() => {
        document.body.classList.remove('print-mode')
        setPrinting(false)
      }, 500)
    }, 100)
  }

  const printWithIframe = async () => {
    try {
      const printContent = printRef.current?.innerHTML
      if (!printContent) {
        setPrinting(false)
        return
      }

      const iframe = document.createElement('iframe')
      iframe.style.cssText = 'position:absolute;width:0;height:0;border:none;'
      document.body.appendChild(iframe)

      const iframeDoc = iframe.contentDocument
      if (!iframeDoc) {
        setPrinting(false)
        return
      }

      // Get all stylesheets
      const styles = Array.from(document.styleSheets)
        .map(sheet => {
          try {
            return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n')
          } catch {
            return ''
          }
        })
        .join('\n')

      iframeDoc.open()
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${quotation.id}</title>
            <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet">
             <style>
              ${styles} 
              html, body {
                width: 100%;
                height: 100%;
                margin: 0 !important;
                padding: 0 !important;
              }
              
              body > div {
                padding: 32px !important;
                width: 100% !important;
                box-sizing: border-box !important;
              }
              
              .font-anton {
                font-family: 'Anton', sans-serif;
              }
              
              @page {
                size: A4 portrait;
                margin: 0 !important;
              }
              
              @media print {
                * {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
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

      await new Promise(resolve => setTimeout(resolve, 1000))

      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()

      setTimeout(() => {
        document.body.removeChild(iframe)
        setPrinting(false)
      }, 1000)
    } catch (error) {
      console.error('Print error:', error)
      setPrinting(false)
    }
  }

  return (
    <>
      <div ref={printRef} className="quotation-printable-wrapper">
        <QuotationPrintable quotation={quotation} onReady={() => {}} />
      </div>

      <Button
        onClick={handlePrint}
        size="sm"
        variant="outline"
        aria-label={`${quotation.id}`}
        disabled={printing}
      >
        {printing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          </>
        ) : (
          <Printer className="h-4 w-4" />
        )}
      </Button>
    </>
  )
}