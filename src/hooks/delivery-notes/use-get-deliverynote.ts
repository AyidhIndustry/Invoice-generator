import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllDeliveryNotes } from '@/features/delivery-notes/get-delivery-notes'
import { FilterType } from '@/schemas/filter.type'

export function useGetDeliveryNotes(filter: FilterType = { type: 'all' }) {
  return useQuery({
    queryKey: ['delivery-notes', filter],
    queryFn: () => getAllDeliveryNotes(filter),
    // Keep showing the current rows while a new filter loads.
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  })
}
