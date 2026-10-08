'use client'
import { Plus } from 'lucide-react'
import ContentLayout from '../layout/content.layout'
import { Button } from '../ui/button'
import Link from 'next/link'
import InvoicesTable from './invoices.table'
import { useState } from 'react'
import { usePaginatedInvoices } from '@/hooks/invoices/use-get-invoice'
import { FilterType } from '@/schemas/filter.type'
import TableFilter from '../filter'
import { LoadMore } from '../ui/load-more'

const Invoices = () => {
  const [filters, setFilters] = useState<FilterType>({ type: 'all' })
  const invoices = usePaginatedInvoices(filters)
  return (
    <ContentLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Invoices</h1>
            <p className="text-muted-foreground">Manage and store Invoices</p>
          </div>
          <Link href="/invoices/create">
            <Button variant={'default'}>
              <Plus size={20} /> Create Invoice
            </Button>
          </Link>
        </div>
        <TableFilter
          filters={filters}
          setFilters={setFilters}
          refetch={invoices.refetch}
          isFetching={invoices.isRefreshing}
        />
        <InvoicesTable
          invoices={invoices.items}
          isPending={invoices.isPending}
          isError={invoices.isError}
        />
        <LoadMore
          shown={invoices.items.length}
          total={invoices.total}
          hasMore={invoices.hasNextPage}
          isLoading={invoices.isFetchingNextPage}
          isError={invoices.isFetchNextPageError}
          onLoadMore={() => invoices.fetchNextPage()}
        />
      </div>
    </ContentLayout>
  )
}

export default Invoices
