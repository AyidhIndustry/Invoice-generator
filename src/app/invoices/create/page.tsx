import CreateInvoiceForm from '@/components/invoices/create-invoice.form'
import ContentLayout from '@/components/layout/content.layout'
import PageLayout from '@/components/layout/page.layout'
import BackButton from '@/components/ui/back-button'

const InvoiceCreatePage = () => {
  return (
    <PageLayout>
      <ContentLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Create Invoice</h1>
              <p className="text-muted-foreground">
                Generate a new invoice for your customer
              </p>
            </div>
            <BackButton />
          </div>
          <CreateInvoiceForm />
        </div>
      </ContentLayout>
    </PageLayout>
  )
}

export default InvoiceCreatePage
