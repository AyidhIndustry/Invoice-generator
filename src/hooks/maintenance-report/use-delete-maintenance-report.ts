// hooks/useDeletePurchase.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { deleteInvoice } from '@/features/invoices/delete-invoice'
import { deleteMaintenanceReport } from '@/features/maintenance-report/delete-maintenance-report'

export function useDeleteMaintenanceReport() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteMaintenanceReport(id),
    onMutate: () => {
      toast.dismiss()
      toast.info('Deleting maintenance report...')
    },
    onSuccess: (_data) => {
      toast.dismiss()
      toast.success('Deleted Maintenance Report.')
      qc.invalidateQueries({ queryKey: ['maintenance-reports'] })
    },
    onError: (err: any) => {
      toast.dismiss()
      toast.error(err?.message ?? 'Delete failed')
    },
  })
}
