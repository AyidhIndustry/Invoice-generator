// components/InvoicePrintable.tsx
import { companyInfo } from '@/data/company-info'
import { formatTimestamp } from '@/lib/format-timestring'
import { convertSAR } from '@/lib/number-to-words'
import { DeliveryNote } from '@/schemas/delivery-note.schema'
import React, { forwardRef, useEffect } from 'react'

type Props = {
  deliveryNote?: DeliveryNote | null
  onReady: () => void
}

const nf = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const DeliveryNotePrintable = forwardRef<HTMLDivElement, Props>(
  ({ deliveryNote, onReady }, ref) => {
    useEffect(() => {
      onReady?.()
    }, [])

    if (!deliveryNote) return null

    const items = deliveryNote.items ?? []

    return (
      <div ref={ref} className="p-8">
        <section className="flex justify-between gap-4">
          <div className="font-anton flex flex-col">
            <h1 className="text-2xl font-semibold text-primary">
              Ayidh Industry Services
            </h1>
            <h3 className="">C.R.{companyInfo.CRNumber}</h3>
            <a href={companyInfo.website}>{companyInfo.website}</a>
            <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a>
          </div>

          <div className="flex justify-center items-center">
            {/* If you use next/image you can improve optimization, but <img> is fine for printing */}
            <img src={'/logo-dark.png'} className="h-20" alt="logo" />
          </div>

          <div className="font-anton flex flex-col gap-1 items-end">
            <h1 className="text-2xl font-semibold text-primary">
              خدمة صناعة عايض
            </h1>
            <h3 className="">C.R.{companyInfo.CRNumber}</h3>
            <a href={companyInfo.website}>{companyInfo.website}</a>
            <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a>
          </div>
        </section>

        <hr className="h-0.5 bg-yellow-400 my-1" />

        <div className="bg-gray-200 p-2 text-center mb-1">
          <h3 className='text-lg font-semibold'>
           Delivery Note
          </h3>
        </div>
        <table className="w-full border-collapse border border-black text-xs mb-1">
          <colgroup>
            <col className="w-[15%]" />
            <col className="w-[35%]" />
            <col className="w-[15%]" />
            <col className="w-[35%]" />
          </colgroup>
          <thead>
            <tr className="bg-gray-200">
              <th
                className="border border-black p-1 text-center align-top font-semibold "
                colSpan={2}
              >
                Seller / البائع
              </th>
              <th
                className="border border-black p-1 text-center align-top font-semibold "
                colSpan={2}
              >
                Customer / العميل
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-1 text-left align-top font-semibold">
                Quote No
                <br /> رقم الإقتباس
              </td>
              <td className="border border-black p-1 text-left">
                {deliveryNote.id}
              </td>
              <td className="border border-black p-1 text-left align-top font-semibold">
                Name
                <br />
                اسم
              </td>
              <td className="border border-black p-1 text-left">
                {deliveryNote.customer?.name ?? ''}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1 text-left align-top font-semibold">
                Date
                <br /> التاريخ
              </td>
              <td className="border border-black p-1 text-left">
                {formatTimestamp(deliveryNote.date)}
              </td>
              <td className="border border-black p-1 text-left align-top font-semibold">
                VAT
                <br />
                رقم ضريبى
              </td>
              <td className="border border-black p-1 text-left">
                {deliveryNote.customer?.VATNumber ?? ''}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1 text-left align-top font-semibold">
                Address
                <br /> عنوان
              </td>
              <td className="border border-black p-1 text-left">
                {companyInfo.address}
              </td>
              <td className="border border-black p-1 text-left align-top font-semibold">
                Address
                <br /> عنوان
              </td>
              <td className="border border-black p-1 text-left">
                {deliveryNote.customer?.address ?? ''}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1 text-left align-top font-semibold">
                Email
                <br /> بريد
              </td>
              <td className="border border-black p-1 text-left">
                {companyInfo.email}
              </td>
              <td className="border border-black p-1 text-left align-top font-semibold">
                Tel
                <br /> هاتف
              </td>
              <td className="border border-black p-1 text-left">
                {deliveryNote.customer?.phoneNumber ?? ''}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1 text-left align-top font-semibold">
                VAT
                <br />
                رقم ضريبى
              </td>
              <td className="border border-black p-1 text-left">
                {companyInfo.VATNumber}
              </td>
              <td className="border border-black p-1 text-left align-top font-semibold">
                CR
              </td>
              <td className="border border-black p-1 text-left"></td>
            </tr>
          </tbody>
        </table>
        <table className="w-full table-fixed border-collapse border border-black text-xs mb-1">
          <colgroup>
            <col className="w-[15%]" /> {/* SN */}
            <col className="w-[60%]" /> {/* Item Title */}
            <col className="w-[25%]" /> {/* Qty */} 
          </colgroup>
          <thead>
            <tr>
              <th className="border border-black p-1 text-center font-bold">
                سيرييل نمبر
              </th>
              <th className="border border-black p-1 text-center font-bold">
                اسم الصنف
              </th>
              <th className="border border-black p-1 text-center font-bold">
                الكمية
              </th>
            </tr>
            <tr>
              <th className="border border-black p-1 text-center font-semibold">
                SN
              </th>
              <th className="border border-black p-1 text-center font-semibold">
                Item Title
              </th>
              <th className="border border-black p-1 text-center font-semibold">
                Qty
              </th>
             
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  className="border border-black p-2 text-center"
                  colSpan={8}
                ></td>
              </tr>
            ) : (
              items.map((it, idx) => {
                const qty = Number(it.quantity ?? 0) || 0
                return (
                  <tr key={idx} className="align-top">
                    <td className="border border-black p-1 text-center align-top">
                      {idx + 1}
                    </td>

                    <td className="border border-black p-1 align-top">
                      <div className="whitespace-pre-wrap">
                        {it.title ?? ''}
                      </div>
                    </td>

                    <td className="border border-black p-1 text-center align-top">
                      {qty}
                    </td>
                  </tr>
                )
              })
            )}

           
          </tbody>
        </table>

        <div className="bg-gray-200 p-2 text-center mb-1">
          <h3>شكرا لزيارتكم</h3>
        </div>

        {/* DETAILS table (was previously a stray <tr> outside table) */}
        <table className="w-full table-fixed border-collapse border border-black text-xs mb-1">
          <colgroup>
            <col className="w-[15%]" />
            <col className="w-[85%]" />
          </colgroup>
          <tbody>
            <tr>
              <td className="border border-black p-1 text-left align-top font-semibold">
                Driver Details
              </td>
              <td className="border border-black p-1 text-left">
                {deliveryNote.driverDetails ?? ''}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  },
)

DeliveryNotePrintable.displayName = 'DeliveryNotePrintable'
