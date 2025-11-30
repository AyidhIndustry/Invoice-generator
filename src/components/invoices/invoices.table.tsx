'use client'

import React, { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useGetInvoices } from '@/hooks/invoices/use-get-invoice'
import { Invoice } from '@/schemas/invoice.schema'
import { PurchasesFilter } from '@/features/purchases/get-purchases'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, Trash2 } from 'lucide-react'

type Mode = 'all' | 'date' | 'month'

export default function InvoicesTable() {
  const [mode, setMode] = useState<Mode>('all')
  const [date, setDate] = useState<Date | undefined>()
  const [month, setMonth] = useState<string | undefined>()

  const filter = useMemo(() => {
    const f: any = { type: mode === 'all' ? 'all' : mode }
    if (mode === 'date' && date) f.date = date
    if (mode === 'month' && month) f.month = month
    return f as PurchasesFilter
  }, [mode, date, month])

  const { data: invoices, isLoading, isFetching, refetch, error } = useGetInvoices(filter as any)

  const resetFilters = () => {
    setMode('all'); setDate(undefined); setMonth(undefined); refetch()
  }


  const truncate = (s?: string, l = 80) => {
    if (!s) return '—'
    return s.length > l ? s.slice(0, l).trimEnd() + '…' : s
  }

  const money = (amt?: number | string) => {
    try {
      const n = typeof amt === 'number' ? amt : Number(amt)
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'SAR', maximumFractionDigits: 2 }).format(Number.isNaN(n) ? 0 : n)
    } catch {
      return amt ?? '—'
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-start justify-between">
        <div>
          <Label>Filter</Label>
          <div className="flex items-center gap-3 mt-2">
            <Select value={mode} onValueChange={(v) => setMode(v as Mode)}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {mode === 'date' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="min-w-[180px]">
                    {date ? format(date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={(d) => setDate(d as Date)} />
                </PopoverContent>
              </Popover>
            )}

            {mode === 'month' && (
              <Input type="month" value={month ?? ''} onChange={(e) => setMonth(e.target.value || undefined)} />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={resetFilters}>Reset</Button>
          <Button onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? 'Refreshing...' : 'Apply'}
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="p-0 overflow-x-auto rounded-2xl">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-center animate-pulse">
                <div className="h-4 w-24 bg-slate-200 rounded" />
                <div className="h-4 w-40 bg-slate-200 rounded" />
                <div className="h-4 w-56 bg-slate-200 rounded" />
                <div className="h-4 w-24 bg-slate-200 rounded" />
                <div className="h-4 w-60 bg-slate-200 rounded ml-auto" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-red-600">Failed to load invoices.</div>
        ) : (
          <table className="w-full text-sm table-fixed">
            <thead className="bg-muted border-b">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">ID</th>
                <th className="text-left py-3 px-4 font-semibold">Customer Name</th>
                <th className="text-left py-3 px-4 font-semibold">Customer Email</th>
                <th className="text-left py-3 px-4 font-semibold">Total Amount</th>
                <th className="text-left py-3 px-4 font-semibold">Remarks</th>
                <th className="text-center py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {invoices && invoices.length > 0 ? invoices.map((inv: Invoice, i: number) => {
                const idVal = (inv as any).invId ?? (inv as any).id ?? '—'
                const customer = (inv as any).customer ?? {}
                const custName = customer.name ?? '—'
                const custEmail = customer.email ?? '—'
                const total = money((inv as any).totalAmount ?? (inv as any).amount)
                const remarks = truncate((inv as any).remarks)

                return (
                  <tr key={idVal + i} className={i % 2 === 0 ? 'bg-white' : 'bg-muted/40'}>
                    <td className="py-4 px-4 font-medium">{idVal}</td>

                    <td className="py-4 px-4">{custName}</td>

                    <td className="py-4 px-4 text-xs text-muted-foreground">{custEmail}</td>

                    <td className="py-4 px-4">{total}</td>

                    <td className="py-4 px-4"><div className="max-w-xl text-sm text-muted-foreground">{remarks}</div></td>

                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex gap-2">
                        <Button variant="ghost" size="sm" aria-label="View"><Eye /></Button>
                        <Button variant="ghost" size="sm" aria-label="Delete"><Trash2 className="text-red-600" /></Button>
                      </div>
                    </td>
                  </tr>
                )
              }) : (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center text-muted-foreground">No invoices found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
