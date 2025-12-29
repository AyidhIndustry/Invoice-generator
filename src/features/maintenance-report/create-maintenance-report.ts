import { db } from '@/lib/firebase-client'
import { CreateMaintenanceReportDTO } from '@/schemas/maintenance-report.schema'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

function generateMaintenanceId() {
  // generates exactly 8 digits (10000000–99999999)
  const num = Math.floor(10000000 + Math.random() * 90000000)
  return `MR-${num}`
}

export async function createMaintenanceReport(payload: any) {
  try {
    // Validate again using Zod schema
    const result = CreateMaintenanceReportDTO.safeParse(payload)

    if (!result.success) {
      const msg = result.error.issues
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ')
      throw new Error(msg)
    }

    const data = result.data

    // Generate random ID
    const id = generateMaintenanceId()

    // Create doc with custom ID
    await setDoc(doc(db, 'maintenance-reports', id), {
      ...data,
      id,
      createdAt: serverTimestamp(),
    })

    return { id }
  } catch (err: any) {
    throw new Error(err.message ?? 'Failed to create report.')
  }
}
