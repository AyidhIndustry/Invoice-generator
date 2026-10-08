import { updateAccount } from '@/features/accounts/update-account'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export function useUpdateAccount() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: updateAccount,
    onMutate: () => {
      toast.dismiss()
      toast.info('Updating account...')
    },
    onSuccess: ({ id }) => {
      toast.dismiss()
      toast.success('Account updated.')
      qc.invalidateQueries({ queryKey: ['accounts'] })
      qc.invalidateQueries({ queryKey: ['account', id] })
    },
    onError: (err) => {
      toast.dismiss()
      toast.error(err.message || 'Something went wrong.')
    },
  })
}
