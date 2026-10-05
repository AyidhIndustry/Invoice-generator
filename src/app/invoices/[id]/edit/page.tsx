import EditInvoiceForm from '@/components/invoices/edit-invoice.form'
import ContentLayout from '@/components/layout/content.layout'
import PageLayout from '@/components/layout/page.layout'
import BackButton from '@/components/ui/back-button'

interface InvoiceEditPageProps {
  params: Promise<{ id: string }>
}

const InvoiceEditPage = async ({ params }: InvoiceEditPageProps) => {
  const { id } = await params
  const invoiceId = decodeURIComponent(id)

  return (
    <PageLayout>
      <ContentLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Edit Invoice</h1>
              <p className="text-muted-foreground">
                Update the details of invoice {invoiceId}
              </p>
            </div>
            <BackButton />
          </div>
          <EditInvoiceForm invoiceId={invoiceId} />
        </div>
      </ContentLayout>
    </PageLayout>
  )
}

export default InvoiceEditPage
