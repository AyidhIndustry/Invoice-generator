// hooks/useDeletePurchase.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { deleteDeliveryNote } from '@/features/delivery-notes/delete-delivery-note'
import { deleteQuotation } from '@/features/quotations/delete-quotation'

export function useDeleteQuotation() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteQuotation(id),
    onMutate: () => {
      toast.dismiss()
      toast.info('Deleting quotation...')
    },
    onSuccess: (_data) => {
      toast.dismiss()
      toast.success('Deleted Quotation.')
      qc.invalidateQueries({ queryKey: ['quotations'] })
    },
    onError: (err: any) => {
      toast.dismiss()
      toast.error(err?.message ?? 'Delete failed')
    },
  })
}
