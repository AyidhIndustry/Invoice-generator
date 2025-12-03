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
import { useDeleteQuotation } from '@/hooks/quotations/use-delete-quotation'
import DeleteItemDialog from '../dialogs/delete-item.dialog'
import { PrintQuotationButton } from './print-quotation-button'

const QuotationTable = ({
  quotations,
  isPending,
  isError,
}: {
  quotations: any[]
  isPending: boolean
  isError: boolean
}) => {
  const {
    mutate: deleteQuotation,
    isPending: isQuotationDeletePending,
    isError: isQuotationDeleteError,
  } = useDeleteQuotation()
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader className="bg-muted/70">
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
                      <PrintQuotationButton quotation={quotation}/>

                      {/* DELETE */}
                      <DeleteItemDialog
                        name="Quotation"
                        id={quotation.id as string}
                        onDelete={deleteQuotation}
                        isPending={isQuotationDeletePending}
                        isError={isQuotationDeleteError}
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

export default QuotationTable
