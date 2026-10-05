import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllPurchases } from '@/features/purchases/get-purchases'
import { FilterType } from '@/schemas/filter.type'

export function useGetPurchases(filter: FilterType = { type: 'all' }) {
  return useQuery({
    queryKey: ['purchases', filter],
    queryFn: () => getAllPurchases(filter),
    // Keep showing the current rows while a new filter loads.
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  })
}
