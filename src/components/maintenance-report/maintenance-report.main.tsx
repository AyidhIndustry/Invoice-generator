'use client'
import ContentLayout from '../layout/content.layout'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { FilterType } from '@/schemas/filter.type'
import TableFilter from '../filter'
import MaintenanceReportTable from './maintenance-report.table'
import { useGetMaintenanceReports } from '@/hooks/maintenance-report/use-get-maintenance-report'

const MaintenanceReport = () => {
  const [filter, setFilter] = useState<FilterType>({ type: 'all' })
  const { data: reports, isPending, isError } = useGetMaintenanceReports(filter)
  return (
    <ContentLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Maintenance Report</h1>
            <p className="text-muted-foreground">
              Record and track maintenance reports
            </p>
          </div>
          <Link href="/maintenance-report/create">
            <Button size="lg">
              <Plus size={20} />
              Create Maintenance Report
            </Button>
          </Link>
        </div>
        <TableFilter filters={filter} setFilters={setFilter} />
        <MaintenanceReportTable
          maintenanceReports={reports}
          isPending={isPending}
          isError={isError}
        />
      </div>
    </ContentLayout>
  )
}

export default MaintenanceReport
