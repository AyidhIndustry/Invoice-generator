import { updateInvoice } from '@/features/invoices/update-invoice'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export function useUpdateInvoice() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: updateInvoice,
    onMutate: () => {
      toast.dismiss()
      toast.info('Updating invoice...')
    },
    onSuccess: ({ id }) => {
      toast.dismiss()
      toast.success('Invoice updated.')
      qc.invalidateQueries({ queryKey: ['invoices'] })
      qc.invalidateQueries({ queryKey: ['invoice', id] })
    },
    onError: (err) => {
      toast.dismiss()
      toast.error(err.message || 'Something went wrong.')
    },
  })
}
