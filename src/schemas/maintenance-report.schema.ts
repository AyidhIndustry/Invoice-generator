import z from 'zod'
import { CustomerSchema } from './customer.schema'

export const repairItemSchema = z.object({
  description: z.string(),
})

export const MaintenanceReportSchema = z.object({
  id: z.string(),
  date: z.date(),
  customer: CustomerSchema,
  symptoms: z.string().optional(),
  causeOfIssue: z.string().optional(),
  repair: z
    .array(repairItemSchema)
    .min(1, 'At least one repair item is required'),
  remark: z.string().optional(),
})

export type MaintenanceReport = z.infer<typeof MaintenanceReportSchema>

export const CreateMaintenanceReportDTO = MaintenanceReportSchema.extend({
  id: z.string().optional(),
})
export type CreateMaintenanceReportDTOType = z.infer<
  typeof CreateMaintenanceReportDTO
>

export const UpdateMaintenanceReportDTO = CreateMaintenanceReportDTO.partial()
export type UpdateMaintenanceReportDTOType = z.infer<
  typeof UpdateMaintenanceReportDTO
>
