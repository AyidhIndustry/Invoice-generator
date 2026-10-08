import ContentLayout from '@/components/layout/content.layout'
import PageLayout from '@/components/layout/page.layout'
import { CreateAccountForm } from '@/components/accounts/create-account.form'
import BackButton from '@/components/ui/back-button'

export default function AccountCreatePage() {
  return (
    <PageLayout>
      <ContentLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Create Account</h1>
              <p className="text-muted-foreground">Add a new company</p>
            </div>
            <BackButton />
          </div>
          <CreateAccountForm />
        </div>
      </ContentLayout>
    </PageLayout>
  )
}
