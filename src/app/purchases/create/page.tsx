import ContentLayout from '@/components/layout/content.layout'
import PageLayout from '@/components/layout/page.layout'
import { CreatePurchaseForm } from '@/components/purchases/create-purchase.form'
import BackButton from '@/components/ui/back-button'

const PurchaseCreatePage = () => {
  return (
    <PageLayout>
      <ContentLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Create Purchases</h1>
              <p className="text-muted-foreground">
                Record new purchases
              </p>
            </div>
            <BackButton />
          </div>
          <CreatePurchaseForm/>
        </div>
      </ContentLayout>
    </PageLayout>
  )
}

export default PurchaseCreatePage
