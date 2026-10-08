import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { createDeliveryNote } from '@/features/delivery-notes/create-delivery-note'
import { notifyCustomerAccount } from '@/hooks/accounts/notify-customer-account'

export function useCreateDeliveryNote() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createDeliveryNote,
    onMutate: () => {
      toast.dismiss()
      toast.info('Creating delivery note...')
    },
    onSuccess: ({ customerAccount }) => {
      toast.dismiss()
      toast.success('Delivery note created.')
      qc.invalidateQueries({ queryKey: ['delivery-notes'] })
      notifyCustomerAccount(qc, customerAccount)
    },
    onError: (err) => {
      toast.dismiss()
      toast.error(err.message || 'Something went wrong.')
    },
  })
}
