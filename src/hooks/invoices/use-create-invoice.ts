import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { createInvoice } from '@/features/invoices/create-invoice'
import { notifyCustomerAccount } from '@/hooks/accounts/notify-customer-account'

export function useCreateInvoice() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createInvoice,
    onMutate: () => {
      toast.dismiss()
      toast.info('Creating invoice...')
    },
    onSuccess: ({ customerAccount }) => {
      toast.dismiss()
      toast.success('Invoice created.')
      qc.invalidateQueries({ queryKey: ['invoices'] })
      notifyCustomerAccount(qc, customerAccount)
    },
    onError: (err) => {
      toast.dismiss()
      toast.error(err.message || 'Something went wrong.')
    },
  })
}
