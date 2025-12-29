// components/InvoicePrintable.tsx
import { companyInfo, companyInfoArbi } from '@/data/company-info'
import { formatTimestamp } from '@/lib/format-timestring'
import { convertSAR } from '@/lib/number-to-words'
import { Invoice } from '@/schemas/invoice.schema'
import React, { forwardRef, useEffect } from 'react'
import InvoiceQRCode from './invoice-qr-code'
import { nf } from '@/lib/number-format'

type Props = {
  invoice?: Invoice | null
  onReady: ()=> void
}



export const InvoicePrintable = forwardRef<HTMLDivElement, Props>(
  ({ invoice, onReady }, ref) => {  
     useEffect(() => {
      onReady?.()
    }, [])
    
    if (!invoice) return null

    const items = invoice.items ?? []

    return (
      <div className="p-8" ref={ref}>
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

        <div className="bg-gray-200 flex-col flex gap-1 justify-center items-center p-1 font-semibold mb-1 text-center relative">
          <h2 className="text-sm">
            Ayidh Mohammed Ayidh Al-Dossary Industrial Workshop
          </h2>
          <h2 className="text-sm">ورشة عايض محمد عايض الدوسري الصناعية</h2>
          <p className="text-sm">Address: Al-Oraifi Area 5001 Jubail, KSA</p>
          <h3>فاتورة ضريبية / Tax Invoice</h3>
          <div className="absolute right-2 top-2">
            <InvoiceQRCode
              invoice={invoice}
              size={80}
              payloadOptions={{ minify: true }}
            />
          </div>
        </div>
        <table className="w-full border-collapse border border-black text-xs mb-1">
          <colgroup>
            <col className="w-[15%]" />
            <col className="w-[15%]" />
            <col className="w-[8%]" />
            <col className="w-[12%]" />
            <col className="w-[15%]" />
            <col className="w-[35%]" />
          </colgroup>
          <tbody>
            <tr>
              <th className="border border-black p-1 text-left align-top font-semibold">
                Inv No.
                <br />
                <span className="block text-xs font-normal">رقم الفاتورة</span>
              </th>

              <td className="border border-black p-1">{invoice.id}</td>

              <th className="border border-black p-1 text-left align-top font-semibold">
                Date
                <br />
                <span className="block text-xs font-normal">التاريخ</span>
              </th>

              <td className="border border-black p-1">
                {formatTimestamp(invoice.date)}
              </td>

              <th
                className="border border-black p-1 text-center font-semibold"
                colSpan={2}
              >
                Customer
              </th>
            </tr>
            <tr>
              <th className="border border-black p-1 text-left align-top font-semibold">
                VAT No.
                <br />
                <span className="block text-xs font-normal">رقم ضريبي</span>
              </th>

              <td className="border border-black p-1" colSpan={3}>
                {companyInfo.VATNumber}
              </td>
              <th className="border border-black p-1 text-left align-top font-semibold">
                Name
                <br />
                <span className="block text-xs font-normal">اسم</span>
              </th>
              <td className="border border-black p-1">
                {invoice.customer?.name ?? ''}
              </td>
            </tr>
            <tr>
              <th className="border border-black p-1 text-left align-top font-semibold">
                Payment
                <br />
                <span className="block text-xs font-normal">نوع الفاتورة</span>
              </th>
              <td className="border border-black p-1" colSpan={3}></td>

              <th className="border border-black p-1 text-left align-top font-semibold">
                VAT No.
                <br />
                <span className="block text-xs font-normal">رقم الضريبة</span>
              </th>

              <td className="border border-black p-1">
                {invoice.customer?.VATNumber ?? ''}
              </td>
            </tr>
            <tr>
              <th className="border border-black p-1 text-left align-top font-semibold">
                Address
                <br />
                <span className="block text-xs font-normal">العنوان</span>
              </th>

              <td className="border border-black p-1" colSpan={3}>
                {companyInfo.address}
              </td>
              <th className="border border-black p-1 text-left align-top font-semibold">
                Email
                <br />
                <span className="block text-xs font-normal">بريد</span>
              </th>
              <td className="border border-black p-1">
                {invoice.customer?.email ?? ''}
              </td>
            </tr>
            <tr>
              <th className="border border-black p-1 text-left align-top font-semibold">
                Remarks
                <br />
                <span className="block text-xs font-normal">ملاحظات</span>
              </th>
              <td className="border border-black p-1" colSpan={3}>
                {invoice.remarks ?? ''}
              </td>
              <th className="border border-black p-1 text-left align-top font-semibold">
                Address
                <br />
                <span className="block text-xs font-normal">العنوان</span>
              </th>
              <td className="border border-black p-1">
                {invoice.customer?.address ?? ''}
              </td>
            </tr>
            <tr>
              <th className="border border-black p-1 text-left align-top font-semibold">
                CR No.
                <br />
                <span className="block text-xs font-normal">
                  رقم السجل التجاري
                </span>
              </th>
              <td className="border border-black p-1" colSpan={3}>
                {companyInfo.CRNumber}
              </td>
              <th className="border border-black p-1 text-left align-top font-semibold">
                Tel
                <br />
                <span className="block text-xs font-normal">هاتف</span>
              </th>
              <td className="border border-black p-1">
                {invoice.customer?.phoneNumber ?? ''}
              </td>
            </tr>
          </tbody>
        </table>
        {/* Items table */}
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
                const qty = it.quantity ?? it.quantity ?? 0
                const price =
                  typeof it.unitPrice === 'number'
                    ? it.unitPrice
                    : Number(it.unitPrice ?? 0)
                const vatAmount =
                  typeof it.taxAmount === 'number'
                    ? it.taxAmount
                    : Number(it.taxAmount ?? 0)
                const vatPercent = process.env.NEXT_PUBLIC_TAX
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
                      {Number.isFinite(price) ? nf.format(price) : ''}
                    </td>

                    <td className="border border-black p-1 text-center align-top">
                      {Number.isFinite(vatAmount) ? nf.format(vatAmount) : ''}
                    </td>

                    <td className="border border-black p-1 text-center align-top">
                      {vatPercent !== '' ? `${vatPercent}` : ''}
                    </td>

                    <td className="border border-black p-1 text-center align-top">
                      {Number.isFinite(total) ? nf.format(total) : ''}
                    </td>

                    <td className="border border-black p-1 text-center align-top">
                      {grandTotal}
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
                {nf.format(invoice.subTotal ?? 0)}
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
                {nf.format(invoice.taxTotal ?? 0)}
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
                {nf.format(invoice.total ?? 0)}
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
                {convertSAR(invoice.total ?? 0)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Bank details */}
        <table className="w-full table-fixed border-collapse border border-black text-xs">
          <colgroup>
            <col className="w-[20%]" />
            <col className="w-[40%]" />
            <col className="w-[40%]" />
          </colgroup>

          <thead>
            <tr>
              <th
                colSpan={3}
                className="bg-gray-200 border border-black p-1 text-center font-bold"
              >
                BANK DETAILS / تفاصيل البنك
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <th className="border border-black p-1 text-left font-medium">
                Bank
              </th>
              <td className="border border-black p-1 text-left">
                {companyInfo.bankDetails?.bankName ?? ''}
              </td>
              <td className="border border-black p-1 text-right" dir="rtl">
                {companyInfoArbi.bankDetails?.bankName ?? ''}
              </td>
            </tr>

            <tr>
              <th className="border border-black p-1 text-left font-medium">
                IBAN
              </th>
              <td className="border border-black p-1 text-left">
                {companyInfo.bankDetails?.IBAN ?? ''}
              </td>
              <td className="border border-black p-1 text-right" dir="rtl">
                {companyInfoArbi.bankDetails?.IBAN ?? ''}
              </td>
            </tr>

            <tr>
              <th className="border border-black p-1 text-left font-medium">
                Account Number
              </th>
              <td className="border border-black p-1 text-left">
                {companyInfo.bankDetails?.accountNumber ?? ''}
              </td>
              <td className="border border-black p-1 text-right" dir="rtl">
                {companyInfoArbi.bankDetails?.accountNumber ?? ''}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="h-26 w-full flex flex-col items-center justify-end">
          <div className="flex justify-between items-center gap-2 w-7/8 mx-auto">
            <section>
              <span>Prepared By /</span> <span> أُعدت بواسطة</span>
            </section>
            <section>
              <span>Received By /</span> <span>ستلمت من قبل</span>
            </section>
          </div>
        </div>
      </div>
    )
  },
)

InvoicePrintable.displayName = 'InvoicePrintable'
