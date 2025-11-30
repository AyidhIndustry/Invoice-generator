// hooks/useGetPurchases.ts
import { useQuery } from '@tanstack/react-query'
import { DeliveryNote } from '@/schemas/delivery-note.schema'
import { getAllQuotations, QuotationsFilter } from '@/features/quotations/get-quotation'

export function useGetQuotations(filter: QuotationsFilter = { type: 'all' }) {
  const key = ['quotations', filter]

  return useQuery<DeliveryNote[], Error>({
    queryKey: key,
    queryFn: () => getAllQuotations(filter),
    keepPreviousData: true,
    staleTime: 1000 * 30,
  } as any)
}
