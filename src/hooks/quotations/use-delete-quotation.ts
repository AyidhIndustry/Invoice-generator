import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { deleteQuotation } from '@/features/quotations/delete-quotation'

export function useDeleteQuotation() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deleteQuotation,
    onMutate: () => {
      toast.dismiss()
      toast.info('Deleting quotation...')
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Deleted Quotation.')
      qc.invalidateQueries({ queryKey: ['quotations'] })
    },
    onError: (err) => {
      toast.dismiss()
      toast.error(err.message || 'Delete failed')
    },
  })
}
