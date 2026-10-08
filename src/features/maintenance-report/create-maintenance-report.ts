import { addCustomerAccountIfNew } from '@/features/accounts/add-customer-account'
import { createWithSequentialId, parseOrThrow } from '@/lib/firestore'
import { CreateMaintenanceReportDTO } from '@/schemas/maintenance-report.schema'

export async function createMaintenanceReport(payload: unknown) {
  const data = parseOrThrow(CreateMaintenanceReportDTO, payload)

  const { id } = await createWithSequentialId(
    'maintenance-reports',
    { name: 'maintenanceReport', prefix: 'MR', allowInitialize: true },
    data,
  )

  const customerAccount = await addCustomerAccountIfNew(data.customer)
  return { id, customerAccount }
}
