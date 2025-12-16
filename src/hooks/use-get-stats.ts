import { useQuery } from '@tanstack/react-query'
import { getStats } from '@/features/stats/get-stats'
import { Quarter } from '@/context/stat.context'

type Params = {
  year: number
  quarter: Quarter
}

export function useGetStats({ year, quarter }: Params) {
  return useQuery({
    queryKey: ['stats', year, quarter],
    queryFn: () => getStats(year, quarter),
    staleTime: 1000 * 60 * 10, // 10 minutes
    placeholderData: (previousData) => previousData,   // smooth quarter switching
  })
}
