import { updateInvoice } from '@/features/invoices/update-invoice'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { notifyCustomerAccount } from '@/hooks/accounts/notify-customer-account'

export function useUpdateInvoice() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: updateInvoice,
    onMutate: () => {
      toast.dismiss()
      toast.info('Updating invoice...')
    },
    onSuccess: ({ id, customerAccount }) => {
      toast.dismiss()
      toast.success('Invoice updated.')
      qc.invalidateQueries({ queryKey: ['invoices'] })
      qc.invalidateQueries({ queryKey: ['invoice', id] })
      notifyCustomerAccount(qc, customerAccount)
    },
    onError: (err) => {
      toast.dismiss()
      toast.error(err.message || 'Something went wrong.')
    },
  })
}
