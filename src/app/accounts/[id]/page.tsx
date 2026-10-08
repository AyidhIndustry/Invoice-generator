import AccountView from '@/components/accounts/account-view'
import { EditAccountButton } from '@/components/accounts/edit-account-button'
import ContentLayout from '@/components/layout/content.layout'
import PageLayout from '@/components/layout/page.layout'
import BackButton from '@/components/ui/back-button'

interface AccountPageProps {
  params: Promise<{ id: string }>
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { id } = await params
  const accountId = decodeURIComponent(id)

  return (
    <PageLayout>
      <ContentLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Account Details</h1>
              <p className="text-muted-foreground">Account {accountId}</p>
            </div>
            <div className="flex items-center gap-2">
              <EditAccountButton accountId={accountId} />
              <BackButton />
            </div>
          </div>
          <AccountView accountId={accountId} />
        </div>
      </ContentLayout>
    </PageLayout>
  )
}
