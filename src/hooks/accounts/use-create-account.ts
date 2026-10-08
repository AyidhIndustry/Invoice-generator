import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { createAccount } from '@/features/accounts/create-account'

export function useCreateAccount() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createAccount,
    onMutate: () => {
      toast.dismiss()
      toast.info('Creating account...')
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Account created.')
      qc.invalidateQueries({ queryKey: ['accounts'] })
    },
    onError: (err) => {
      toast.dismiss()
      toast.error(err.message || 'Something went wrong.')
    },
  })
}
