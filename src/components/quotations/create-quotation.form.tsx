'use client'

import React, { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { companyInfo } from '@/data/company-info'
import { numberToWords } from 'convert-number-to-words'
import { useCreateQuotation } from '@/hooks/quotations/use-create-quotation'
import {
  CreateQuotationDTO,
  CreateQuotationDTOType,
} from '@/schemas/quotation.schema'

const defaultItem = () => ({
  title: '',
  quantity: 1,
  unitPrice: 0,
  taxAmount: 0,
  unitTotal: 0,
})

export default function CreateQuotationForm() {
  const TAX_PERCENT = useMemo(() => {
    const v = Number(process.env.NEXT_PUBLIC_TAX)
    return Number.isFinite(v) ? v : 0
  }, [])

  const { mutate: createQuotation, isPending } = useCreateQuotation()

  const [customer, setCustomer] = useState({
    name: '',
    address: '',
    VATNumber: '',
    email: '',
  })

  const [subject, setSubject] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState([defaultItem()])
  const [validationErrors, setValidationErrors] = useState<string[] | null>(
    null,
  )

  const calculated = useMemo(() => {
    const computed = items.map((it) => {
      const qty = Number(it.quantity) || 0
      const price = Number(it.unitPrice) || 0
      const unitTotal = Number((qty * price).toFixed(2))
      const taxAmount = Number(((unitTotal * TAX_PERCENT) / 100).toFixed(2))
      const lineTotal = Number((unitTotal + taxAmount).toFixed(2))
      return {
        ...it,
        quantity: qty,
        unitPrice: price,
        unitTotal,
        taxAmount,
        lineTotal,
      }
    })

    const subTotal = Number(
      computed.reduce((s, it) => s + it.unitTotal, 0).toFixed(2),
    )
    const taxTotal = Number(
      computed.reduce((s, it) => s + it.taxAmount, 0).toFixed(2),
    )
    const total = Number((subTotal + taxTotal).toFixed(2))

    return { computed, subTotal, taxTotal, total }
  }, [items, TAX_PERCENT])

  function updateItem(
    index: number,
    patch: Partial<ReturnType<typeof defaultItem>>,
  ) {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    )
  }

  function addItem() {
    setItems((prev) => [...prev, defaultItem()])
  }

  function removeItem(index: number) {
    setItems((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== index),
    )
  }

  function buildPayload(): CreateQuotationDTOType {
    return {
      customer,
      subject,
      items: calculated.computed.map((it) => ({
        title: it.title,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        taxAmount: it.taxAmount,
        unitTotal: it.unitTotal,
      })),
      subTotal: calculated.subTotal,
      taxTotal: calculated.taxTotal,
      total: calculated.total,
      notes,
    } as CreateQuotationDTOType
  }

  // validate with runtime schema if available
  function runRuntimeValidation(payload: CreateQuotationDTOType) {
    setValidationErrors(null)

    // If CreateQuotationDTO has safeParse (zod-like), use it
    const anySchema: any = CreateQuotationDTO
    if (anySchema && typeof anySchema.safeParse === 'function') {
      const result = anySchema.safeParse(payload)
      if (!result.success) {
        const errs: string[] = []
        const issues = result.error?.issues ?? []
        for (const issue of issues) {
          errs.push(`${issue.path.join('.')} — ${issue.message}`)
        }
        setValidationErrors(errs)
        return false
      }
      return true
    }

    // If it has parse (could throw), try/catch
    if (anySchema && typeof anySchema.parse === 'function') {
      try {
        anySchema.parse(payload)
        return true
      } catch (err: any) {
        // attempt to extract messages
        if (err?.issues && Array.isArray(err.issues)) {
          setValidationErrors(
            err.issues.map((i: any) => `${i.path.join('.')} — ${i.message}`),
          )
        } else if (err?.message) {
          setValidationErrors([err.message])
        } else {
          setValidationErrors(['Payload failed schema.parse validation'])
        }
        return false
      }
    }

    // No runtime validator found — treat as OK (TypeScript compile-time only)
    return true
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    setValidationErrors(null)

    // minimal client-side checks
    if (!customer.name?.trim()) {
      setValidationErrors(['customer.name — Customer name is required.'])
      return
    }
    if (items.length === 0) {
      setValidationErrors(['items — Add at least one item.'])
      return
    }

    const payload = buildPayload()

    // runtime schema validation (if available)
    const ok = runRuntimeValidation(payload)
    if (!ok) {
      // runRuntimeValidation already populated validationErrors
      return
    }

    try {
      // await the mutation (this will trigger toasts via your hook)
      await createQuotation(payload as any)

      // reset form only after successful creation
      setCustomer({ name: '', address: '', VATNumber: '', email: '' })
      setSubject('')
      setNotes('')
      setItems([defaultItem()])
      setValidationErrors(null)
    } catch (err) {
      // do not toast here — your hook handles onError toasting.
      // optionally keep any minimal client-side handling here (none required)
      console.error('createQuotation failed', err)
    }
  }

  const fmt = (n: number) => `${n.toFixed(2)} SAR`

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
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

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-3 col-span-2">Customer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Customer Name *</Label>
            <Input
              placeholder="Customer full name"
              value={customer.name}
              onChange={(e) =>
                setCustomer((s) => ({ ...s, name: e.target.value }))
              }
            />
          </div>
          <div>
            <Label>Customer Email</Label>
            <Input
              placeholder="name@example.com"
              value={customer.email}
              onChange={(e) =>
                setCustomer((s) => ({ ...s, email: e.target.value }))
              }
            />
          </div>
          <div>
            <Label>VAT Number</Label>
            <Input
              placeholder="VAT / Tax number (optional)"
              value={customer.VATNumber}
              onChange={(e) =>
                setCustomer((s) => ({ ...s, VATNumber: e.target.value }))
              }
            />
          </div>
          <div>
            <Label>Address</Label>
            <Textarea
              placeholder="Street, City, State, ZIP, Country"
              value={customer.address}
              onChange={(e) =>
                setCustomer((s) => ({ ...s, address: e.target.value }))
              }
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 gap-2">
        <h3 className="text-lg font-semibold ">Subject</h3>
        <Textarea
          placeholder="Quotation subject or short description (optional)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Items</h3>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
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
              {calculated.computed.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-border hover:bg-muted/50"
                >
                  <td className="py-3 px-2 md:px-4">
                    <Input
                      placeholder="Item title or description"
                      className="h-8 border text-xs md:text-sm w-full"
                      value={item.title}
                      onChange={(e) =>
                        updateItem(idx, { title: e.target.value })
                      }
                    />
                  </td>
                  <td className="py-3 px-2 md:px-4">
                    <Input
                      type="number"
                      placeholder="1"
                      className="h-8 border text-xs md:text-sm w-full"
                      value={String(item.quantity)}
                      min={0}
                      onChange={(e) =>
                        updateItem(idx, {
                          quantity: Math.max(0, Number(e.target.value) || 0),
                        })
                      }
                    />
                  </td>
                  <td className="py-3 px-2 md:px-4">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="h-8 border text-xs md:text-sm w-full"
                      value={String(item.unitPrice)}
                      onChange={(e) =>
                        updateItem(idx, {
                          unitPrice: Number(e.target.value) || 0,
                        })
                      }
                    />
                  </td>
                  <td className="py-3 px-2 md:px-4">
                    <div className="h-8 flex items-center text-xs md:text-sm">
                      {item.taxAmount.toFixed(2)}
                    </div>
                  </td>
                  <td className="py-3 px-2 md:px-4">
                    <div className="h-8 flex items-center text-xs md:text-sm font-semibold">
                      {item.lineTotal.toFixed(2)} SAR
                    </div>
                  </td>
                  <td className="py-3 px-2 md:px-4 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(idx)}
                      className="h-8 w-8 p-0 hover:text-destructive"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button
          type="button"
          onClick={addItem}
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
              {fmt(calculated.subTotal)}
            </strong>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Tax total</span>
            <strong className="text-sm md:text-base lg:text-lg">
              {fmt(calculated.taxTotal)}
            </strong>
          </div>

          <div className="flex justify-between pt-2 border-t border-border">
            <span className="text-base font-medium">Total</span>
            <strong className="font-semibold text-lg md:text-xl lg:text-2xl">
              {fmt(calculated.total)}
            </strong>
          </div>
        </div>
        <div className="pt-3 border-t border-border flex flex-col items-end">
          <span className="text-sm font-medium text-muted-foreground">
            Amount in words:
          </span>
          <p className="text-sm md:text-base font-semibold mt-1">
            {calculated.total
              ? numberToWords(Number(calculated.total)).toUpperCase()
              : ''}
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Terms & Conditions</h3>
        <div>
          <Label htmlFor="notes">Notes & Details</Label>
          <Textarea
            id="notes"
            placeholder="Add terms, conditions, payment terms, delivery information, etc."
            className="mt-1 h-24"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </Card>

      {validationErrors && (
        <div className="text-sm text-destructive">
          <strong>Validation errors:</strong>
          <ul className="list-disc ml-5">
            {validationErrors.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        </div>
      )}

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
