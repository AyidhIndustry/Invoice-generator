'use client'

import React, { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MonthPicker } from '../ui/month-picker'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Eye, Loader2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useGetPurchases } from '@/hooks/purchases/use-get-purchase'
import { useDeletePurchase } from '@/hooks/purchases/use-delete-purchase'

// --- types ---
export type PurchaseFilterState = {
  type: 'all' | 'date' | 'month'
  date?: string // ISO yyyy-MM-dd
  month?: string // yyyy-MM
}

// --- PurchaseFilter component (simple, self-contained) ---
export function PurchaseFilter({
  onApply,
  initial = { type: 'all' } as PurchaseFilterState,
}: {
  onApply: (f: PurchaseFilterState) => void
  initial?: PurchaseFilterState
}) {
  const [state, setState] = React.useState<PurchaseFilterState>(initial)

  const setType = (t: PurchaseFilterState['type']) =>
    setState((prev) => ({
      ...prev,
      type: t,
      ...(t === 'date' ? { month: undefined } : {}),
      ...(t === 'month' ? { date: undefined } : {}),
    }))

  const setDate = (d?: Date) => {
    if (!d) return setState((prev) => ({ ...prev, date: undefined }))
    setState((prev) => ({
      ...prev,
      type: 'date',
      date: format(d, 'yyyy-MM-dd'),
      month: undefined,
    }))
  }

  const setMonth = (m?: string) => {
    if (!m) return setState((prev) => ({ ...prev, month: undefined }))
    setState((prev) => ({ ...prev, type: 'month', month: m, date: undefined }))
  }

  const reset = () => setState({ type: 'all' })
  const apply = () => onApply(state)

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="min-w-[180px]">
        <Label>Filter</Label>
        <Select value={state.type} onValueChange={(v) => setType(v as any)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {state.type === 'date' && (
        <div>
          <Label>Select date</Label>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 w-[200px] justify-start"
                >
                  {state.date
                    ? format(new Date(state.date), 'PPP')
                    : 'Pick a date'}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0 w-auto">
                <Calendar
                  mode="single"
                  selected={state.date ? new Date(state.date) : undefined}
                  onSelect={(d) => setDate(d as Date)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {state.type === 'month' && (
        <div>
          <Label>Select month</Label>
          <div className="flex items-center gap-2">
            <MonthPicker value={state.month} onChange={(v) => setMonth(v)} />
            {state.month && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setMonth(undefined)}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="ml-auto flex gap-2">
        <Button variant="outline" onClick={reset}>
          Reset
        </Button>
        <Button onClick={apply}>Apply</Button>
      </div>
    </div>
  )
}

// --- PurchasesTable (default export) ---
export default function PurchasesTable() {
  const [filter, setFilter] = useState<PurchaseFilterState>({ type: 'all' })
  const router = useRouter()

  // convert filter state into the params shape your hook expects
  const params = useMemo(() => {
    if (filter.type === 'date' && filter.date)
      return { type: 'date' as const, date: new Date(filter.date) }
    if (filter.type === 'month' && filter.month) {
      const [y, m] = filter.month.split('-').map(Number)
      return { type: 'month' as const, year: y, month: m }
    }
    return { type: 'all' as const }
  }, [filter])

  const {
    data: purchases,
    isPending,
    isError,
    refetch,
  } = useGetPurchases(params)
  const { mutate: deletePurchase, isPending: isDeleting } = useDeletePurchase()

  const handleApply = (f: PurchaseFilterState) => {
    setFilter(f)
    refetch?.()
  }

  return (
    <div className="space-y-6">
      <PurchaseFilter onApply={handleApply} initial={filter} />

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/70">
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">SubTotal</TableHead>
              <TableHead className="text-right">Tax</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isPending &&
              Array.from({ length: 6 }).map((_, idx) => (
                <TableRow key={idx} className="animate-pulse bg-white">
                  <TableCell>
                    <div className="h-4 bg-muted rounded w-24" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded w-32" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded w-56" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded w-20 ml-auto" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded w-20 ml-auto" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded w-20 ml-auto" />
                  </TableCell>
                  <TableCell>
                    <div className="h-8 bg-muted rounded w-24" />
                  </TableCell>
                </TableRow>
              ))}

            {!isPending && isError && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-destructive py-6"
                >
                  Error loading purchases
                </TableCell>
              </TableRow>
            )}

            {!isPending &&
              !isError &&
              (!purchases || purchases.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No purchases found
                  </TableCell>
                </TableRow>
              )}

            {!isPending &&
              !isError &&
              purchases &&
              purchases.map((p: any, idx: number) => (
                <TableRow
                  key={p.id}
                  className={
                    idx % 2 === 0
                      ? 'bg-white'
                      : 'bg-muted/30 hover:bg-muted/50 transition'
                  }
                >
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell>
                    {p.date ? format(new Date(p.date), 'PPP') : '-'}
                  </TableCell>
                  <TableCell>
                    <span
                      title={p.description ?? ''}
                      className="inline-block max-w-xl truncate"
                    >
                      {p.description}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {typeof p.subTotal === 'number'
                      ? p.subTotal.toFixed(2)
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {typeof p.taxTotal === 'number'
                      ? p.taxTotal.toFixed(2)
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {typeof p.total === 'number' ? p.total.toFixed(2) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-sky-500"
                        onClick={() => router.push(`/purchases/${p.id}`)}
                      >
                        <Eye className="h-4 w-4 text-white" />
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (
                            !confirm(
                              `Delete purchase ${p.id}? This cannot be undone.`,
                            )
                          )
                            return
                          deletePurchase(p.id)
                        }}
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
