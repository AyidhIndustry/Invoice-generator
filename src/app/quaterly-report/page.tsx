import PageLayout from '@/components/layout/page.layout'
import QuarterlyReport from '@/components/quaterly-report/quaterly-report.main'
import { StatsProvider } from '@/context/stat-context'

export default function QuarterlyReportPage() {
  return (
    <PageLayout>
      <StatsProvider>
        <QuarterlyReport />
      </StatsProvider>
    </PageLayout>
  )
}
