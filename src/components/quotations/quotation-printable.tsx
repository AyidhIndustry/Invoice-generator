// components/InvoicePrintable.tsx
import { companyInfo } from '@/data/company-info'
import { formatTimestamp } from '@/lib/format-timestring'
import { convertSAR } from '@/lib/number-to-words'
import { Quotation } from '@/schemas/quotation.schema'
import React, { forwardRef, useEffect } from 'react'

type Props = {
  quotation?: Quotation | null
  onReady: () => void
}

const nf = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const QuotationPrintable = forwardRef<HTMLDivElement, Props>(
  ({ quotation, onReady }, ref) => {
    useEffect(() => {
      onReady?.()
    }, [])

    if (!quotation) return null

    const items = quotation.items ?? []

    // Normalize VAT percent once (so SSR and CSR render the same string)
    const vatPercentDisplay = process.env.NEXT_PUBLIC_TAX ?? ''

    // helpers
    const safeFormat = (v: unknown) =>
      typeof v === 'number' && Number.isFinite(v) ? nf.format(v) : ''

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
          <h3>
            <span>Sale Quotation /</span>
            <span>عرض أسعار</span>
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
                {quotation.id}
              </td>
              <td className="border border-black p-1 text-left align-top font-semibold">
                Name
                <br />
                اسم
              </td>
              <td className="border border-black p-1 text-left">
                {quotation.customer?.name ?? ''}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1 text-left align-top font-semibold">
                Date
                <br /> التاريخ
              </td>
              <td className="border border-black p-1 text-left">
                {formatTimestamp(quotation.createdAt)}
              </td>
              <td className="border border-black p-1 text-left align-top font-semibold">
                VAT
                <br />
                رقم ضريبى
              </td>
              <td className="border border-black p-1 text-left">
                {quotation.customer?.VATNumber ?? ''}
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
                {quotation.customer?.address ?? ''}
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
                {quotation.customer?.phoneNumber ?? ''}
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
            <tr>
              <td className="border border-black p-1 text-left align-top font-semibold">
                Subject
                <br />
                موضوع
              </td>
              <td className="border border-black p-1 text-left" colSpan={3}>
                {quotation.subject}
              </td>
            </tr>
          </tbody>
        </table>
        <table className="w-full table-fixed border-collapse border border-black text-xs mb-1">
          <colgroup>
            <col className="w-[10%]" /> {/* SN */}
            <col className="w-[34%]" /> {/* Item Title */}
            <col className="w-[8%]" /> {/* Qty */}
            <col className="w-[10%]" /> {/* Price */}
            <col className="w-[8%]" /> {/* VAT */}
            <col className="w-[8%]" /> {/* % */}
            <col className="w-[9%]" /> {/* Total */}
            <col className="w-[14%]" /> {/* Grand Total */}
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
              <th className="border border-black p-1 text-center font-bold">
                السعر
              </th>
              <th className="border border-black p-1 text-center font-bold">
                الاجمالي
              </th>
              <th className="border border-black p-1 text-center font-bold">
                %
              </th>
              <th className="border border-black p-1 text-center font-bold">
                الضريبة
              </th>
              <th className="border border-black p-1 text-center font-bold">
                الاجمالي بالضريبة
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
              <th className="border border-black p-1 text-center font-semibold">
                Price
              </th>
              <th className="border border-black p-1 text-center font-semibold">
                VAT
              </th>
              <th className="border border-black p-1 text-center font-semibold">
                VAT %
              </th>
              <th className="border border-black p-1 text-center font-semibold">
                Total
              </th>
              <th className="border border-black p-1 text-center font-semibold">
                Grand Total
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
                const price =
                  typeof it.unitPrice === 'number'
                    ? it.unitPrice
                    : Number(it.unitPrice ?? 0)
                const vatAmount =
                  typeof it.taxAmount === 'number'
                    ? it.taxAmount
                    : Number(it.taxAmount ?? 0)
                const total =
                  typeof it.unitTotal === 'number'
                    ? it.unitTotal
                    : Number(it.unitTotal ?? 0)
                const grandTotal = Number(total +vatAmount)

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

                    <td className="border border-black p-1 text-center align-top">
                      {safeFormat(price)}
                    </td>

                    <td className="border border-black p-1 text-center align-top">
                      {safeFormat(vatAmount)}
                    </td>

                    <td className="border border-black p-1 text-center align-top">
                      {vatPercentDisplay !== '' ? `${vatPercentDisplay}` : ''}
                    </td>

                    <td className="border border-black p-1 text-center align-top">
                      {safeFormat(total)}
                    </td>

                    <td className="border border-black p-1 text-center align-top">
                      {safeFormat(grandTotal)}
                    </td>
                  </tr>
                )
              })
            )}

            {/* Totals rows */}
            <tr>
              <td
                className="border border-black p-1 text-right font-semibold"
                colSpan={7}
              >
                Total Excl VAT Amount
                <br />
                <span className="block text-xs">
                  الإجمالي باستثناء مبلغ ضريبة القيمة المضافة
                </span>
              </td>

              <td className="border border-black p-1 text-center">
                {safeFormat(quotation.subTotal ?? 0)}
              </td>
            </tr>
            <tr>
              <td
                className="border border-black p-1 text-right font-semibold"
                colSpan={7}
              >
                VAT Amount
                <br />
                <span className="block text-xs">قيمة الضريبة</span>
              </td>

              <td className="border border-black p-1 text-center">
                {safeFormat(quotation.taxTotal ?? 0)}
              </td>
            </tr>
            <tr>
              <td
                className="border border-black p-1 text-right font-bold"
                colSpan={7}
              >
                Total Incl VAT Amount
                <br />
                <span className="block text-xs">
                  الإجمالي بما في ذلك مبلغ ضريبة القيمة المضافة
                </span>
              </td>

              <td className="border border-black p-1 text-center">
                {safeFormat(quotation.total ?? 0)}
              </td>
            </tr>

            {/* Amount in words */}
            <tr>
              <td
                className="border border-black p-1 text-right font-semibold"
                colSpan={1}
              >
                المطلوب
              </td>

              <td colSpan={7} className="border border-black p-1">
                {convertSAR(quotation.total ?? 0)}
              </td>
            </tr>
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
                Details
              </td>
              <td className="border border-black p-1 text-left">
                {quotation.details ?? ''}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  },
)

QuotationPrintable.displayName = 'QuotationPrintable'
