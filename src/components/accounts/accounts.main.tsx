'use client'
import ContentLayout from '../layout/content.layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'
import AccountsTable from './accounts.table'
import {
  useGetAccounts,
  usePaginatedAccounts,
} from '@/hooks/accounts/use-get-accounts'
import { useMemo, useState } from 'react'
import { useLazyList } from '@/hooks/use-lazy-list'
import { LoadMore } from '../ui/load-more'

const Accounts = () => {
  const [search, setSearch] = useState('')
  const term = search.trim().toLowerCase()
  const isSearching = term !== ''

  // Browsing loads one page at a time. Firestore cannot match part of a name,
  // so searching loads every account once and filters them here.
  const pages = usePaginatedAccounts()
  const allAccounts = useGetAccounts({ enabled: isSearching })

  const searchResults = useMemo(() => {
    if (!isSearching) return undefined
    return allAccounts.data?.filter((account) =>
      account.name.toLowerCase().includes(term),
    )
  }, [allAccounts.data, isSearching, term])

  const results = useLazyList(searchResults)

  return (
    <ContentLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Accounts</h1>
            <p className="text-muted-foreground">
              Store and manage company details
            </p>
          </div>
          <Link href="/accounts/create">
            <Button size="lg">
              <Plus size={20} />
              Create Account
            </Button>
          </Link>
        </div>
        <div className="relative w-full md:w-80">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company name"
            className="pl-9"
          />
        </div>
        {isSearching ? (
          <>
            <AccountsTable
              accounts={results.visibleItems}
              isError={allAccounts.isError}
              isPending={allAccounts.isPending}
            />
            <LoadMore
              shown={results.visibleItems.length}
              total={results.total}
              hasMore={results.hasMore}
              isLoading={false}
              onLoadMore={results.showMore}
            />
          </>
        ) : (
          <>
            <AccountsTable
              accounts={pages.items}
              isError={pages.isError}
              isPending={pages.isPending}
            />
            <LoadMore
              shown={pages.items.length}
              total={pages.total}
              hasMore={pages.hasNextPage}
              isLoading={pages.isFetchingNextPage}
              isError={pages.isFetchNextPageError}
              onLoadMore={() => pages.fetchNextPage()}
            />
          </>
        )}
      </div>
    </ContentLayout>
  )
}

export default Accounts
