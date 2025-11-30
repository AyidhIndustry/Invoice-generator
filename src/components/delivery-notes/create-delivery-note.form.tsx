'use client'

import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  DeliveryNote,
  DeliveryNoteSchema,
} from '@/schemas/delivery-note.schema'
import { PaymentTypeEnum } from '@/schemas/enums/payment-type.enum'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { useCreateDeliveryNote } from '@/hooks/delivery-notes/use-create-deliverynote'


export default function DeliveryNoteForm() {
  const defaultValues: DeliveryNote = {
    invId: '',
    date: new Date(),
    dueDate: new Date(),
    customer: {
      name: '',
      address: '',
      VATNumber: '',
      email: '',
    },
    paymentType: PaymentTypeEnum.enum.CASH,
    items: [{ title: '', quantity: 1 }],
    driverDetails: '',
  }

  const form = useForm<DeliveryNote>({
    resolver: zodResolver(DeliveryNoteSchema),
    defaultValues,
  })

  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
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

  const createDeliveryNoteMutation = useCreateDeliveryNote()

  const date = watch('date')
  const dueDate = watch('dueDate')

  const onSubmit = async (data: DeliveryNote) => {
    try {
      await createDeliveryNoteMutation.mutateAsync(data)

      reset(defaultValues)
    } catch (err) {
      console.error('Create purchase failed', err)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ------------ Top Section ------------ */}
      <Card className="p-6 grid grid-cols-2 gap-4 rounded-2xl">
        {/* Invoice ID */}
        <div>
          <Label>Invoice Id</Label>
          <Input {...register('invId')} placeholder="Enter invoice id (e.g. INV-001)" />
          {errors.invId && <p className="text-xs text-destructive mt-1">{String(errors.invId.message)}</p>}
        </div>

        {/* Payment Type */}
        <div>
          <Label>Payment Type</Label>
          <Select
            onValueChange={(val) => setValue('paymentType', val as any)}
            value={watch('paymentType') as unknown as string}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Payment Type</SelectLabel>
                {Object.values(PaymentTypeEnum.enum).map((payment) => (
                  <SelectItem key={payment} value={payment}>
                    {payment}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.paymentType && <p className="text-xs text-destructive mt-1">{String(errors.paymentType.message)}</p>}
        </div>

        {/* Date */}
        <div className="flex flex-col gap-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {date ? format(date, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(day) => setValue('date', day as Date)}
              />
            </PopoverContent>
          </Popover>
          {errors.date && <p className="text-xs text-destructive mt-1">{String(errors.date.message)}</p>}
        </div>

        {/* Due Date */}
        <div className="flex flex-col gap-2">
          <Label>Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={(day) => setValue('dueDate', day as Date)}
              />
            </PopoverContent>
          </Popover>
          {errors.dueDate && <p className="text-xs text-destructive mt-1">{String(errors.dueDate.message)}</p>}
        </div>
      </Card>

      {/* ------------ Customer Info ------------ */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Customer Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Customer Name *</Label>
            <Input {...register('customer.name')} placeholder="Customer full name" />
            {errors.customer?.name && <p className="text-xs text-destructive mt-1">{String(errors.customer?.name?.message)}</p>}
          </div>

          <div>
            <Label>Email</Label>
            <Input {...register('customer.email')} placeholder="name@example.com" />
            {errors.customer?.email && <p className="text-xs text-destructive mt-1">{String(errors.customer?.email?.message)}</p>}
          </div>

          <div>
            <Label>VAT Number</Label>
            <Input {...register('customer.VATNumber')} placeholder="VAT / Tax number (optional)" />
            {errors.customer?.VATNumber && <p className="text-xs text-destructive mt-1">{String(errors.customer?.VATNumber?.message)}</p>}
          </div>

          <div className="col-span-2">
            <Label>Address</Label>
            <Textarea {...register('customer.address')} placeholder="Street, City, State, ZIP, Country" />
            {errors.customer?.address && <p className="text-xs text-destructive mt-1">{String(errors.customer?.address?.message)}</p>}
          </div>
        </div>
      </Card>

      {/* ------------ Items Table ------------ */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Items</h3>

        <table className="w-full text-sm">
          <thead className="border-b-2 border-border bg-muted">
            <tr>
              <th
                style={{ width: '70%' }}
                className="text-left py-3 px-2 md:px-4 font-semibold text-xs md:text-sm"
              >
                Title
              </th>
              <th
                style={{ width: '15%' }}
                className="text-left py-3 px-2 md:px-4 font-semibold text-xs md:text-sm"
              >
                Qty
              </th>
              <th
                style={{ width: '15%' }}
                className="text-left py-3 px-2 md:px-4 font-semibold text-xs md:text-sm"
              ></th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
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
                  {errors.items?.[index]?.title && <p className="text-xs text-destructive mt-1">{String(errors.items?.[index]?.title?.message)}</p>}
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
                  {errors.items?.[index]?.quantity && <p className="text-xs text-destructive mt-1">{String(errors.items?.[index]?.quantity?.message)}</p>}
                </td>
                <td className="py-3 px-2 md:px-4 text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="h-8 w-8 p-0 hover:text-destructive"
                    aria-label={`Remove item ${index + 1}`}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Button
          type="button"
          onClick={() => append({ title: '', quantity: 1 })}
          variant="outline"
          size="sm"
          className="mt-4 gap-2"
        >
          <Plus size={16} /> Add Item
        </Button>
      </Card>

      <Card className="p-6">
        <div>
          <Label>Driver Details</Label>
          <Textarea {...register('driverDetails')} placeholder="Driver name, vehicle no., contact, notes (optional)" />
          {errors.driverDetails && <p className="text-xs text-destructive mt-1">{String(errors.driverDetails.message)}</p>}
        </div>
      </Card>

      {/* ------------ Submit ------------ */}
      <div>
        <Button type="submit" disabled={createDeliveryNoteMutation.isPending}>
          {createDeliveryNoteMutation.isPending ? 'Creating...' : 'Create'}
        </Button>
      </div>
    </form>
  )
}
