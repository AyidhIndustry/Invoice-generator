'use client'

import React, { useEffect, useState } from 'react'
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

const TAX_PERCENT = Number(process.env.NEXT_PUBLIC_TAX || 0)

export default function CreateMaintenanceReportForm() {
  const [formData, setFormData] = useState(defaultMaintenanceReport)
  const {
    mutate: CreateMaintenanceReport,
    isPending: isCreateMaintenanceReportPending,
  } = useCreateMaintenanceReport()
  const items = formData.repair

  // -------------------------
  // Repair item helpers
  // -------------------------
  const updateItem = (
    idx: number,
    field: 'description' | 'price' | 'labourHours',
    value: any,
  ) => {
    const copy = [...items]
    copy[idx] = { ...copy[idx], [field]: value }
    setFormData({ ...formData, repair: copy })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      repair: [
        ...items,
        { description: '', labourHours: '', price: '' }, // ← must be empty strings
      ],
    })
  }

  const removeItem = (idx: number) => {
    const copy = items.filter((_, i) => i !== idx)
    setFormData({
      ...formData,
      repair: copy.length
        ? copy
        : [{ description: '', labourHours: '', price: '' }], // ← keep placeholders
    })
  }

  const grandTotal = items.reduce((sum, i) => sum + Number(i.price || 0), 0)

  useEffect(() => {
    setFormData((f) => ({ ...f, totalCost: grandTotal }))
  }, [grandTotal])

  const handleSubmit = () => {
    try {
      const payload = {
        ...formData,
        repair: formData.repair.map((r) => ({
          ...r,
          labourHours: Number(r.labourHours || 0),
          price: Number(r.price || 0),
        })),
        totalCost: Number(formData.totalCost),
      }
      const validated = CreateMaintenanceReportDTO.parse(payload)
      CreateMaintenanceReport(validated)
    } catch (err) {
      if (err instanceof z.ZodError) {
        alert(
          'Form contains invalid or missing data. Please review all fields.',
        )
      } else {
        console.error('Unexpected error:', err)
        alert('Something went wrong while saving the report.')
      }
    }
  }

  return (
    <form className="space-y-6">
      {/* CUSTOMER */}
      <Card>
        <CardHeader>
          <CardTitle>Customer</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Customer Name</Label>
            <Input
              placeholder="Customer full name"
              value={formData.customer.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customer: { ...formData.customer, name: e.target.value },
                })
              }
            />
          </div>

          <div>
            <Label>Phone Number</Label>
            <Input
              placeholder="Primary contact number"
              value={formData.customer.phoneNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customer: {
                    ...formData.customer,
                    phoneNumber: e.target.value,
                  },
                })
              }
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              placeholder="Billing or contact email"
              value={formData.customer.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customer: { ...formData.customer, email: e.target.value },
                })
              }
            />
          </div>

          <div className="md:col-span-2">
            <Label>Address</Label>
            <Textarea
              placeholder="Site address where the machine is installed"
              value={formData.customer.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customer: { ...formData.customer, address: e.target.value },
                })
              }
            />
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
              placeholder="Customer-reported symptoms (e.g. motor overheating, generator not starting, abnormal noise)"
              value={formData.symptoms}
              onChange={(e) =>
                setFormData({ ...formData, symptoms: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Cause of Issue</Label>
            <Textarea
              placeholder="Technician-identified cause (e.g. winding short, bearing failure, overload, loose connections)"
              value={formData.causeOfIssue}
              onChange={(e) =>
                setFormData({ ...formData, causeOfIssue: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* REMARKS */}
      <Card>
        <CardHeader>
          <CardTitle>Engineer Remarks</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Additional Notes</Label>
          <Textarea
            placeholder="Any special observations, safety warnings, or follow-up actions"
            value={formData.remark}
            onChange={(e) =>
              setFormData({ ...formData, remark: e.target.value })
            }
          />
        </CardContent>
      </Card>

      {/* REPAIR ITEMS */}
      <Card>
        <CardHeader className="px-6">
          <CardTitle>Repair Items (Tax {TAX_PERCENT}%)</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm min-w-[750px]">
              <thead className="border-b-2 border-border bg-muted">
                <tr>
                  <th className="text-left py-3 px-2 md:px-4">Description</th>
                  <th className="text-left w-32 py-3 px-2 md:px-4">
                    Labour Hours
                  </th>
                  <th className="text-left w-32 py-3 px-2 md:px-4">Price</th>
                </tr>
              </thead>

              <tbody>
                {items.map((it, idx) => {
                  return (
                    <tr key={idx} className="border-b">
                      <td className="py-3 px-2 md:px-4">
                        <Input
                          placeholder="Spare part or service description"
                          value={it.description}
                          onChange={(e) =>
                            updateItem(idx, 'description', e.target.value)
                          }
                        />
                      </td>
                      <td className="py-3 px-2 md:px-4">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={it.labourHours}
                          onChange={
                            (e) =>
                              updateItem(idx, 'labourHours', e.target.value) // ← store string
                          }
                        />
                      </td>
                      <td>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={it.price}
                          onChange={
                            (e) => updateItem(idx, 'price', e.target.value) // ← store string
                          }
                        />
                      </td>

                      <td className="py-3 px-2 md:px-4 text-center">
                        <Button
                          size="sm"
                          variant="ghost"
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

      {/* TOTAL */}
      <Card>
        <CardContent className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formData.totalCost.toFixed(2)}</span>
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="ml-auto"
        disabled={isCreateMaintenanceReportPending}
        onClick={handleSubmit}
      >
        {isCreateMaintenanceReportPending ? 'Creating...' : 'Create Report'}
      </Button>
    </form>
  )
}
