'use client'

import React, { useEffect, useMemo } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { numberToWords } from 'convert-number-to-words'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Plus, Trash2 } from 'lucide-react'
import { useCreateInvoice } from '@/hooks/invoices/use-create-invoice'

const TAX_PERCENT = (() => {
  const raw =
    typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_TAX : undefined
  const n = Number(raw ?? 0)
  return Number.isFinite(n) ? n : 0
})()

const taxPercent = TAX_PERCENT

export default function CreateInvoiceForm() {
  const { mutateAsync: createInvoice, isPending } = useCreateInvoice()

  const form = useForm<any>({
    defaultValues: {
      date: new Date(),
      dueDate: undefined,
      customer: {
        name: '',
        email: '',
        address: '',
        phoneNumber: '',
        VATNumber: '',
      },
      items: [
        { title: '', quantity: 1, unitPrice: 0, taxAmount: 0, unitTotal: 0 },
      ],
      subTotal: 0,
      taxTotal: 0,
      total: 0,
      remarks: '',
      // bankDetails: {
      //   bankName: '',
      //   IBAN: '',
      //   accountNumber: '',
      // },
    },
  })

  const {
    control,
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = form

  const {
    fields: items,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'items',
  })

  const watchedItems = watch('items') || []
  const watchedSubTotal = watch('subTotal') ?? 0
  const watchedTaxTotal = watch('taxTotal') ?? 0
  const watchedTotal = watch('total') ?? 0
  const date = watch('date')
  const dueDate = watch('dueDate')

  useEffect(() => {
    ;(watchedItems || []).forEach((it: any, idx: number) => {
      const q = Number(it?.quantity ?? 0)
      const p = Number(it?.unitPrice ?? 0)
      const computedUnitTotal = Number((q * p).toFixed(2))

      if (Number(it?.unitTotal ?? -1) !== computedUnitTotal) {
        setValue(`items.${idx}.unitTotal`, computedUnitTotal, {
          shouldDirty: true,
          shouldTouch: false,
        })
      }

      const computedTaxAmount = Number(
        ((computedUnitTotal * TAX_PERCENT) / 100).toFixed(2),
      )

      if (Number(it?.taxAmount ?? -1) !== computedTaxAmount) {
        setValue(`items.${idx}.taxAmount`, computedTaxAmount, {
          shouldDirty: true,
          shouldTouch: false,
        })
      }
    })

    const freshItems = (watch('items') || []) as any[]

    const subtotal = freshItems.reduce((acc, it) => {
      return acc + Number(it?.unitTotal ?? 0)
    }, 0)

    const taxTotal = freshItems.reduce((acc, it) => {
      return acc + Number(it?.taxAmount ?? 0)
    }, 0)

    const total = Number((subtotal + taxTotal).toFixed(2))

    setValue('subTotal', Number(subtotal.toFixed(2)), {
      shouldDirty: true,
      shouldTouch: false,
    })
    setValue('taxTotal', Number(taxTotal.toFixed(2)), {
      shouldDirty: true,
      shouldTouch: false,
    })
    setValue('total', total, { shouldDirty: true, shouldTouch: false })
  }, [JSON.stringify(watchedItems), setValue, watch])

  const amountInWords = useMemo(() => {
    const n = Number(watchedTotal ?? 0)
    if (!isFinite(n)) return ''

    const whole = Math.floor(Math.abs(n))
    const fraction = Math.round((Math.abs(n) - whole) * 100) // two decimals

    const wholeWordsRaw = whole === 0 ? 'zero' : numberToWords(whole)
    const wholeWords =
      wholeWordsRaw.charAt(0).toUpperCase() + wholeWordsRaw.slice(1)

    const fractionPart =
      fraction > 0 ? ` and ${String(fraction).padStart(2, '0')}/100` : ''
    const sign = n < 0 ? 'Minus ' : ''

    return `${sign}${wholeWords}${fractionPart} Saudi Riyals Only`
  }, [watchedTotal])

  const onSubmit = async (data: any) => {
    try {
      // We trust the computed totals from useEffect and submit as-is
      const payload = {
        ...data,
        subTotal: Number((data.subTotal ?? 0).toFixed?.(2) ?? data.subTotal),
        taxTotal: Number((data.taxTotal ?? 0).toFixed?.(2) ?? data.taxTotal),
        total: Number((data.total ?? 0).toFixed?.(2) ?? data.total),
      }

      console.log('Invoice submit payload:', payload)

      await createInvoice(payload)
    } catch (error) {
      console.error('Failed to create invoice:', error)
      // optional: if you use a toast system here, call it
      // toast.error('Failed to create invoice')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="px-6">
          <CardTitle>New Invoice</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full text-left justify-start"
                    type="button"
                  >
                    {date ? format(date as Date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date as Date}
                    onSelect={(d) => setValue('date', d as Date)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full text-left justify-start"
                    type="button"
                  >
                    {dueDate ? format(dueDate as Date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate as Date}
                    onSelect={(d) => setValue('dueDate', d as Date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer */}
      <Card>
        <CardHeader className="px-6">
          <CardTitle>Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name *</Label>
              <Input
                {...register('customer.name')}
                placeholder="Customer full name"
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                {...register('customer.email')}
                placeholder="name@example.com"
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                {...register('customer.phoneNumber')}
                placeholder="+966..."
              />
            </div>

            <div>
              <Label>VAT Number</Label>
              <Input
                {...register('customer.VATNumber')}
                placeholder="VAT / Tax no. (optional)"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <Label>Address</Label>
              <Textarea
                {...register('customer.address')}
                placeholder="Street, City, ZIP, Country"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader className="px-6">
          <CardTitle>Items (tax {taxPercent}% per item)</CardTitle>
        </CardHeader>

        <CardContent className="px-6">
          {/* Scrollable container */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm min-w-[750px]">
              <thead className="border-b-2 border-border bg-muted">
                <tr>
                  <th className="text-left py-3 px-2 md:px-4">Title</th>
                  <th className="text-left py-3 px-2 md:px-4 w-24">Qty</th>
                  <th className="text-left py-3 px-2 md:px-4 w-32">
                    Unit Price
                  </th>
                  <th className="text-left py-3 px-2 md:px-4 w-32">Tax</th>
                  <th className="text-left py-3 px-2 md:px-4 w-32">
                    Unit Total
                  </th>
                  <th className="w-12" />
                </tr>
              </thead>

              <tbody>
                {items.map((it, idx) => {
                  const qty = Number(watchedItems?.[idx]?.quantity ?? 0)
                  const price = Number(watchedItems?.[idx]?.unitPrice ?? 0)
                  const unitTotal = Number((qty * price).toFixed(2))
                  const taxAmount = Number(watchedItems?.[idx]?.taxAmount ?? 0)

                  return (
                    <tr
                      key={it.id}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <td className="py-3 px-2 md:px-4">
                        <Input
                          {...register(`items.${idx}.title` as const)}
                          placeholder="Item title"
                          className="w-full"
                        />
                      </td>

                      <td className="py-3 px-2 md:px-4">
                        <Input
                          type="number"
                          {...register(`items.${idx}.quantity` as const, {
                            valueAsNumber: true,
                          })}
                          className="h-8 w-full"
                        />
                      </td>

                      <td className="py-3 px-2 md:px-4">
                        <Input
                          type="number"
                          step="0.01"
                          {...register(`items.${idx}.unitPrice` as const, {
                            valueAsNumber: true,
                          })}
                          className="h-8 w-full"
                        />
                      </td>

                      <td className="py-3 px-2 md:px-4">
                        <Input
                          type="number"
                          step="0.01"
                          value={taxAmount.toFixed(2)}
                          readOnly
                          className="h-8 bg-muted/30 w-full"
                          onChange={() => {}}
                        />
                      </td>

                      <td className="py-3 px-2 md:px-4">
                        <div className="h-8 flex items-center">
                          {unitTotal.toFixed(2)}
                        </div>
                      </td>

                      <td className="py-3 px-2 md:px-4 text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(idx)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  title: '',
                  quantity: 1,
                  unitPrice: 0,
                  taxAmount: 0,
                  unitTotal: 0,
                })
              }
              className="gap-2"
            >
              <Plus size={16} /> Add Item
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Totals & Bank */}
      <Card>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Subtotal</span>
              <strong className="text-sm md:text-base lg:text-lg">
                {Number(watchedSubTotal).toFixed(2)} SAR
              </strong>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Tax total</span>
              <strong className="text-sm md:text-base lg:text-lg">
                {Number(watchedTaxTotal).toFixed(2)} SAR
              </strong>
            </div>

            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-base font-medium">Total</span>
              <strong className="font-semibold text-lg md:text-xl lg:text-2xl">
                {Number(watchedTotal).toFixed(2)} SAR
              </strong>
            </div>

            {/* Amount in words */}
            <div className="pt-3 border-t border-border">
              <span className="text-sm font-medium text-muted-foreground">
                Amount in words:
              </span>
              <p className="text-sm md:text-base font-semibold mt-1">
                {amountInWords}
              </p>
            </div>
          </div>

          {/* Optional bank details
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Bank Name</Label>
              <Input
                {...register('bankDetails.bankName' as const)}
                placeholder="Bank name (optional)"
              />
            </div>

            <div>
              <Label>IBAN</Label>
              <Input
                {...register('bankDetails.IBAN' as const)}
                placeholder="IBAN (optional)"
              />
            </div>

            <div>
              <Label>Account Number</Label>
              <Input
                {...register('bankDetails.accountNumber' as const)}
                placeholder="Account no. (optional)"
              />
            </div>
          </div> */}
        </CardContent>
      </Card>

      {/* Notes and Submit */}
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Remarks</Label>
              <Textarea
                {...register('remarks')}
                placeholder="Any terms, payment instructions, validity..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-end justify-end">
        <Button type="submit" className="ml-auto" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  )
}
