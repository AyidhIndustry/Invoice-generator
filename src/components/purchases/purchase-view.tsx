'use client'

import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'
import { Loader2, TriangleAlert } from 'lucide-react'
import { useGetPurchasesById } from '@/hooks/purchases/use-get-purchase-by-id'

type Props = { id: string }

const currency = (value: number | undefined) => {
  if (value === undefined || value === null) return '—'
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 2,
  }).format(value)
}

export default function PurchaseView({ id }: Props) {
  const { data: purchase, isPending, isError } = useGetPurchasesById(id)

  const isFirestoreTimestamp = (v: any): v is { toDate: () => Date } =>
    v && typeof v === 'object' && typeof v.toDate === 'function'

  if (isPending)
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <Loader2 className="animate-spin" size={40} />
      </div>
    )

  if (isError)
    return (
      <div className="flex flex-col gap-2 items-center justify-center p-6">
        <TriangleAlert color="rgb(220,38,38)" />
        <p>There was an error finding this purchase.</p>
      </div>
    )

  if (!purchase)
    return (
      <div className="w-full h-[60vh] flex items-center justify-center text-muted-foreground">
        No purchase found.
      </div>
    )

  const { id: pid, date, description, subTotal, taxTotal, total } = purchase
  const formattedDate = isFirestoreTimestamp(purchase.date)
    ? format(purchase.date.toDate(), 'yyyy-MM-dd')
    : '—'


  return (
    <Card className="my-6 shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Purchase Details</CardTitle>
            <CardDescription className="text-sm">
              Purchase overview and summary
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <Label className="text-xs">Invoice ID</Label>
            <div className="mt-2 text-sm font-medium break-all">{pid}</div>

            <div className="mt-4">
              <Label className="text-xs">Date</Label>
              <div className="mt-2 text-sm">{formattedDate}</div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-muted-foreground">Subtotal</div>
                <div className="text-sm font-medium">{currency(subTotal)}</div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-muted-foreground">Tax</div>
                <div className="text-sm font-medium">{currency(taxTotal)}</div>
              </div>

              <Separator className="my-3" />

              <div className="flex items-center justify-between">
                <div className="text-base font-semibold">Total</div>
                <div className="text-xl font-extrabold">{currency(total)}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Label className="text-xs">Description</Label>
          <div className="mt-2 text-sm text-muted-foreground">
            {description || '—'}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
