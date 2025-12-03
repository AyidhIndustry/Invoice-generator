'use client'

import React, { createContext, useContext, useMemo } from 'react'
import { useGetStats } from '@/hooks/use-get-stats'

type StatsData = {
  invoiceCount: number
  quotationCount: number
  purchaseCount: number
  totalTaxPaid: number
}

type StatsContextValue = {
  data: StatsData
  isPending: boolean
  isError: boolean
  error?: unknown
  refetch: () => void
}

const defaultValue: StatsContextValue = {
  data: {
    invoiceCount: 0,
    quotationCount: 0,
    purchaseCount: 0,
    totalTaxPaid: 0,
  },
  isPending: false,
  isError: false,
  error: undefined,
  refetch: () => {},
}

const StatsContext = createContext<StatsContextValue>(defaultValue)

export const StatsProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  // keep all fetching + memory logic here
  const query = useGetStats()

  const isPending = Boolean(query.isLoading || query.isFetching)
  const isError = Boolean(query.isError)

  const data = useMemo(() => {
    const d =
      (query.data as {
        invoiceCount?: number
        quotationCount?: number
        purchaseCount?: number
        totalTaxPaid?: number
      }) ?? {}
    return {
      invoiceCount: d.invoiceCount ?? 0,
      quotationCount: d.quotationCount ?? 0,
      purchaseCount: d.purchaseCount ?? 0,
      totalTaxPaid: d.totalTaxPaid ?? 0,
    }
  }, [query.data])

  const value = useMemo(
    () => ({
      data,
      isPending,
      isError,
      error: query.error,
      refetch: () => query.refetch(),
    }),
    [data, isPending, isError, query],
  )

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
}

export const useStats = () => useContext(StatsContext)
