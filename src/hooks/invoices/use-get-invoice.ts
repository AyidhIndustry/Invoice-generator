// hooks/useGetPurchases.ts
import { useQuery } from '@tanstack/react-query'
import { getAllInvoices, InvoiceFilter } from '@/features/invoices/get-invoice'
import { Invoice } from '@/schemas/invoice.schema'

export function useGetInvoices(filter: InvoiceFilter = { type: 'all' }) {
  const key = ['invoices', filter]

  return useQuery<Invoice[], Error>({
    queryKey: key,
    queryFn: () => getAllInvoices(filter),
    keepPreviousData: true,
    staleTime: 1000 * 30,
  } as any)
}
