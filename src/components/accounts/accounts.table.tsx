'use client'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Account } from '@/schemas/account.schema'
import { SkeletonTable } from '../ui/skeleton-table'
import { useDeleteAccount } from '@/hooks/accounts/use-delete-account'
import DeleteItemDialog from '../dialogs/delete-item.dialog'
import { EditAccountButton } from './edit-account-button'

export default function AccountsTable({
  accounts,
  isPending,
  isError,
}: {
  accounts?: Account[]
  isPending: boolean
  isError: boolean
}) {
  const router = useRouter()
  const {
    mutate: deleteAccount,
    isPending: isAccountDeletePending,
    isError: isAccountDeleteError,
  } = useDeleteAccount()
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/70">
            <TableHead>Name</TableHead>
            <TableHead>VAT Number</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <SkeletonTable />}
          {isError && !isPending && (
            <TableRow>
              <TableCell colSpan={4} className="py-6 text-center text-red-600">
                Failed to load Accounts.
              </TableCell>
            </TableRow>
          )}
          {accounts && !isPending && !isError && accounts.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-6 text-center text-muted-foreground"
              >
                No Accounts found.
              </TableCell>
            </TableRow>
          )}
          {accounts &&
            !isPending &&
            !isError &&
            accounts.map((account) => (
              <TableRow
                key={account.id}
                className="cursor-pointer"
                onClick={() =>
                  router.push(`/accounts/${encodeURIComponent(account.id ?? '')}`)
                }
              >
                <TableCell className="font-medium">{account.name}</TableCell>
                <TableCell>{account.VATNumber || '—'}</TableCell>
                <TableCell>
                  {account.phoneNumber || account.email ? (
                    <>
                      {account.phoneNumber}
                      {account.phoneNumber && account.email && <br />}
                      {account.email}
                    </>
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {/* Keep button and dialog clicks from opening the account. */}
                  <div
                    className="flex justify-end items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <EditAccountButton accountId={account.id} />

                    <DeleteItemDialog
                      name="Account"
                      id={account.id as string}
                      onDelete={deleteAccount}
                      isPending={isAccountDeletePending}
                      isError={isAccountDeleteError}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
