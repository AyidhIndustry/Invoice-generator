'use client'
import ContentLayout from '../layout/content.layout'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import PurchasesTable from './purchase.table'
import { useState } from 'react'
import { FilterType } from '@/schemas/filter.type'
import { usePaginatedPurchases } from '@/hooks/purchases/use-get-purchase'
import TableFilter from '../filter'
import { LoadMore } from '../ui/load-more'

const Purchases = () => {
  const [filter, setFilter] = useState<FilterType>({ type: 'all' })
  const purchases = usePaginatedPurchases(filter)
  return (
    <ContentLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Purchases</h1>
            <p className="text-muted-foreground">
              Record and track business purchases
            </p>
          </div>
          <Link href="/purchases/create">
            <Button size="lg">
              <Plus size={20} />
              Create Purchase
            </Button>
          </Link>
        </div>
        <TableFilter
          filters={filter}
          setFilters={setFilter}
          refetch={purchases.refetch}
          isFetching={purchases.isRefreshing}
        />
        <PurchasesTable
          purchases={purchases.items}
          isPending={purchases.isPending}
          isError={purchases.isError}
        />
        <LoadMore
          shown={purchases.items.length}
          total={purchases.total}
          hasMore={purchases.hasNextPage}
          isLoading={purchases.isFetchingNextPage}
          isError={purchases.isFetchNextPageError}
          onLoadMore={() => purchases.fetchNextPage()}
        />
      </div>
    </ContentLayout>
  )
}

export default Purchases
