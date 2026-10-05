import { deleteDocumentById } from '@/lib/firestore'

export function deleteMaintenanceReport(id: string) {
  return deleteDocumentById('maintenance-reports', id)
}
