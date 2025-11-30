// hooks/useDeletePurchase.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { deleteDeliveryNote } from '@/features/delivery-notes/delete-delivery-note'
import { deletePurchase } from '@/features/purchases/delete-purchase'

export function useDeletePurchase() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deletePurchase(id),
    onMutate: () => {
      toast.dismiss()
      toast.info('Deleting purchase...')
    },
    onSuccess: (_data) => {
      toast.dismiss()
      toast.success('Deleted purchase.')
      qc.invalidateQueries({ queryKey: ['purchases'] })
    },
    onError: (err: any) => {
      toast.dismiss()
      toast.error(err?.message ?? 'Delete failed')
    },
  })
}
