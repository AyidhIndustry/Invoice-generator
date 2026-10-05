import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { deleteDeliveryNote } from '@/features/delivery-notes/delete-delivery-note'

export function useDeleteDeliveryNote() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deleteDeliveryNote,
    onMutate: () => {
      toast.dismiss()
      toast.info('Deleting delivery note...')
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Deleted delivery note.')
      qc.invalidateQueries({ queryKey: ['delivery-notes'] })
    },
    onError: (err) => {
      toast.dismiss()
      toast.error(err.message || 'Delete failed')
    },
  })
}
