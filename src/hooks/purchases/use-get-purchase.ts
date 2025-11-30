// hooks/useGetPurchases.ts
import { useQuery } from '@tanstack/react-query'
import { getAllPurchases, PurchasesFilter } from '@/features/purchases/get-purchases'
import { Purchase } from '@/schemas/purchase.schema'

export function useGetPurchases(filter: PurchasesFilter = { type: 'all' }) {
  const key = ['purchases', filter]

  return useQuery<Purchase[], Error>({
    queryKey: key,
    queryFn: () => getAllPurchases(filter),
    keepPreviousData: true,
    staleTime: 1000 * 30,
  } as any)
}
