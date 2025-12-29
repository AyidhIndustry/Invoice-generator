'use client'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Invoice } from '@/schemas/invoice.schema'
import { SkeletonTable } from '../ui/skeleton-table'
import { formatTimestamp } from '@/lib/format-timestring'
import { Printer } from 'lucide-react'
import DeleteItemDialog from '../dialogs/delete-item.dialog'
import { useDeleteInvoice } from '@/hooks/invoices/use-delete-invoice'
import { PrintInvoiceButton } from './print-invoice-button'
import { nf } from '@/lib/number-format'

export default function InvoiceTable({
  invoices,
  isPending,
  isError,
}: {
  invoices: Invoice[]
  isPending: boolean
  isError: boolean
}) {
  const {
    mutate: deleteInvoice,
    isPending: isInvoiceDeletePending,
    isError: isInvoiceDeleteError,
  } = useDeleteInvoice()
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader className="bg-muted/70">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isPending && <SkeletonTable />}
          {isError && !isPending && (
            <TableRow>
              <TableCell colSpan={6} className="py-6 text-center text-red-600">
                Failed to load Invoices.
              </TableCell>
            </TableRow>
          )}
          {invoices && !isPending && !isError && invoices.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-6 text-center text-muted-foreground"
              >
                No Invoices found.
              </TableCell>
            </TableRow>
          )}
          {invoices &&
            !isPending &&
            !isError &&
            invoices.map((invoice: Invoice) => {
              return (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {invoice.customer?.name ?? '—'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {invoice.customer?.email ?? '—'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatTimestamp(invoice.date)}</TableCell>
                  <TableCell>SAR {nf.format(invoice.total ?? '—')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <PrintInvoiceButton invoice={invoice}/>

                      <DeleteItemDialog
                        name="Invoice"
                        id={invoice.id as string}
                        onDelete={deleteInvoice}
                        isPending={isInvoiceDeletePending}
                        isError={isInvoiceDeleteError}
                      />
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
