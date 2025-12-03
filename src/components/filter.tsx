'use client'

import React from 'react'
import { format } from 'date-fns'
import { FilterType, Mode } from '@/schemas/filter.type'
import { Label } from '@/components/ui/label'
import {
  Select, SelectTrigger, SelectValue, SelectContent,
  SelectGroup, SelectItem,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { MonthPicker } from './ui/month-picker' 

type Props = {
  filters: FilterType
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>
  refetch?: () => void
  isFetching?: boolean
  onReset?: () => void
}

const TableFilter: React.FC<Props> = ({
  filters,
  setFilters,
  refetch = () => {},
  isFetching = false,
  onReset = () => {},
}) => {

  const currentType = filters.type as Mode

  const currentDate =
    filters.type === 'date' ? (filters as any).date as Date | undefined : undefined

  const currentMonth =
    filters.type === 'month' &&
    typeof (filters as any).year === 'number' &&
    typeof (filters as any).month === 'number'
      ? `${(filters as any).year}-${String((filters as any).month).padStart(2, '0')}`
      : undefined

  const handleType = (type: Mode) => {
    if (type === 'all') return setFilters({ type: 'all' })
    if (type === 'date') return setFilters({ type: 'date', date: undefined as any })
    if (type === 'month') return setFilters({ type: 'month', year: undefined as any, month: undefined as any } as any)
  }

  const handleDate = (d?: Date) => {
    if (!d) return setFilters({ type: 'all' })
    setFilters({ type: 'date', date: d })
  }

  const handleMonth = (val?: string) => {
    if (!val) return setFilters({ type: 'all' })
    const [y, m] = val.split('-')
    setFilters({ type: 'month', year: Number(y), month: Number(m) })
  }

  const resetFilters = () => {
    setFilters({ type: 'all' })
    onReset()
  }

  const apply = () => refetch?.()

  return (
    <div className="flex items-start justify-between">
      <div>
        <Label>Filter</Label>

        <div className="flex items-center gap-3 mt-2">
          {/* TYPE SELECTOR */}
          <Select value={currentType} onValueChange={(v) => handleType(v as Mode)}>
            <SelectTrigger className="w-36">
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

          {/* DATE PICKER */}
          {currentType === 'date' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="min-w-[180px]">
                  {currentDate ? format(currentDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={(d) => handleDate(d as Date)}
                />
              </PopoverContent>
            </Popover>
          )}

          {/* MONTH PICKER */}
          {currentType === 'month' && (
            <MonthPicker
              value={currentMonth}
              onChange={handleMonth}
              className="min-w-[200px]"
            />
          )}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={resetFilters}>
          Reset
        </Button>

        <Button onClick={apply} disabled={isFetching}>
          {isFetching ? 'Refreshing…' : 'Apply'}
        </Button>
      </div>
    </div>
  )
}

export default TableFilter
