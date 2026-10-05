import { getFilteredDocuments } from '@/lib/firestore'
import { FilterType } from '@/schemas/filter.type'
import { MaintenanceReport } from '@/schemas/maintenance-report.schema'

export function getAllMaintenanceReports(filter?: FilterType) {
  return getFilteredDocuments<MaintenanceReport>('maintenance-reports', filter)
}
