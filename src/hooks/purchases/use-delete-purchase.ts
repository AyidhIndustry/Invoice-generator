import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { deletePurchase } from '@/features/purchases/delete-purchase'

export function useDeletePurchase() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deletePurchase,
    onMutate: () => {
      toast.dismiss()
      toast.info('Deleting purchase...')
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Deleted purchase.')
      qc.invalidateQueries({ queryKey: ['purchases'] })
    },
    onError: (err) => {
      toast.dismiss()
      toast.error(err.message || 'Delete failed')
    },
  })
}
