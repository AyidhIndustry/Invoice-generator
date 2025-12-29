'use client'

import React, { useMemo, useState } from 'react'
import { defaultMaintenanceReport } from '@/default-values/maintenance-report.default'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Trash2, Plus } from 'lucide-react'
import { CreateMaintenanceReportDTO } from '@/schemas/maintenance-report.schema'
import z from 'zod'
import { useCreateMaintenanceReport } from '@/hooks/maintenance-report/use-create-maintenance-report'
import { nf } from '@/lib/number-format'

const TAX_PERCENT = Number(process.env.NEXT_PUBLIC_TAX || 0)

const toNumber = (v: string | number) => {
  if (v === '' || v === null || v === undefined) return 0
  const n = Number(v)
  return Number.isNaN(n) ? 0 : n
}

export default function CreateMaintenanceReportForm() {
  const [formData, setFormData] = useState(defaultMaintenanceReport)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { mutate: createReport, isPending } = useCreateMaintenanceReport()

  const items = formData.repair

  /* -------------------- totals -------------------- */

  // const taxAmount = useMemo(() => (subTotal * TAX_PERCENT) / 100, [subTotal])

  // const grandTotal = useMemo(
  //   () => Number((subTotal + taxAmount).toFixed(2)),
  //   [subTotal, taxAmount],
  // )

  /* -------------------- helpers -------------------- */

  const updateItem = (idx: number, field: 'description', value: string) => {
    setFormData((prev) => ({
      ...prev,
      repair: prev.repair.map((r, i) =>
        i === idx ? { ...r, [field]: value } : r,
      ),
    }))
  }

  const addItem = () => {
    setFormData((p) => ({
      ...p,
      repair: [...p.repair, { description: '', labourHours: '', price: '' }],
    }))
  }

  const removeItem = (idx: number) => {
    setFormData((p) => ({
      ...p,
      repair:
        p.repair.length === 1
          ? [{ description: '', labourHours: '', price: '' }]
          : p.repair.filter((_, i) => i !== idx),
    }))
  }

  const fieldError = (name: string) =>
    errors[name] ? (
      <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
    ) : null

  /* -------------------- submit -------------------- */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      const payload = {
        ...formData,
        repair: formData.repair.map((r) => ({
          description: r.description.trim(),
        })),
      }

      const validated = CreateMaintenanceReportDTO.parse(payload)
      createReport(validated)
      setFormData(defaultMaintenanceReport)
    } catch (err) {
      if (err instanceof z.ZodError) {
        const map: Record<string, string> = {}
        err.issues.forEach((e) => {
          map[e.path.join('.')] = e.message
        })
        setErrors(map)
      } else {
        alert('Unexpected error occurred')
      }
    }
  }

  /* -------------------- UI -------------------- */

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* CUSTOMER */}
      <Card>
        <CardHeader>
          <CardTitle>Customer</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Customer Name</Label>
            <Input
              placeholder="Full name of the customer"
              value={formData.customer.name}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  customer: { ...p.customer, name: e.target.value },
                }))
              }
            />
            {fieldError('customer.name')}
          </div>

          <div>
            <Label>Phone Number</Label>
            <Input
              placeholder="Primary contact number"
              value={formData.customer.phoneNumber}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  customer: { ...p.customer, phoneNumber: e.target.value },
                }))
              }
            />
            {fieldError('customer.phoneNumber')}
          </div>

          <div>
            <Label>Email</Label>
            <Input
              placeholder="Billing or contact email"
              value={formData.customer.email}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  customer: { ...p.customer, email: e.target.value },
                }))
              }
            />
            {fieldError('customer.email')}
          </div>

          <div className="md:col-span-2">
            <Label>Address</Label>
            <Textarea
              placeholder="Installation or service site address"
              value={formData.customer.address}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  customer: { ...p.customer, address: e.target.value },
                }))
              }
            />
            {fieldError('customer.address')}
          </div>
        </CardContent>
      </Card>

      {/* ISSUE */}
      <Card>
        <CardHeader>
          <CardTitle>Issue Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Reported Symptoms</Label>
            <Textarea
              placeholder="Customer-reported symptoms (e.g. overheating, not starting, abnormal noise)"
              value={formData.symptoms}
              onChange={(e) =>
                setFormData((p) => ({ ...p, symptoms: e.target.value }))
              }
            />
            {fieldError('symptoms')}
          </div>

          <div>
            <Label>Cause of Issue</Label>
            <Textarea
              placeholder="Technician-identified root cause"
              value={formData.causeOfIssue}
              onChange={(e) =>
                setFormData((p) => ({ ...p, causeOfIssue: e.target.value }))
              }
            />
            {fieldError('causeOfIssue')}
          </div>
        </CardContent>
      </Card>

      {/* ITEMS */}
      <Card>
        <CardHeader>
          <CardTitle>Repair Items</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm min-w-[750px]">
              <thead className="border-b-2 border-border bg-muted">
                <tr>
                  <th className="text-left py-3 px-2 md:px-4">Description</th>

                  <th className="w-10" />
                </tr>
              </thead>

              <tbody>
                {items.map((it, idx) => {
                  const descError = errors[`repair.${idx}.description`]

                  return (
                    <tr key={idx} className="border-b align-top">
                      {/* Description */}
                      <td className="py-3 px-2 md:px-4">
                        <Input
                          placeholder="Spare part or service description"
                          value={it.description}
                          onChange={(e) =>
                            updateItem(idx, 'description', e.target.value)
                          }
                        />
                        {descError && (
                          <p className="text-xs text-red-500 mt-1">
                            {descError}
                          </p>
                        )}
                      </td>
                      {/* Delete */}
                      <td className="py-3 px-2 md:px-4 text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          type="button"
                          onClick={() => removeItem(idx)}
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
              onClick={addItem}
              className="mt-3"
            >
              <Plus size={16} className="mr-2" />
              Add Item
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* REMARK */}
      <Card>
        <CardHeader>
          <CardTitle>Engineer Remarks</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Safety notes, follow-ups, warranty remarks, or special observations"
            value={formData.remark}
            onChange={(e) =>
              setFormData((p) => ({ ...p, remark: e.target.value }))
            }
          />
          {fieldError('remark')}
        </CardContent>
      </Card>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Report'}
      </Button>
    </form>
  )
}
