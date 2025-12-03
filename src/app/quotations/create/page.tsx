import ContentLayout from '@/components/layout/content.layout'
import PageLayout from '@/components/layout/page.layout'
import CreateQuotationForm from '@/components/quotations/create-quotation.form'
import BackButton from '@/components/ui/back-button'

const QuotationCreatePage = () => {
  return (
    <PageLayout>
      <ContentLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Create Quotation</h1>
              <p className="text-muted-foreground">
                Generate a new quotation for your customer
              </p>
            </div>
            <BackButton />
          </div>
          <CreateQuotationForm />
        </div>
      </ContentLayout>
    </PageLayout>
  )
}

export default QuotationCreatePage
