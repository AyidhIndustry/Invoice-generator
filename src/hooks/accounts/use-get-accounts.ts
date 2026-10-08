import { useQuery } from '@tanstack/react-query'
import {
  getAccountsPage,
  getAllAccounts,
} from '@/features/accounts/get-accounts'
import { usePaginatedDocuments } from '@/hooks/use-paginated-documents'

export function useGetAccounts({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: getAllAccounts,
    staleTime: 1000 * 30,
    enabled,
  })
}

export function usePaginatedAccounts() {
  return usePaginatedDocuments(['accounts', 'paginated'], getAccountsPage)
}
