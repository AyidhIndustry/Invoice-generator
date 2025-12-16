'use client'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { useStats } from '@/context/stat.context'

export function QuarterSelector() {
  const { quarter, setQuarter } = useStats()

  return (
    <div className="flex items-center justify-start gap-3">
      <span className="text-sm text-center font-medium">Select Quarter</span>
      <Select
        value={String(quarter)}
        onValueChange={(value) => setQuarter(Number(value) as 1 | 2 | 3 | 4)}
      >
        <SelectTrigger id="quarter" className="w-[180px]">
          <SelectValue placeholder="Select quarter" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="1">Q1 (Jan–Mar)</SelectItem>
          <SelectItem value="2">Q2 (Apr–Jun)</SelectItem>
          <SelectItem value="3">Q3 (Jul–Sep)</SelectItem>
          <SelectItem value="4">Q4 (Oct–Dec)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
