// hooks/usePurchase.ts
import { useQuery } from '@tanstack/react-query'
import { getQuotationById } from '@/features/quotations/get-quotation-by-id'

export function useGetQuotationById(id: string) {
  return useQuery({
    queryKey: ['quotation', id],
    queryFn: () => getQuotationById(id),
    enabled: Boolean(id),
  })
}
