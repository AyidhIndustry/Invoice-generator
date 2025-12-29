'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SkeletonTable } from '../ui/skeleton-table'
import { formatTimestamp } from '@/lib/format-timestring'
import { Eye } from 'lucide-react'
import DeleteItemDialog from '../dialogs/delete-item.dialog'
import Link from 'next/link'
import { useDeleteMaintenanceReport } from '@/hooks/maintenance-report/use-delete-maintenance-report'
import { MaintenanceReport } from '@/schemas/maintenance-report.schema'
import { PrintMaintenanceReportButton } from './print-maintenance-report-button'
import { nf } from '@/lib/number-format'

export default function MaintenanceReportTable({
  maintenanceReports,
  isPending,
  isError,
}: {
  maintenanceReports?: MaintenanceReport[]
  isPending: boolean
  isError: boolean
}) {
  const {
    mutate: deleteMaintenanceReport,
    isPending: isMaintenanceReportDeletePending,
    isError: isMaintenanceReportDeleteError,
  } = useDeleteMaintenanceReport()
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/70">
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <SkeletonTable />}
          {isError && !isPending && (
            <TableRow>
              <TableCell colSpan={6} className="py-6 text-center text-red-600">
                Failed to load Maintenance Reports.
              </TableCell>
            </TableRow>
          )}
          {maintenanceReports &&
            !isPending &&
            !isError &&
            maintenanceReports.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-6 text-center text-muted-foreground"
                >
                  No Maintenance Reports found.
                </TableCell>
              </TableRow>
            )}
          {maintenanceReports &&
            !isPending &&
            !isError &&
            maintenanceReports.map((maintenanceReport: MaintenanceReport) => {
              return (
                <TableRow key={maintenanceReport.id}>
                  <TableCell className="font-medium">
                    {maintenanceReport.id}
                  </TableCell>
                  <TableCell>
                    {formatTimestamp(maintenanceReport.date)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {maintenanceReport.customer?.name ?? '—'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {maintenanceReport.customer?.email ?? '—'}
                      </span>
                    </div>
                  </TableCell>

                 
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <PrintMaintenanceReportButton
                        report={maintenanceReport}
                      />

                      <DeleteItemDialog
                        name="Maintenance Report"
                        id={maintenanceReport.id as string}
                        onDelete={deleteMaintenanceReport}
                        isPending={isMaintenanceReportDeletePending}
                        isError={isMaintenanceReportDeleteError}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
    </div>
  )
}
