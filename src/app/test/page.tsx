"use client"
import PrintableInvoice from '@/components/invoices/printable-invoice'
import { useGetInvoiceById } from '@/hooks/invoices/use-get-invoice-by-id'
import React from 'react'

const Page = () => {
    const {data:invoice} = useGetInvoiceById('INV-29062484')
  return (
    <PrintableInvoice invoice={invoice}/>
  )
}

export default Page