import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllQuotations } from '@/features/quotations/get-quotation'
import { FilterType } from '@/schemas/filter.type'

export function useGetQuotations(filter: FilterType = { type: 'all' }) {
  return useQuery({
    queryKey: ['quotations', filter],
    queryFn: () => getAllQuotations(filter),
    // Keep showing the current rows while a new filter loads.
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  })
}
