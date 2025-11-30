'use client'

import React, { useState } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { MonthPicker } from './ui/month-picker'

export type FilterState = {
  type: 'all' | 'date' | 'month'
  date?: string   // ISO: "YYYY-MM-DD"
  month?: string  // "YYYY-MM"
}

type Props = {
  /**
   * Called when user clicks Apply.
   * Parent should pass a mutation/refetch handler that accepts the filter object.
   */
  onApply: (f: FilterState) => void
}

export default function Filter({ onApply }: Props) {
  const [state, setState] = useState<FilterState>({ type: 'all' })

  // handlers
  const setType = (t: FilterState['type']) =>
    setState(prev => ({ ...prev, type: t, // clear the other values
      ...(t === 'date' ? { month: undefined } : {}),
      ...(t === 'month' ? { date: undefined } : {}),
    }))

  const setDate = (d?: Date) => {
    if (!d) return setState(prev => ({ ...prev, date: undefined }))
    const iso = format(d, 'yyyy-MM-dd')
    setState(prev => ({ ...prev, type: 'date', date: iso, month: undefined }))
  }

  const setMonth = (m?: string) => {
    if (!m) return setState(prev => ({ ...prev, month: undefined }))
    setState(prev => ({ ...prev, type: 'month', month: m, date: undefined }))
  }

  const handleReset = () => setState({ type: 'all' })
  const handleApply = () => onApply(state)

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="min-w-[180px]">
        <Label>Filter</Label>
        <Select value={state.type} onValueChange={(v) => setType(v as any)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {state.type === 'date' && (
        <div>
          <Label>Select date</Label>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-10 w-[200px] justify-start">
                  {state.date ? format(new Date(state.date), 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0">
                <Calendar
                  mode="single"
                  selected={state.date ? new Date(state.date) : undefined}
                  onSelect={(d) => setDate(d as Date)}
                />
              </PopoverContent>
            </Popover>

            {state.date && <Button size="sm" variant="ghost" onClick={() => setDate(undefined)}>Clear</Button>}
          </div>
        </div>
      )}

      {state.type === 'month' && (
        <div>
          <Label>Select month</Label>
          <div className="flex items-center gap-2">
            <MonthPicker value={state.month} onChange={(v) => setMonth(v)} />
            {state.month && <Button size="sm" variant="ghost" onClick={() => setMonth(undefined)}>Clear</Button>}
          </div>
        </div>
      )}

      <div className="ml-auto flex gap-2">
        <Button variant="outline" onClick={handleReset}>Reset</Button>
        <Button onClick={handleApply}>Apply</Button>
      </div>
    </div>
  )
}
