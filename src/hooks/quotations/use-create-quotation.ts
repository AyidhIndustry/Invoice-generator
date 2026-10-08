import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { createQuotation } from '@/features/quotations/create-quotation'
import { notifyCustomerAccount } from '@/hooks/accounts/notify-customer-account'

export function useCreateQuotation() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createQuotation,
    onMutate: () => {
      toast.dismiss()
      toast.info('Creating quotation...')
    },
    onSuccess: ({ customerAccount }) => {
      toast.dismiss()
      toast.success('Quotation created.')
      qc.invalidateQueries({ queryKey: ['quotations'] })
      notifyCustomerAccount(qc, customerAccount)
    },
    onError: (err) => {
      toast.dismiss()
      toast.error(err.message || 'Something went wrong.')
    },
  })
}
