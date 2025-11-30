// hooks/useGetPurchases.ts
import { useQuery } from '@tanstack/react-query'

import { getAllDeliveryNotes } from '@/features/delivery-notes/get-delivery-notes'
import { DeliveryNote } from '@/schemas/delivery-note.schema'
import { PurchasesFilter } from '@/features/purchases/get-purchases'

export function useGetDeliveryNotes(filter: PurchasesFilter = { type: 'all' }) {
  const key = ['delivery-notes', filter]

  return useQuery<DeliveryNote[], Error>({
    queryKey: key,
    queryFn: () => getAllDeliveryNotes(filter),
    keepPreviousData: true,
    staleTime: 1000 * 30,
  } as any)
}
