// hooks/useGetMaintenanceReports.ts
import { useQuery } from '@tanstack/react-query'
import { Invoice } from '@/schemas/invoice.schema'
import {
  getAllMaintenanceReports,
  MaintenanceReportFilter,
} from '@/features/maintenance-report/get-maintenance-report'
import { MaintenanceReport } from '@/schemas/maintenance-report.schema'

export function useGetMaintenanceReports(
  filter: MaintenanceReportFilter = { type: 'all' },
) {
  const key = ['maintenance-reports', filter]

  return useQuery<MaintenanceReport[], Error>({
    queryKey: key,
    queryFn: () => getAllMaintenanceReports(filter),
    keepPreviousData: true,
    staleTime: 1000 * 30,
  } as any)
}
