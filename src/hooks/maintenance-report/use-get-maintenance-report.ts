import { getMaintenanceReportsPage } from '@/features/maintenance-report/get-maintenance-report'
import { usePaginatedDocuments } from '@/hooks/use-paginated-documents'
import { FilterType } from '@/schemas/filter.type'

export function usePaginatedMaintenanceReports(filter: FilterType) {
  return usePaginatedDocuments(['maintenance-reports', 'paginated', filter], (cursor) =>
    getMaintenanceReportsPage(filter, cursor),
  )
}
