// hooks/usePurchase.ts
import { useQuery } from '@tanstack/react-query'
import { getInvoiceById } from '@/features/invoices/get-invoice-by-id'

export function useGetInvoiceById(id: string) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => getInvoiceById(id),
    enabled: Boolean(id),
  })
}
