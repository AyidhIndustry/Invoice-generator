import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAllMaintenanceReports } from '@/features/maintenance-report/get-maintenance-report'
import { FilterType } from '@/schemas/filter.type'

export function useGetMaintenanceReports(filter: FilterType = { type: 'all' }) {
  return useQuery({
    queryKey: ['maintenance-reports', filter],
    queryFn: () => getAllMaintenanceReports(filter),
    // Keep showing the current rows while a new filter loads.
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  })
}
