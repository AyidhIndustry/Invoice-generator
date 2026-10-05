import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { deleteMaintenanceReport } from '@/features/maintenance-report/delete-maintenance-report'

export function useDeleteMaintenanceReport() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deleteMaintenanceReport,
    onMutate: () => {
      toast.dismiss()
      toast.info('Deleting maintenance report...')
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Deleted Maintenance Report.')
      qc.invalidateQueries({ queryKey: ['maintenance-reports'] })
    },
    onError: (err) => {
      toast.dismiss()
      toast.error(err.message || 'Delete failed')
    },
  })
}
