'use client'

import React, { useMemo } from 'react'
import ContentLayout from '../layout/content.layout'
import { CardContent } from '@/components/ui/card'
import { Loader2, FileText, ShoppingCart, FilePlus2, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useStats } from '@/context/stat.context'
import { QuarterSelector } from './quarter-selector'
import { StatBox } from './stat-box'

export default function Dashboard() {
  const { data, isPending, isError } = useStats()

  const nf = useMemo(
    () =>
      new Intl.NumberFormat('en-GB', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
    [],
  )

  const money = useMemo(
    () =>
      new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [],
  )

  return (
    <ContentLayout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold">Dashboar</h1>
        </header>
        <QuarterSelector />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatBox
            title="Invoices"
            value={isPending ? undefined : nf.format(data.invoiceCount)}
            subtitle="Created this quarter"
            loading={isPending}
            gradient="bg-blue-100 text-blue-900"
          />
          <StatBox
            title="Quotations"
            value={isPending ? undefined : nf.format(data.quotationCount)}
            subtitle="Created this quarter"
            loading={isPending}
            gradient="bg-green-100 text-green-900"
          />
          <StatBox
            title="Purchases"
            value={isPending ? undefined : nf.format(data.purchaseCount)}
            subtitle="Created this quarter"
            loading={isPending}
            gradient="bg-orange-100 text-orange-900"
          />
          <StatBox
            title="Tax"
            gradient="bg-purple-100 text-purple-900"
            loading={isPending}
            tax={{
              received: data.totalTaxReceived,
              paid: data.totalTaxPaid,
              net: data.netTax,
            }}
          />
        </div>

        {isError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            There was an error loading stats. Please try again.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <Link href="/invoices/create" className="w-full">
            <Button
              className="w-full justify-start gap-3 transform transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] shadow-md hover:shadow-xl border-0 py-6 rounded-2xl text-white"
              variant="secondary"
              style={{ background: 'linear-gradient(90deg,#2563eb,#60a5fa)' }}
            >
              <FileText className="h-5 w-5 text-white" />
              Create Invoice
            </Button>
          </Link>

          <Link href="/quotations/create" className="w-full">
            <Button
              className="w-full justify-start gap-3 transform transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] shadow-md hover:shadow-xl border-0 py-6 rounded-2xl text-white"
              variant="secondary"
              style={{ background: 'linear-gradient(90deg,#16a34a,#4ade80)' }}
            >
              <FilePlus2 className="h-5 w-5 text-white" />
              Create Quotation
            </Button>
          </Link>

          <Link href="/purchases/create" className="w-full">
            <Button
              className="w-full justify-start gap-3 transform transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] shadow-md hover:shadow-xl border-0 py-6 rounded-2xl text-white"
              variant="secondary"
              style={{ background: 'linear-gradient(90deg,#f97316,#fb923c)' }}
            >
              <ShoppingCart className="h-5 w-5 text-white" />
              Create Purchase
            </Button>
          </Link>

          <Link href="/delivery-notes/create" className="w-full">
            <Button
              className="w-full justify-start gap-3 transform transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] shadow-md hover:shadow-xl border-0 py-6 rounded-2xl text-white"
              variant="secondary"
              style={{ background: 'linear-gradient(90deg,#7c3aed,#a78bfa)' }}
            >
              <Truck className="h-5 w-5 text-white" />
              Create Delivery Note
            </Button>
          </Link>
        </div>
      </div>
    </ContentLayout>
  )
}
