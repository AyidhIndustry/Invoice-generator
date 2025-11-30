import { createDeliveryNote } from '@/features/delivery-notes/create-delivery-note'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export function useCreateDeliveryNote() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createDeliveryNote,
    onMutate: () => {
      toast.dismiss()
      toast.info('Creating delivery note...')
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Delivery note created.')
      qc.invalidateQueries({ queryKey: ['delivery-notes'] })
    },
    onError: (err: any) => {
      toast.dismiss()
      toast.error(err?.message ?? 'Something went wrong.')
    },
  })
}
