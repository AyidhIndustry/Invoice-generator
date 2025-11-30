'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CreatePurchaseDTO,
  CreatePurchaseDTOType,
} from '@/schemas/purchase.schema'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '../ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Calendar } from '../ui/calendar'
import { format } from 'date-fns'
import { ChevronDownIcon, Loader2 } from 'lucide-react'
import { useCreatePurchase } from '@/hooks/purchases/use-create-purchase'

const TAX_PERCENT =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_TAX
    ? Number(process.env.NEXT_PUBLIC_TAX)
    : 0

export const CreatePurchaseForm = () => {
  const { mutate, isPending } = useCreatePurchase()

  const defaultValues: CreatePurchaseDTOType = {
    date: new Date(),
    description: '',
    subTotal: undefined,
    taxTotal: undefined,
    total: undefined,
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreatePurchaseDTOType>({
    resolver: zodResolver(CreatePurchaseDTO),
    defaultValues,
  })

  const date = watch('date')
  const subTotal = watch('subTotal')

  // Auto calculate tax + total
  useEffect(() => {
    const sub =
      subTotal === undefined || subTotal === null ? undefined : Number(subTotal)

    if (sub === undefined || !Number.isFinite(sub) || sub === 0) {
      setValue('taxTotal', undefined, { shouldDirty: true })
      setValue('total', undefined, { shouldDirty: true })
      setValue('subTotal', undefined, {shouldDirty: true })
      return
    }

    const tax = +(sub * (TAX_PERCENT / 100))
    const total = sub + tax

    setValue('taxTotal', Number(tax.toFixed(2)), { shouldDirty: true })
    setValue('total', Number(total.toFixed(2)), { shouldDirty: true })
  }, [subTotal, setValue])

  const onSubmit = (data: CreatePurchaseDTOType) => {
    const sub = Number(data.subTotal ?? 0)
    const tax = Number(data.taxTotal ?? 0)
    const total = Number(data.total ?? sub + tax)

    const payload = {
      ...data,
      subTotal: sub,
      taxTotal: tax,
      total,
    }

    mutate(payload, {
      onSuccess: () => {
        reset(defaultValues)
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent className="space-y-4">
          {/* DATE */}
          <div className="space-y-1 w-full md:w-1/2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full text-left justify-between bg-transparent"
                  type="button"
                  disabled={isPending}
                >
                  {date ? format(date as Date, 'PPP') : 'Pick a date'}
                  <ChevronDownIcon className="w-4 h-4 text-gray-600" />
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

          {/* DESCRIPTION */}
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              {...register('description')}
              placeholder="Enter description"
              disabled={isPending}
            />
            {errors.description && (
              <p className="text-red-500 text-xs">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* SUBTOTAL */}
          <div className="space-y-1">
            <Label>Amount (excl VAT)*</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="Enter the total amount excluding the tax"
              disabled={isPending}
              {...register('subTotal', {
                setValueAs: (v) =>
                  v === '' || v === null ? undefined : Number(v),
              })}
            />
            {errors.subTotal && (
              <p className="text-red-500 text-xs">{errors.subTotal.message}</p>
            )}
          </div>

          {/* TAX */}
          <div className="space-y-1">
            <Label>Total Tax ({TAX_PERCENT}%)</Label>
            <Input
              type="number"
              step="0.01"
              readOnly
              disabled
              placeholder="Tax"
              {...register('taxTotal')}
            />
          </div>

          {/* TOTAL */}
          <div className="space-y-1">
            <Label>Total (SAR)</Label>
            <Input
              type="number"
              step="0.01"
              readOnly
              disabled
              placeholder="Grand total"
              {...register('total')}
            />
          </div>
        </CardContent>
      </Card>

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
    </form>
  )
}
