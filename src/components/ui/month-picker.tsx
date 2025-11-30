'use client'

import React, { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

type Props = {
  value?: string // YYYY-MM
  onChange?: (v?: string) => void
  placeholder?: string
  className?: string
}

export function MonthPicker({ value, onChange, placeholder = 'Select month', className }: Props) {
  // parse initial
  const initialDate = useMemo(() => (value ? new Date(`${value}-01`) : new Date()), [value])
  const [year, setYear] = useState<number>(initialDate.getFullYear())

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn('w-[200px] justify-start', className)}>
          {value ? `${MONTHS[Number(value.slice(5, 7)) - 1].slice(0, 3)} ${value.slice(0, 4)}` : placeholder}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-3">
        <div className="flex items-center justify-between mb-3">
          <Button variant="ghost" size="sm" onClick={() => setYear(y => y - 1)}><ChevronLeft /></Button>
          <div className="text-sm font-medium">{year}</div>
          <Button variant="ghost" size="sm" onClick={() => setYear(y => y + 1)}><ChevronRight /></Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {MONTHS.map((m, i) => {
            const monthVal = `${year}-${String(i + 1).padStart(2, '0')}`
            const isActive = value === monthVal
            return (
              <Button
                key={m}
                variant={isActive ? 'default' : 'ghost'}
                className={cn('text-sm', isActive && 'ring-2')}
                onClick={() => onChange?.(monthVal)}
              >
                {m.slice(0, 3)}
              </Button>
            )
          })}
        </div>

        <div className="flex justify-end mt-3 gap-2">
          <Button variant="outline" size="sm" onClick={() => onChange?.(undefined)}>Clear</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
