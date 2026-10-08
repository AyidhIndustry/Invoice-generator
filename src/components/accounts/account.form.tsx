'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import {
  CreateAccountDTO,
  CreateAccountDTOType,
} from '@/schemas/account.schema'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '../ui/textarea'

export const emptyAccount: CreateAccountDTOType = {
  name: '',
  VATNumber: '',
  address: '',
  email: '',
  phoneNumber: '',
  notes: '',
}

interface AccountFormProps {
  initialValues?: CreateAccountDTOType
  submitLabel: string
  submittingLabel: string
  isSubmitting: boolean
  /** Clears the form after a successful submit, for creating several in a row. */
  resetOnSuccess?: boolean
  onSubmit: (values: CreateAccountDTOType) => Promise<unknown>
}

export default function AccountForm({
  initialValues = emptyAccount,
  submitLabel,
  submittingLabel,
  isSubmitting,
  resetOnSuccess = false,
  onSubmit,
}: AccountFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAccountDTOType>({
    resolver: zodResolver(CreateAccountDTO),
    defaultValues: initialValues,
  })

  const submit = async (values: CreateAccountDTOType) => {
    try {
      await onSubmit(values)
      if (resetOnSuccess) reset(emptyAccount)
    } catch {
      // The mutation hook already shows the error toast.
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Company Name*</Label>
            <Input
              {...register('name')}
              placeholder="Enter company name"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>VAT Number</Label>
            <Input
              {...register('VATNumber')}
              placeholder="Enter VAT number"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              type="email"
              {...register('email')}
              placeholder="Enter email"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Phone Number</Label>
            <Input
              {...register('phoneNumber')}
              placeholder="Enter phone number"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <Label>Address</Label>
            <Textarea
              {...register('address')}
              placeholder="Enter address"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <Label>Additional Notes</Label>
            <Textarea
              {...register('notes')}
              placeholder="Enter any additional notes"
              disabled={isSubmitting}
            />
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="mt-6 flex items-center justify-center"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" /> {submittingLabel}
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  )
}
