// components/DeliveryNotesTable.tsx
'use client'
import { DeliveryNote } from '@/schemas/delivery-note.schema'
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
import { Printer } from 'lucide-react'
import DeleteItemDialog from '../dialogs/delete-item.dialog'
import { useDeleteDeliveryNote } from '@/hooks/delivery-notes/use-delete-deliverynote'

export default function DeliveryNotesTable({
  deliverynotes,
  isPending,
  isError,
}: {
  deliverynotes?: DeliveryNote[]
  isPending: boolean
  isError: boolean
}) {
  const {
    mutate: deleteDeliveryNote,
    isPending: isDeliveryNoteDeletePending,
    isError: isDeliveryNoteDeleteError,
  } = useDeleteDeliveryNote()

  const notes = deliverynotes ?? []

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader className="bg-muted/70">
          <TableRow>
            <TableHead>#ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Payment Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <SkeletonTable />}

          {isError && !isPending && (
            <TableRow>
              <TableCell colSpan={6} className="py-6 text-center text-red-600">
                Failed to load Delivery Notes.
              </TableCell>
            </TableRow>
          )}

          {!isPending && !isError && notes.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-6 text-center text-muted-foreground"
              >
                No Delivery Notes found.
              </TableCell>
            </TableRow>
          )}

          {!isPending &&
            !isError &&
            notes.map((deliveryNote: DeliveryNote) => {
              return (
                <TableRow key={deliveryNote.id}>
                  <TableCell className="font-medium">
                    {deliveryNote.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {deliveryNote.customer?.name ?? '—'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {deliveryNote.customer?.email ?? '—'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatTimestamp(deliveryNote.date)}</TableCell>
                  <TableCell>{formatTimestamp(deliveryNote.dueDate)}</TableCell>
                  <TableCell>{deliveryNote.paymentType}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Printer size={16} />
                      </Button>

                      <DeleteItemDialog
                        name="Delivery Note"
                        id={deliveryNote.id as string}
                        onDelete={deleteDeliveryNote}
                        isPending={isDeliveryNoteDeletePending}
                        isError={isDeliveryNoteDeleteError}
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
