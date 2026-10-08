'use client'

import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  DeliveryNote,
  DeliveryNoteSchema,
} from '@/schemas/delivery-note.schema'
import { PaymentType, PaymentTypeEnum } from '@/schemas/enums/payment-type.enum'
import { Invoice } from '@/schemas/invoice.schema'
import {
  getEmptyDeliveryNoteValues,
  invoiceToDeliveryNoteFields,
} from '@/lib/invoice-to-delivery-note'

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
import {
  AccountNameCombobox,
  accountToCustomer,
} from '@/components/accounts/account-name-combobox'
import { format } from 'date-fns'
import { useCreateDeliveryNote } from '@/hooks/delivery-notes/use-create-deliverynote'
import { useGetInvoices } from '@/hooks/invoices/use-get-invoice'

const MANUAL_ENTRY = '__manual__'

interface DeliveryNoteFormProps {
  /** Prefills the delivery note from this invoice. */
  initialInvoice?: Invoice
  /** Called after the delivery note is created; the form resets otherwise. */
  onCreated?: () => void
}

export default function DeliveryNoteForm({
  initialInvoice,
  onCreated,
}: DeliveryNoteFormProps = {}) {
  const form = useForm<DeliveryNote>({
    resolver: zodResolver(DeliveryNoteSchema),
    defaultValues: {
      ...getEmptyDeliveryNoteValues(),
      ...(initialInvoice && invoiceToDeliveryNoteFields(initialInvoice)),
    },
  })

  const {
    control,
    handleSubmit,
    register,
    setValue,
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

  const { data: invoices = [], isPending: isInvoicesPending } = useGetInvoices()

  const date = useWatch({ control, name: 'date' })
  const dueDate = useWatch({ control, name: 'dueDate' })
  const paymentType = useWatch({ control, name: 'paymentType' })

  const applyInvoiceFields = (invoice?: Invoice) => {
    const empty = getEmptyDeliveryNoteValues()
    const fields = invoice
      ? invoiceToDeliveryNoteFields(invoice)
      : { invId: empty.invId, customer: empty.customer, items: empty.items }
    const options = { shouldValidate: Boolean(invoice), shouldDirty: true }

    setValue('invId', fields.invId, options)
    setValue('customer', fields.customer, options)
    setValue('items', fields.items, options)
  }

  const handleInvoiceSelect = (value: string) => {
    if (value === MANUAL_ENTRY) {
      applyInvoiceFields(undefined)
      return
    }

    const selected = invoices.find((invoice) => invoice.id === value)
    if (selected) applyInvoiceFields(selected)
  }

  const onSubmit = async (data: DeliveryNote) => {
    try {
      await createDeliveryNoteMutation.mutateAsync(data)
      if (onCreated) {
        onCreated()
      } else {
        reset(getEmptyDeliveryNoteValues())
      }
    } catch (err) {
      console.error('Failed to create delivery note:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl">
        <div className="space-y-2">
          <Label>Invoice Id</Label>

          <Select
            onValueChange={handleInvoiceSelect}
            defaultValue={initialInvoice?.id ?? MANUAL_ENTRY}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select invoice (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Invoices</SelectLabel>
                <SelectItem value={MANUAL_ENTRY}>Enter manually</SelectItem>
                {isInvoicesPending && (
                  <SelectItem value="__loading__" disabled>
                    Loading invoices...
                  </SelectItem>
                )}
                {!isInvoicesPending &&
                  invoices.map((invoice) => (
                    <SelectItem key={invoice.id} value={invoice.id}>
                      {invoice.id} — {invoice.customer?.name ?? '—'}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input
            {...register('invId')}
            placeholder="Enter invoice id (e.g. INV-001)"
            className="mt-2"
          />
          {errors.invId && (
            <p className="text-xs text-destructive mt-1">
              {String(errors.invId.message)}
            </p>
          )}
        </div>

        <div>
          <Label>Payment Type</Label>
          <Select
            onValueChange={(val) => setValue('paymentType', val as PaymentType)}
            value={paymentType}
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
          {errors.paymentType && (
            <p className="text-xs text-destructive mt-1">
              {String(errors.paymentType.message)}
            </p>
          )}
        </div>

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
                onSelect={(day) => day && setValue('date', day)}
              />
            </PopoverContent>
          </Popover>
          {errors.date && (
            <p className="text-xs text-destructive mt-1">
              {String(errors.date.message)}
            </p>
          )}
        </div>

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
                onSelect={(day) => day && setValue('dueDate', day)}
              />
            </PopoverContent>
          </Popover>
          {errors.dueDate && (
            <p className="text-xs text-destructive mt-1">
              {String(errors.dueDate.message)}
            </p>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Customer Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Name */}
          <div className="w-full">
            <Label>Customer Name *</Label>
            <Controller
              control={control}
              name="customer.name"
              render={({ field }) => (
                <AccountNameCombobox
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onSelect={(account) =>
                    setValue('customer', accountToCustomer(account), {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  className="w-full"
                />
              )}
            />
            {errors.customer?.name && (
              <p className="text-xs text-destructive mt-1">
                {String(errors.customer?.name?.message)}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="w-full">
            <Label>Email</Label>
            <Input
              {...register('customer.email')}
              placeholder="name@example.com"
              className="w-full"
            />
            {errors.customer?.email && (
              <p className="text-xs text-destructive mt-1">
                {String(errors.customer?.email?.message)}
              </p>
            )}
          </div>

          {/* VAT Number */}
          <div className="w-full">
            <Label>VAT Number</Label>
            <Input
              {...register('customer.VATNumber')}
              placeholder="VAT / Tax number (optional)"
              className="w-full"
            />
            {errors.customer?.VATNumber && (
              <p className="text-xs text-destructive mt-1">
                {String(errors.customer?.VATNumber?.message)}
              </p>
            )}
          </div>

          {/* Address — full width below md AND on md spans both columns */}
          <div className="w-full col-span-1 md:col-span-2">
            <Label>Address</Label>
            <Textarea
              {...register('customer.address')}
              placeholder="Street, City, State, ZIP, Country"
              className="w-full"
            />
            {errors.customer?.address && (
              <p className="text-xs text-destructive mt-1">
                {String(errors.customer?.address?.message)}
              </p>
            )}
          </div>
        </div>
      </Card>

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
              />
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
                  {errors.items?.[index]?.title && (
                    <p className="text-xs text-destructive mt-1">
                      {String(errors.items?.[index]?.title?.message)}
                    </p>
                  )}
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
                  {errors.items?.[index]?.quantity && (
                    <p className="text-xs text-destructive mt-1">
                      {String(errors.items?.[index]?.quantity?.message)}
                    </p>
                  )}
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
          <Textarea
            {...register('driverDetails')}
            placeholder="Driver name, vehicle no., contact, notes (optional)"
          />
          {errors.driverDetails && (
            <p className="text-xs text-destructive mt-1">
              {String(errors.driverDetails.message)}
            </p>
          )}
        </div>
      </Card>

      <div>
        <Button type="submit" disabled={createDeliveryNoteMutation.isPending}>
          {createDeliveryNoteMutation.isPending ? 'Creating...' : 'Create'}
        </Button>
      </div>
    </form>
  )
}
