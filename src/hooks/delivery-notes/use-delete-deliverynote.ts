// hooks/useDeletePurchase.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { deleteDeliveryNote } from '@/features/delivery-notes/delete-delivery-note'

export function useDeleteDeliveryNote() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteDeliveryNote(id),
    onMutate: () => {
      toast.dismiss()
      toast.info('Deleting delivery note...')
    },
    onSuccess: (_data) => {
      toast.dismiss()
      toast.success('Deleted delivery note.')
      qc.invalidateQueries({ queryKey: ['delivery-notes'] })
    },
    onError: (err: any) => {
      toast.dismiss()
      toast.error(err?.message ?? 'Delete failed')
    },
  })
}
