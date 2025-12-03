import { Quotation } from '@/schemas/quotation.schema'
import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { SkeletonTable } from '../ui/skeleton-table'
import { formatTimestamp } from '@/lib/format-timestring'
import { Button } from '../ui/button'
import { Printer, Trash2 } from 'lucide-react'

const QuotationTable = ({
  quotations,
  isPending,
  isError,
}: {
  quotations: any[]
  isPending: boolean
  isError: boolean
}) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <SkeletonTable />}
          {isError && !isPending && (
            <TableRow>
              <TableCell colSpan={5} className="py-6 text-center text-red-600">
                Failed to load Quotations.
              </TableCell>
            </TableRow>
          )}
          {!isPending && !isError && quotations.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-6 text-center text-muted-foreground"
              >
                No invoices found.
              </TableCell>
            </TableRow>
          )}
          {!isPending &&
            !isError &&
            quotations.map((quotation: Quotation) => {
              return (
                <TableRow key={quotation.id}>
                  <TableCell className="font-medium">{quotation.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {quotation.customer?.name ?? '—'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {quotation.customer?.email ?? '—'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatTimestamp(quotation.createdAt)}</TableCell>
                  <TableCell>{quotation?.subject ?? '-'}</TableCell>
                  <TableCell>
                    {typeof quotation.total === 'number'
                      ? `SAR ${quotation.total.toFixed(2)}`
                      : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        //   onClick={handlePrint}
                      >
                        <Printer size={16} />
                      </Button>

                      {/* DELETE */}
                      <Button
                        variant="destructive"
                        size="sm"
                        //   onClick={() => deleteInvoice(inv.id)}
                      >
                        <Trash2 size={16} />
                      </Button>

                      {/* HIDDEN PRINTABLE DOM
                        <div style={{ position: "absolute", left: -9999, top: 0 }}>
                          <div ref={contentRef}>
                            <PrintableInvoice invoice={inv} />
                          </div>
                        </div> */}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
    </div>
  )
}

export default QuotationTable
