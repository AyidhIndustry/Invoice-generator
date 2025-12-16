'use client'

import React, { createContext, useContext, useMemo, useState } from 'react'
import { useGetStats } from '@/hooks/use-get-stats'
import { getCurrentQuarter } from '@/lib/get-current-quarter'

/* ================= TYPES ================= */

export type Quarter = 1 | 2 | 3 | 4

type StatsData = {
  invoiceCount: number
  purchaseCount: number
  quotationCount: number
  totalTaxReceived: number
  totalTaxPaid: number
  netTax: number
}

type StatsContextValue = {
  data: StatsData
  isPending: boolean
  isError: boolean
  error?: unknown
  year: number
  quarter: Quarter
  setYear: (year: number) => void
  setQuarter: (quarter: Quarter) => void
  refetch: () => void
}

/* ================= DEFAULT ================= */

const defaultValue: StatsContextValue = {
  data: {
    invoiceCount: 0,
    purchaseCount: 0,
    quotationCount: 0,
    totalTaxReceived: 0,
    totalTaxPaid: 0,
    netTax: 0,
  },
  isPending: false,
  isError: false,
  error: undefined,
  year: new Date().getFullYear(),
  quarter: getCurrentQuarter(),
  setYear: () => {},
  setQuarter: () => {},
  refetch: () => {},
}

const StatsContext = createContext<StatsContextValue>(defaultValue)


export const StatsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [year, setYear] = useState(new Date().getFullYear())
  const [quarter, setQuarter] = useState<Quarter>(getCurrentQuarter())

  // 🔹 stats refetch automatically when year/quarter changes
  const query = useGetStats({ year, quarter })

  const isPending = Boolean(query.isLoading || query.isFetching)
  const isError = Boolean(query.isError)

  const data = useMemo<StatsData>(() => {
    const d = query.data ?? ({} as StatsData)
    return {
      invoiceCount: d.invoiceCount ?? 0,
      purchaseCount: d.purchaseCount ?? 0,
      quotationCount: d.quotationCount ?? 0,
      totalTaxReceived: d.totalTaxReceived ?? 0,
      totalTaxPaid: d.totalTaxPaid ?? 0,
      netTax: d.netTax ?? 0,
    }
  }, [query.data])

  const value = useMemo(
    () => ({
      data,
      isPending,
      isError,
      error: query.error,
      year,
      quarter,
      setYear,
      setQuarter,
      refetch: query.refetch,
    }),
    [data, isPending, isError, year, quarter, query],
  )

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
}

/* ================= HOOK ================= */

export const useStats = () => useContext(StatsContext)
