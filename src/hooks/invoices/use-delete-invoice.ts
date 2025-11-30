// hooks/useDeletePurchase.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { deleteDeliveryNote } from '@/features/delivery-notes/delete-delivery-note'
import { deleteQuotation } from '@/features/quotations/delete-quotation'
import { deleteInvoice } from '@/features/invoices/delete-invoice'

export function useDeleteInvoice() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteInvoice(id),
    onMutate: () => {
      toast.dismiss()
      toast.info('Deleting invoice...')
    },
    onSuccess: (_data) => {
      toast.dismiss()
      toast.success('Deleted Invoice.')
      qc.invalidateQueries({ queryKey: ['invoices'] })
    },
    onError: (err: any) => {
      toast.dismiss()
      toast.error(err?.message ?? 'Delete failed')
    },
  })
}
