import { createQuotation } from '@/features/quotations/create-quotation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export function useCreateQuotation() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createQuotation,
    onMutate: () => {
      toast.dismiss()
      toast.info('Creating quotation...')
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Quotation created.')
      qc.invalidateQueries({ queryKey: ['quotations'] })
    },
    onError: (err: any) => {
      toast.dismiss()
      toast.error(err?.message ?? 'Something went wrong.')
    },
  })
}
