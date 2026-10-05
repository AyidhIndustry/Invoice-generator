import CreateInvoiceForm from '@/components/invoices/create-invoice.form'
import CreateInvoiceFromQuotation from '@/components/invoices/create-invoice-from-quotation'
import ContentLayout from '@/components/layout/content.layout'
import PageLayout from '@/components/layout/page.layout'
import BackButton from '@/components/ui/back-button'

interface InvoiceCreatePageProps {
  searchParams: Promise<{ quotationId?: string | string[] }>
}

const InvoiceCreatePage = async ({ searchParams }: InvoiceCreatePageProps) => {
  const { quotationId: rawQuotationId } = await searchParams
  const quotationId = Array.isArray(rawQuotationId)
    ? rawQuotationId[0]
    : rawQuotationId

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
          {quotationId ? (
            <CreateInvoiceFromQuotation quotationId={quotationId} />
          ) : (
            <CreateInvoiceForm />
          )}
        </div>
      </ContentLayout>
    </PageLayout>
  )
}

export default InvoiceCreatePage
