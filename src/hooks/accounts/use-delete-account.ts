import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { deleteAccount } from '@/features/accounts/delete-account'

export function useDeleteAccount() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deleteAccount,
    onMutate: () => {
      toast.dismiss()
      toast.info('Deleting account...')
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Deleted account.')
      qc.invalidateQueries({ queryKey: ['accounts'] })
    },
    onError: (err) => {
      toast.dismiss()
      toast.error(err.message || 'Delete failed')
    },
  })
}
