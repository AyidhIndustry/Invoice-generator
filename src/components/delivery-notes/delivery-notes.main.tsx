'use client'
import Link from 'next/link'
import ContentLayout from '../layout/content.layout'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import DeliveryNotesTable from './delivery-note.table'
import { useState } from 'react'
import { usePaginatedDeliveryNotes } from '@/hooks/delivery-notes/use-get-deliverynote'
import { FilterType } from '@/schemas/filter.type'
import TableFilter from '../filter'
import { LoadMore } from '../ui/load-more'

const DeliveryNotes = () => {
  const [filter, setFilter] = useState<FilterType>({ type: 'all' })
  const deliveryNotes = usePaginatedDeliveryNotes(filter)
  return (
    <ContentLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Delivery Notes</h1>
            <p className="text-muted-foreground">
              Manage and track delivery notes linked to invoices
            </p>
          </div>
          <Link href="/delivery-notes/create">
            <Button variant={'default'}>
              <Plus size={20} /> Create Delivery Note
            </Button>
          </Link>
        </div>
        <TableFilter
          filters={filter}
          setFilters={setFilter}
          refetch={deliveryNotes.refetch}
          isFetching={deliveryNotes.isRefreshing}
        />
        <DeliveryNotesTable
          deliverynotes={deliveryNotes.items}
          isPending={deliveryNotes.isPending}
          isError={deliveryNotes.isError}
        />
        <LoadMore
          shown={deliveryNotes.items.length}
          total={deliveryNotes.total}
          hasMore={deliveryNotes.hasNextPage}
          isLoading={deliveryNotes.isFetchingNextPage}
          isError={deliveryNotes.isFetchNextPageError}
          onLoadMore={() => deliveryNotes.fetchNextPage()}
        />
      </div>
    </ContentLayout>
  )
}

export default DeliveryNotes
