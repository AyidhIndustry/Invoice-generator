"use client"
import ContentLayout from '@/components/layout/content.layout'
import PageLayout from '@/components/layout/page.layout'
import CreateMaintenanceReportForm from '@/components/maintenance-report/create-maintenance-report.form'
import BackButton from '@/components/ui/back-button'

const CreateMaintenanceReportPage = () => {
  return (
    <PageLayout>
      <ContentLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Create Maintenance Report</h1>
              <p className="text-muted-foreground">
                Generate a new maintenance report for your customer
              </p>
            </div>
            <BackButton />
          </div>
          <CreateMaintenanceReportForm />
        </div>
      </ContentLayout>
    </PageLayout>
  )
}

export default CreateMaintenanceReportPage
