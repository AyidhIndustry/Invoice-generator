'use client'
import { Plus } from 'lucide-react'
import ContentLayout from '../layout/content.layout'
import { Button } from '../ui/button'
import Link from 'next/link'
import InvoicesTable from './invoices.table'
import { useState } from 'react'
import { useGetInvoices } from '@/hooks/invoices/use-get-invoice'
import { FilterType } from '@/schemas/filter.type'
import TableFilter from '../filter'

const Invoices = () => {
  const [filters, setFilters] = useState<FilterType>({ type: 'all' })
  const { data: invoices, isPending, isError } = useGetInvoices(filters)
  return (
    <ContentLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Invoices
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage your invoices and track payments
            </p>
          </div>
          <Link href="/invoices/create">
            <Button size="lg">
              <Plus size={20} />
              Create Invoice
            </Button>
          </Link>
        </div>
        <TableFilter filters={filters} setFilters={setFilters} />
        <InvoicesTable
          invoices={invoices}
          isError={isError}
          isPending={isPending}
        />
      </div>
    </ContentLayout>
  )
}

export default Invoices
