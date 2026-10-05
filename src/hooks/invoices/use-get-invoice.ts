import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllInvoices } from '@/features/invoices/get-invoice'
import { FilterType } from '@/schemas/filter.type'

export function useGetInvoices(filter: FilterType = { type: 'all' }) {
  return useQuery({
    queryKey: ['invoices', filter],
    queryFn: () => getAllInvoices(filter),
    // Keep showing the current rows while a new filter loads.
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  })
}
