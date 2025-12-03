// components/PrintableInvoice.tsx
'use client'

import { companyInfo } from '@/data/company-info'
import React, { forwardRef } from 'react'

type InvoiceType = any // replace with your Invoice type import

// forwardRef so react-to-print can access the DOM node
const PrintableInvoice = forwardRef<HTMLDivElement, { invoice: InvoiceType }>(function PrintableInvoice(
  { invoice },
  ref,
) {
  // handle Firestore-like timestamp or ISO string
  const date = invoice?.date
    ? invoice.date.seconds
      ? new Date(invoice.date.seconds * 1000)
      : new Date(invoice.date)
    : new Date()

  return (
    <div
      ref={ref}
      className="p-6 max-w-[800px] bg-sky-50 text-black"
      style={{ boxSizing: 'border-box', fontFamily: 'Inter, ui-sans-serif, system-ui' }}
    >
      <header className='flex justify-between items-start gap-2'>
        <div>
            <h1 className='text-primary text-xl font-bold'>Ayidh Industry Services</h1>
            <h3 className='font-semibold'>C.R.{companyInfo.CRNumber}</h3>
            <h3 className='font-semibold'>{companyInfo.website}</h3>
            <h3 className='font-semibold'>{companyInfo.email}</h3>
        </div>
        <div className='flex flex-col justify-center items-center h-full'>
            <img src={'/logo-dark.png'} className='h-16'/>
        </div>
        <div className='text-right'>
             <h1 className='text-primary text-xl font-bold'>آیدھ انڈسٹری سروسز</h1>
             <h3 className='font-semibold'>C.R.{companyInfo.CRNumber}</h3>
             <h3 className='font-semibold'>{companyInfo.website}</h3>
             <h3 className='font-semibold'>{companyInfo.email}</h3>
        </div>
      </header>
    </div>
  )
})

export default PrintableInvoice
