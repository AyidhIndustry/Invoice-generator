'use client'

import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useGetAccounts } from '@/hooks/accounts/use-get-accounts'
import { cn } from '@/lib/utils'
import { Account } from '@/schemas/account.schema'
import { Customer } from '@/schemas/customer.schema'

/** Customer details of a saved account, with missing fields left empty. */
export function accountToCustomer(account: Account) {
  return {
    name: account.name ?? '',
    email: account.email ?? '',
    address: account.address ?? '',
    phoneNumber: account.phoneNumber ?? '',
    VATNumber: account.VATNumber ?? '',
  } satisfies Customer
}

interface AccountNameComboboxProps {
  value: string
  /** Called as the name is typed; a name not in Accounts is still allowed. */
  onChange: (value: string) => void
  /** Called when a saved company is picked, to fill in its other details. */
  onSelect: (account: Account) => void
  placeholder?: string
  className?: string
}

/**
 * Company name input that suggests saved accounts as you type.
 * Picking one fills the customer details; typing a new name works as before.
 */
export function AccountNameCombobox({
  value,
  onChange,
  onSelect,
  placeholder = 'Search company',
  className,
}: AccountNameComboboxProps) {
  const { data: accounts = [], isPending } = useGetAccounts()
  const [open, setOpen] = useState(false)
  // Show every company on focus; filter only once the user starts typing.
  const [isTyping, setIsTyping] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)

  const matches = useMemo(() => {
    const term = isTyping ? value.trim().toLowerCase() : ''
    if (!term) return accounts
    return accounts.filter((account) =>
      account.name.toLowerCase().includes(term),
    )
  }, [accounts, value, isTyping])

  const close = () => {
    setOpen(false)
    setHighlighted(-1)
  }

  const pick = (account: Account) => {
    onSelect(account)
    close()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setHighlighted((i) => Math.min(i + 1, matches.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && open && matches[highlighted]) {
      // Pick the highlighted company instead of submitting the form.
      e.preventDefault()
      pick(matches[highlighted])
    } else if (e.key === 'Escape') {
      close()
    }
  }

  return (
    <div className={cn('relative', className)}>
      <Input
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        className="pr-8"
        onFocus={() => {
          setIsTyping(false)
          setOpen(true)
        }}
        onBlur={close}
        onChange={(e) => {
          onChange(e.target.value)
          setIsTyping(true)
          setOpen(true)
          setHighlighted(-1)
        }}
        onKeyDown={handleKeyDown}
      />
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />

      {open && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-sm text-popover-foreground shadow-md"
        >
          {isPending && (
            <li className="px-2 py-1.5 text-muted-foreground">
              Loading companies...
            </li>
          )}
          {!isPending && matches.length === 0 && (
            <li className="px-2 py-1.5 text-muted-foreground">
              No saved company found. The typed name will be used.
            </li>
          )}
          {matches.map((account, index) => (
            <li
              key={account.id}
              role="option"
              aria-selected={index === highlighted}
              className={cn(
                'cursor-pointer rounded-sm px-2 py-1.5',
                index === highlighted && 'bg-accent text-accent-foreground',
              )}
              // mousedown fires before the input's blur closes the list.
              onMouseDown={(e) => {
                e.preventDefault()
                pick(account)
              }}
              onMouseEnter={() => setHighlighted(index)}
            >
              <div className="font-medium">{account.name}</div>
              {account.VATNumber && (
                <div className="text-xs text-muted-foreground">
                  VAT {account.VATNumber}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
