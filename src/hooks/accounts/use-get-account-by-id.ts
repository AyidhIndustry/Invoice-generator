import { useQuery } from '@tanstack/react-query'
import { getAccountById } from '@/features/accounts/get-account-by-id'

export function useGetAccountById(id: string) {
  return useQuery({
    queryKey: ['account', id],
    queryFn: () => getAccountById(id),
    enabled: Boolean(id),
  })
}
