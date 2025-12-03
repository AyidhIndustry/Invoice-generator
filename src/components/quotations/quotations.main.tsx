"use client"
import { FilterType } from '@/schemas/filter.type'
import ContentLayout from '../layout/content.layout'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useGetQuotations } from '@/hooks/quotations/use-get-quotation'
import TableFilter from '../filter'
import QuotationTable from './quotation-table'

const Quotations = () => {
  const [filter, setFilter] = useState<FilterType>({ type: 'all' })
  const { data: quotations, isPending, isError } = useGetQuotations(filter)
  return (
    <ContentLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Quotation</h1>
            <p className="text-muted-foreground">
              Create and manage quotations
            </p>
          </div>
          <Link href="/quotations/create">
            <Button size="lg">
              <Plus size={20} />
              Create Quotation
            </Button>
          </Link>
        </div>
        <TableFilter filters={filter} setFilters={setFilter} />
        <QuotationTable quotations={quotations} isPending={isPending} isError={isError}/>
      </div>
    </ContentLayout>
  )
}

export default Quotations
