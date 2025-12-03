import Dashboard from '@/components/dashboard/dashboard.main'
import PageLayout from '@/components/layout/page.layout'
import { StatsProvider } from '@/context/stat.context'

export default function Home() {
  return (
    <PageLayout>
      <StatsProvider>
        <Dashboard />
      </StatsProvider>
    </PageLayout>
  )
}
