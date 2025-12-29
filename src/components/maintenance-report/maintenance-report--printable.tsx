import { companyInfo } from '@/data/company-info'
import { formatTimestamp } from '@/lib/format-timestring'
import { MaintenanceReport } from '@/schemas/maintenance-report.schema'
import { forwardRef, useEffect } from 'react'

type Props = {
  report?: MaintenanceReport | null
  onReady: () => void
}

export const MaintenanceReportPrintable = forwardRef<HTMLDivElement, Props>(
  ({ report, onReady }, ref) => {
    useEffect(() => {
      onReady?.()
    }, [])

    if (!report) return null

    const items = report.repair ?? []

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
          <h3>Maintenance Report</h3>
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
                Maintenance Report No
                <br /> رقم تقرير الصيانة
              </td>
              <td className="border border-black p-1 text-left">{report.id}</td>
              <td className="border border-black p-1 text-left align-top font-semibold">
                Name
                <br />
                اسم
              </td>
              <td className="border border-black p-1 text-left">
                {report.customer?.name ?? ''}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1 text-left align-top font-semibold">
                Date
                <br /> التاريخ
              </td>
              <td className="border border-black p-1 text-left">
                {formatTimestamp(report.date)}
              </td>
              <td className="border border-black p-1 text-left align-top font-semibold">
                VAT
                <br />
                رقم ضريبى
              </td>
              <td className="border border-black p-1 text-left">
                {report.customer?.VATNumber ?? ''}
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
                {report.customer?.address ?? ''}
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
                {report.customer?.phoneNumber ?? ''}
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
            <col className="w-[15%]" /> {/* SL No */}
            <col className="w-[85%]" /> {/* Description */}
          </colgroup>

          <thead>
            <tr>
              <th className="border border-black p-1 text-center font-bold">
                الرقم
              </th>
              <th className="border border-black p-1 text-center font-bold">
                وصف الصيانة
              </th>
            </tr>
            <tr>
              <th className="border border-black p-1 text-center font-semibold">
                SL No
              </th>
              <th className="border border-black p-1 text-center font-semibold">
                Description
              </th>
            </tr>
          </thead>

          <tbody>
            {report.repair.length === 0 ? (
              <tr>
                <td colSpan={2} className="border border-black p-2 text-center">
                  —
                </td>
              </tr>
            ) : (
              report.repair.map((it, idx) => (
                <tr key={idx} className="align-top">
                  {/* Serial Number */}
                  <td className="border border-black p-1 text-center align-top">
                    {idx + 1}
                  </td>

                  {/* Description */}
                  <td className="border border-black p-1 align-top">
                    <div className="whitespace-pre-wrap">
                      {it.description || ''}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <table className="w-full table-fixed border-collapse border border-black text-xs mb-2">
          <colgroup>
            <col className="w-[30%]" /> {/* Label */}
            <col className="w-[70%]" /> {/* Value */}
          </colgroup>

          <tbody>
            <tr>
              <td className="border border-black p-1 font-bold">
                Reported Issue
              </td>
              <td className="border border-black p-1 whitespace-pre-wrap">
                {report.symptoms || '—'}
              </td>
            </tr>

            <tr>
              <td className="border border-black p-1 font-bold">
                Cause of Issue
              </td>
              <td className="border border-black p-1 whitespace-pre-wrap">
                {report.causeOfIssue || '—'}
              </td>
            </tr>

            <tr>
              <td className="border border-black p-1 font-bold">
                Engineer Remarks
              </td>
              <td className="border border-black p-1 whitespace-pre-wrap">
                {report.remark || '—'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  },
)
