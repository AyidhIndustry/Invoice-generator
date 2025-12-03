'use client'
import ContentLayout from '../layout/content.layout'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import PurchasesTable from './purchase.table'
import { useState } from 'react'
import { FilterType } from '@/schemas/filter.type'
import { useGetPurchases } from '@/hooks/purchases/use-get-purchase'
import TableFilter from '../filter'

const Purchases = () => {
  const [filter, setFilter] = useState<FilterType>({ type: 'all' })
  const { data: purchases, isPending, isError } = useGetPurchases(filter)
  return (
    <ContentLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
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
        <TableFilter filters={filter} setFilters={setFilter} />
        <PurchasesTable
          purchases={purchases}
          isError={isError}
          isPending={isPending}
        />
      </div>
    </ContentLayout>
  )
}

export default Purchases
