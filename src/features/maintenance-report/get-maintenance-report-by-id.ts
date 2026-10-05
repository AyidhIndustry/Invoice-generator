import { getDocumentById } from '@/lib/firestore'
import { MaintenanceReport } from '@/schemas/maintenance-report.schema'

export function getMaintenanceReportById(id: string) {
  return getDocumentById<MaintenanceReport>(
    'maintenance-reports',
    id,
    'Maintenance report not found',
  )
}
