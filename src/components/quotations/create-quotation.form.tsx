'use client'

import React, { useEffect, useMemo } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateQuotationDTOType, Quotation, QuotationSchema } from '@/schemas/quotation.schema'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { companyInfo } from '@/data/company-info'
import { numberToWords } from 'convert-number-to-words'
import { useCreateQuotation } from '@/hooks/quotations/use-create-quotation' 

export default function CreateQuotationForm() {
  const TAX_PERCENT = useMemo(
    () => Number(process.env.NEXT_PUBLIC_TAX ?? 0),
    [],
  ) // read once; NEXT_PUBLIC_ vars are embedded at build-time

  const form = useForm<Quotation>({
    resolver: zodResolver(QuotationSchema),
    defaultValues: {
      date: new Date(),
      seller: {
        name: '',
        address: '',
        VATNumber: '',
        email: '',
      } as any,
      customer: {
        name: '',
        address: '',
        VATNumber: '',
        email: '',
      } as any,
      subject: '',
      items: [
        { title: '', quantity: 1, unitPrice: 0, taxAmount: 0, unitTotal: 0 },
      ] as any,
      subTotal: 0,
      taxTotal: 0,
      total: 0,
      details: '',
    },
  })

  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
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

  // mutation hook
  const { mutate: createQuotation, isPending } = useCreateQuotation()

  useEffect(() => {
    // Compute per-item unitTotal (q * p) and taxAmount and write them into the form
    ;(watchedItems || []).forEach((it: any, idx: number) => {
      const q = Number(it?.quantity ?? 0)
      const p = Number(it?.unitPrice ?? 0)
      // ensure quantity defaults to 1 (defensive)
      const qty = q === 0 ? 1 : q
      const unitTotal = Number((qty * p).toFixed(2))

      // Only update if different to avoid unnecessary re-renders
      const existingUnitTotal = Number(it?.unitTotal ?? 0)
      if (existingUnitTotal !== unitTotal) {
        setValue(`items.${idx}.unitTotal`, unitTotal, {
          shouldDirty: true,
          shouldTouch: false,
        })
      }

      const computedTaxAmount = Number(
        ((unitTotal * (Number(TAX_PERCENT) ?? 0)) / 100).toFixed(2),
      )
      const existingTaxAmount = Number(it?.taxAmount ?? 0)
      if (existingTaxAmount !== computedTaxAmount) {
        setValue(`items.${idx}.taxAmount`, computedTaxAmount, {
          shouldDirty: true,
          shouldTouch: false,
        })
      }
    })

    // Re-read items after above potential updates
    const freshItems = (watch('items') || []) as Array<any>

    // subtotal is sum of unitTotal (without tax)
    const subtotal = freshItems.reduce((acc, it) => {
      const ut = Number(it?.unitTotal ?? 0)
      return Number((acc + ut).toFixed(2))
    }, 0)

    // taxTotal is sum of item.taxAmount
    const taxTotal = freshItems.reduce((acc, it) => {
      const ta = Number(it?.taxAmount ?? 0)
      return Number((acc + ta).toFixed(2))
    }, 0)

    const total = Number((subtotal + taxTotal).toFixed(2))

    // Push aggregate values to form
    setValue('subTotal', subtotal, { shouldDirty: true, shouldTouch: false })
    setValue('taxTotal', taxTotal, { shouldDirty: true, shouldTouch: false })
    setValue('total', total, { shouldDirty: true, shouldTouch: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watchedItems), TAX_PERCENT])

  const onSubmit = (data: CreateQuotationDTOType) => {
    console.log("clicked")
    const subtotal = (data.items || []).reduce((acc: number, it: any) => {
      const ut = Number(
        it?.unitTotal ?? Number(it?.quantity ?? 1) * Number(it?.unitPrice ?? 0),
      )
      return Number((acc + ut).toFixed(2))
    }, 0)
    const taxTotal = (data.items || []).reduce((acc: number, it: any) => {
      const ta = Number(it?.taxAmount ?? 0)
      return Number((acc + ta).toFixed(2))
    }, 0)
    const total = Number((subtotal + taxTotal).toFixed(2))

    const final: Quotation = {
      ...data,
      subTotal: subtotal,
      taxTotal,
      total,
    }

    // call your mutation
    createQuotation(final)
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Card className="p-6 bg-primary text-white from-primary to-secondary">
        <h2 className="text-2xl font-bold mb-2">{companyInfo.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm opacity-90">CR: {companyInfo.CRNumber}</p>
            <p className="text-sm opacity-90">VAT: {companyInfo.VATNumber}</p>
          </div>
          <div className="md:text-right text-sm space-y-1">
            <p>{companyInfo.address}</p>
            <p>{companyInfo.phoneNumber}</p>
            <p>{companyInfo.email}</p>
          </div>
        </div>
      </Card>

      {/* Seller & Customer */}
      <Card className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <h3 className="text-lg font-semibold mb-3 col-span-2">Customer</h3>

        <div>
          <Label>Customer Name *</Label>
          <Input
            {...register('customer.name' as const)}
            placeholder="Customer full name"
          />
        </div>
        <div>
          <Label>Customer Email</Label>
          <Input
            {...register('customer.email' as const)}
            placeholder="name@example.com"
          />
        </div>
        <div>
          <Label>VAT Number</Label>
          <Input
            {...register('customer.VATNumber' as const)}
            placeholder="VAT / Tax number (optional)"
          />
        </div>
        <div>
          <Label>Address</Label>
          <Textarea
            {...register('customer.address' as const)}
            placeholder="Street, City, State, ZIP, Country"
          />
        </div>
      </Card>

      {/* Subject */}
      <Card className="p-6 gap-2">
        <h3 className="text-lg font-semibold ">Subject</h3>
        <Textarea
          {...register('subject')}
          placeholder="Quotation subject or short description (optional)"
        />
      </Card>

      {/* Items Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Items</h3>

        <table className="w-full text-sm">
          <thead className="border-b-2 border-border bg-muted">
            <tr>
              <th
                style={{ width: '40%' }}
                className="text-left py-3 px-2 md:px-4 font-semibold text-xs md:text-sm"
              >
                Title
              </th>
              <th
                style={{ width: '10%' }}
                className="text-left py-3 px-2 md:px-4 font-semibold text-xs md:text-sm"
              >
                Qty
              </th>
              <th
                style={{ width: '15%' }}
                className="text-left py-3 px-2 md:px-4 font-semibold text-xs md:text-sm"
              >
                Unit Price
              </th>
              <th
                style={{ width: '15%' }}
                className="text-left py-3 px-2 md:px-4 font-semibold text-xs md:text-sm"
              >
                Tax ({TAX_PERCENT}%)
              </th>
              <th
                style={{ width: '15%' }}
                className="text-left py-3 px-2 md:px-4 font-semibold text-xs md:text-sm"
              >
                Line Total
              </th>
              <th style={{ width: '5%' }}></th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => {
              const qty = Number(watchedItems?.[index]?.quantity ?? 1)
              const price = Number(watchedItems?.[index]?.unitPrice ?? 0)
              const taxAmount = Number(watchedItems?.[index]?.taxAmount ?? 0)
              const unitTotal = Number(watchedItems?.[index]?.unitTotal ?? qty * price)
              // Presentation: Line total = unitTotal + taxAmount
              const lineTotal = Number((unitTotal + taxAmount).toFixed(2))

              return (
                <tr
                  key={item.id}
                  className="border-b border-border hover:bg-muted/50"
                >
                  <td className="py-3 px-2 md:px-4">
                    <Input
                      {...register(`items.${index}.title` as const)}
                      placeholder="Item title or description"
                      className="h-8 border text-xs md:text-sm"
                    />
                  </td>

                  <td className="py-3 px-2 md:px-4">
                    <Input
                      type="number"
                      {...register(`items.${index}.quantity` as const, {
                        valueAsNumber: true,
                      })}
                      placeholder="1"
                      className="h-8 border text-xs md:text-sm"
                    />
                  </td>

                  <td className="py-3 px-2 md:px-4">
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.unitPrice` as const, {
                        valueAsNumber: true,
                      })}
                      placeholder="0.00"
                      className="h-8 border text-xs md:text-sm"
                    />
                  </td>

                  <td className="py-3 px-2 md:px-4">
                    {/* display-only tax calculated from NEXT_PUBLIC_TAX */}
                    <div className="h-8 flex items-center text-xs md:text-sm">
                      {taxAmount.toFixed(2)}
                    </div>
                  </td>

                  <td className="py-3 px-2 md:px-4">
                    <div className="h-8 flex items-center text-xs md:text-sm font-semibold">
                      {lineTotal.toFixed(2)} SAR
                    </div>
                  </td>

                  <td className="py-3 px-2 md:px-4 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="h-8 w-8 p-0 hover:text-destructive"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <Button
          type="button"
          onClick={() =>
            append({
              title: '',
              quantity: 1,
              unitPrice: 0,
              taxAmount: 0,
              unitTotal: 0,
            })
          }
          variant="outline"
          size="sm"
          className="mt-4 gap-2"
        >
          <Plus size={16} /> Add Item
        </Button>
      </Card>

      <Card className="p-6">
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
        </div>
        <div className="pt-3 border-t border-border flex flex-col items-end">
          <span className="text-sm font-medium text-muted-foreground">
            Amount in words:
          </span>
          <p className="text-sm md:text-base font-semibold mt-1">
            {numberToWords(Number(watchedTotal))}
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Terms & Conditions</h3>
        <div>
          <Label htmlFor="notes">Notes & Details</Label>
          <Textarea
            id="notes"
            {...register('details' as const)}
            placeholder="Add terms, conditions, payment terms, delivery information, etc."
            className="mt-1 h-24"
          />
        </div>
      </Card>

      {/* Submit */}
      <div>
        <Button
          type="submit"
          className="mt-6 flex items-center justify-center"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating...
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </div>
    </form>
  )
}
