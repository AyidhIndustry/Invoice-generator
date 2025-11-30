// components/DeliveryNotesTable.tsx
'use client'

import React, { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useGetDeliveryNotes } from '@/hooks/delivery-notes/use-get-deliverynote' 
import { DeliveryNote } from '@/schemas/delivery-note.schema'
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

export default function DeliveryNotesTable() {
  const [mode, setMode] = useState<Mode>('all')
  const [date, setDate] = useState<Date | undefined>()
  const [month, setMonth] = useState<string | undefined>()

  const filter = useMemo(() => {
    const f: any = { type: mode === 'all' ? 'all' : mode }
    if (mode === 'date' && date) f.date = date
    if (mode === 'month' && month) f.month = month
    return f as PurchasesFilter
  }, [mode, date, month])

  const { data: notes, isLoading, isFetching, refetch, error } = useGetDeliveryNotes(filter as any)

  const resetFilters = () => {
    setMode('all'); setDate(undefined); setMonth(undefined); refetch()
  }

  const toDate = (v: any) => {
    if (!v) return undefined
    if (typeof v.toDate === 'function') return v.toDate()
    if (v instanceof Date) return v
    const d = new Date(v)
    return Number.isNaN(d.getTime()) ? undefined : d
  }

  const paymentCapsule = (p?: string) => (
    <span className="inline-block p-2 rounded-md text-xs font-medium border border-black">
      {p ?? '—'}
    </span>
  )

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
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-center animate-pulse">
                <div className="h-4 w-40 bg-slate-200 rounded" />
                <div className="h-4 w-40 bg-slate-200 rounded" />
                <div className="h-4 w-56 bg-slate-200 rounded" />
                <div className="h-4 w-20 bg-slate-200 rounded ml-auto" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-red-600">Failed to load delivery notes.</div>
        ) : (
          <table className="w-full text-sm table-fixed">
            <thead className="bg-muted border-b">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">ID</th>
                <th className="text-left py-3 px-4 font-semibold">Due Date</th>
                <th className="text-left py-3 px-4 font-semibold">Customer</th>
                <th className="text-left py-3 px-4 font-semibold">Payment Type</th>
                <th className="text-center py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {notes && notes.length > 0 ? notes.map((n: DeliveryNote, i: number) => {
                console.log(n)
                const due = toDate((n as any).dueDate)
                const dueText = due ? format(due, 'MMMM do, yyyy') : '—'
                const idVal = (n as any).invId ?? (n as any).id ?? '—'
                const customer = (n as any).customer ?? {}
                const custName = customer.name ?? '—'
                const custEmail = customer.email ?? ''
                const payment = (n as any).paymentType ?? undefined

                return (
                  <tr key={idVal + i} className={i % 2 === 0 ? 'bg-white' : 'bg-muted/40'}>
                    <td className="py-4 px-4">{n.id}</td>
                    <td className="py-4 px-4">{dueText}</td>

                    <td className="py-4 px-4">
                      <div className="font-medium">{custName}</div>
                      {custEmail && <div className="text-xs text-muted-foreground">{custEmail}</div>}
                    </td>

                    <td className="py-4 px-4">{paymentCapsule(payment)}</td>

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
                  <td colSpan={5} className="py-8 px-4 text-center text-muted-foreground">No delivery notes found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
