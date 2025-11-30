import { createPurchase } from '@/features/purchases/create-purchase'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export function useCreatePurchase() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createPurchase,
    onMutate: () => {
      toast.dismiss()
      toast.info('Creating purchase...')
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Purchase created.')
      qc.invalidateQueries({ queryKey: ['purchases'] })
    },
    onError: (err: any) => {
      toast.dismiss()
      toast.error(err?.message ?? 'Something went wrong.')
    },
  })
}
