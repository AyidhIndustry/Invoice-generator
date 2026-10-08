import EditAccountForm from '@/components/accounts/edit-account.form'
import ContentLayout from '@/components/layout/content.layout'
import PageLayout from '@/components/layout/page.layout'
import BackButton from '@/components/ui/back-button'

interface AccountEditPageProps {
  params: Promise<{ id: string }>
}

const AccountEditPage = async ({ params }: AccountEditPageProps) => {
  const { id } = await params
  const accountId = decodeURIComponent(id)

  return (
    <PageLayout>
      <ContentLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Edit Account</h1>
              <p className="text-muted-foreground">
                Update the details of account {accountId}
              </p>
            </div>
            <BackButton />
          </div>
          <EditAccountForm accountId={accountId} />
        </div>
      </ContentLayout>
    </PageLayout>
  )
}

export default AccountEditPage
