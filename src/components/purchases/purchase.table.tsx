'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Purchase } from '@/schemas/purchase.schema'
import { SkeletonTable } from '../ui/skeleton-table'
import { useDeletePurchase } from '@/hooks/purchases/use-delete-purchase'
import { formatTimestamp } from '@/lib/format-timestring'
import { Button } from '../ui/button'
import { Eye, Printer, View } from 'lucide-react'
import DeleteItemDialog from '../dialogs/delete-item.dialog'
import Link from 'next/link'

export default function PurchasesTable({
  purchases,
  isPending,
  isError,
}: {
  purchases?: Purchase[]
  isPending: boolean
  isError: boolean
}) {
  const {
    mutate: deletePurchase,
    isPending: isPurchaseDeletePending,
    isError: isPurchaseDeleteError,
  } = useDeletePurchase()
  return (
    <div className="border rounded-md">
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
          {isPending && <SkeletonTable />}
          {isError && !isPending && (
            <TableRow>
              <TableCell colSpan={6} className="py-6 text-center text-red-600">
                Failed to load Purchases.
              </TableCell>
            </TableRow>
          )}
          {purchases && !isPending && !isError && purchases.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-6 text-center text-muted-foreground"
              >
                No Purchases found.
              </TableCell>
            </TableRow>
          )}
          {purchases &&
            !isPending &&
            !isError &&
            purchases.map((purchase: Purchase) => {
              return (
                <TableRow key={purchase.id}>
                  <TableCell className="font-medium">{purchase.id}</TableCell>
                  <TableCell>{formatTimestamp(purchase.date)}</TableCell>
                  <TableCell>{purchase.description ?? '—'}</TableCell>
                  <TableCell>{purchase.subTotal ?? '—'}</TableCell>
                  <TableCell>{purchase.taxTotal ?? '—'}</TableCell>
                  <TableCell>{purchase.total ?? '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Link href={`/purchases/${purchase.id}`} className='bg-blue-400 p-2 rounded-md'>
                        <Eye size={16} color='white'/>
                      </Link>

                      <DeleteItemDialog
                        name="Purchase"
                        id={purchase.id as string}
                        onDelete={deletePurchase}
                        isPending={isPurchaseDeletePending}
                        isError={isPurchaseDeleteError}
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
