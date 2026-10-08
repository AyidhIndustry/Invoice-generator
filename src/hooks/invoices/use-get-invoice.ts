import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  getAllInvoices,
  getInvoicesPage,
} from '@/features/invoices/get-invoice'
import { usePaginatedDocuments } from '@/hooks/use-paginated-documents'
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

export function usePaginatedInvoices(filter: FilterType) {
  return usePaginatedDocuments(['invoices', 'paginated', filter], (cursor) =>
    getInvoicesPage(filter, cursor),
  )
}
