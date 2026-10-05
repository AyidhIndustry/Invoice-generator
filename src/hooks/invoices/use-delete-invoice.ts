import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { deleteInvoice } from '@/features/invoices/delete-invoice'

export function useDeleteInvoice() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deleteInvoice,
    onMutate: () => {
      toast.dismiss()
      toast.info('Deleting invoice...')
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Deleted Invoice.')
      qc.invalidateQueries({ queryKey: ['invoices'] })
    },
    onError: (err) => {
      toast.dismiss()
      toast.error(err.message || 'Delete failed')
    },
  })
}
