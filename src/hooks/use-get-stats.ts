import { getStats } from "@/features/stats/get-stats";
import { useQuery } from "@tanstack/react-query";

export function useGetStats() {
  return useQuery({
    queryKey: ['stats-current-quarter'],
    queryFn: () => getStats(),
    staleTime: 1000 * 60 * 10,
  });
}