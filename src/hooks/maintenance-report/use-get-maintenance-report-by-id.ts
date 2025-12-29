// hooks/useMaintenanceReport.ts
import { useQuery } from '@tanstack/react-query'
import { getMaintenanceReportById } from '@/features/maintenance-report/get-maintenance-report-by-id'

export function useGetMaintenanceReportById(id: string) {
  return useQuery({
    queryKey: ['maintenance-report', id],
    queryFn: () => getMaintenanceReportById(id),
    enabled: Boolean(id),
  })
}
