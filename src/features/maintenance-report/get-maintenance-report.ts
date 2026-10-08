import { getDocumentsPage, PageCursor } from '@/lib/firestore'
import { FilterType } from '@/schemas/filter.type'
import { MaintenanceReport } from '@/schemas/maintenance-report.schema'

export function getMaintenanceReportsPage(
  filter: FilterType,
  cursor: PageCursor,
) {
  return getDocumentsPage<MaintenanceReport>(
    'maintenance-reports',
    filter,
    cursor,
  )
}
