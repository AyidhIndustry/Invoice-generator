'use client'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertCircle, Trash2, Loader2 } from 'lucide-react'

interface DeleteItemDialogProps {
  name?: string
  onDelete: () => void | Promise<void>
  isPending: boolean
  isError?: boolean | string
}

const DeleteItemDialog: React.FC<DeleteItemDialogProps> = ({
  name,
  onDelete,
  isPending,
  isError,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete {name ? `"${name}"` : 'this item'}?</DialogTitle>
          <DialogDescription>
            This action is permanent. Are you sure you want to delete
            {name ?? 'this item'}?
          </DialogDescription>
        </DialogHeader>

        {isError ? (
          <div className="mt-3 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span>
              {typeof isError === 'string' ? isError : 'Something went wrong.'}
            </span>
          </div>
        ) : null}

        <DialogFooter className="mt-6">
          <Button variant="ghost" disabled={isPending}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isPending}
            className="flex items-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteItemDialog
