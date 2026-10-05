import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { createInvoice } from '@/features/invoices/create-invoice'

export function useCreateInvoice() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createInvoice,
    onMutate: () => {
      toast.dismiss()
      toast.info('Creating invoice...')
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Invoice created.')
      qc.invalidateQueries({ queryKey: ['invoices'] })
    },
    onError: (err) => {
      toast.dismiss()
      toast.error(err.message || 'Something went wrong.')
    },
  })
}
