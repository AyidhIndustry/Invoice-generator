'use client'

import React, { useMemo, useRef } from 'react'
import TableFilter from '../filter'
import { FilterType } from '@/schemas/filter.type'
import { useGetInvoices } from '@/hooks/invoices/use-get-invoice'
import { Button } from '@/components/ui/button'
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from '@/components/ui/table'
import { Trash, Printer } from 'lucide-react'
import { formatTimestamp } from '@/lib/format-timestring'
import { useDeleteInvoice } from '@/hooks/invoices/use-delete-invoice'
import PrintableInvoice from './printable-invoice'
import { useReactToPrint } from 'react-to-print'

function SkeletonRow() {
  return (
    <TableRow className="animate-pulse">
      <TableCell><div className="h-4 w-24 bg-slate-200 rounded-md" /></TableCell>
      <TableCell>
        <div className="h-4 w-32 bg-slate-200 rounded-md" />
        <div className="h-3 w-48 mt-2 bg-slate-100 rounded-md" />
      </TableCell>
      <TableCell><div className="h-4 w-20 bg-slate-200 rounded-md" /></TableCell>
      <TableCell><div className="h-4 w-24 bg-slate-200 rounded-md" /></TableCell>
      <TableCell><div className="h-8 w-32 bg-slate-200 rounded-md" /></TableCell>
    </TableRow>
  )
}

export default function InvoiceTable() {
  const [filters, setFilters] = React.useState<FilterType>({ type: 'all' })
  const { data: invoices = [], isPending, isError } = useGetInvoices(filters)
  const { mutate: deleteInvoice } = useDeleteInvoice()

  const rows = useMemo(() => (Array.isArray(invoices) ? invoices : []), [invoices])

  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({ contentRef });
  return (
    <div className="space-y-4">
      <TableFilter filters={filters} setFilters={setFilters} />

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isPending && (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            )}

            {isError && !isPending && (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-red-600">
                  Failed to load invoices.
                </TableCell>
              </TableRow>
            )}

            {!isPending && !isError && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                  No invoices found.
                </TableCell>
              </TableRow>
            )}

            {!isPending &&
              !isError &&
              rows.map((inv: any) => {
  

                return (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.id}</TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{inv.customer?.name ?? '—'}</span>
                        <span className="text-xs text-muted-foreground">{inv.customer?.email ?? '—'}</span>
                      </div>
                    </TableCell>

                    <TableCell>{formatTimestamp(inv.date)}</TableCell>

                    <TableCell>
                      {typeof inv.total === 'number'
                        ? `SAR ${inv.total.toFixed(2)}`
                        : '—'}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handlePrint}
                        >
                          <Printer size={16} />
                        </Button>

                        {/* DELETE */}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteInvoice(inv.id)}
                        >
                          <Trash size={16} />
                        </Button>

                        {/* HIDDEN PRINTABLE DOM */}
                        <div style={{ position: "absolute", left: -9999, top: 0 }}>
                          <div ref={contentRef}>
                            <PrintableInvoice invoice={inv} />
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
