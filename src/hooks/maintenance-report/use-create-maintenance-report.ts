import { createMaintenanceReport } from '@/features/maintenance-report/create-maintenance-report'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export function useCreateMaintenanceReport() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createMaintenanceReport,
    onMutate: () => {
      toast.dismiss()
      toast.info('Creating maintenance report...')
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Maintenance report created.')
      qc.invalidateQueries({ queryKey: ['maintenance-reports'] })
    },
    onError: (err: any) => {
      toast.dismiss()
      toast.error(err?.message ?? 'Something went wrong.')
    },
  })
}
