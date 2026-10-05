import { createWithSequentialId, parseOrThrow } from '@/lib/firestore'
import { CreateMaintenanceReportDTO } from '@/schemas/maintenance-report.schema'

export async function createMaintenanceReport(payload: unknown) {
  const data = parseOrThrow(CreateMaintenanceReportDTO, payload)

  return createWithSequentialId(
    'maintenance-reports',
    { name: 'maintenanceReport', prefix: 'MR', allowInitialize: true },
    data,
  )
}
