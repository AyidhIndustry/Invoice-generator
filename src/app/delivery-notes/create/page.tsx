import DeliveryNoteForm from '@/components/delivery-notes/create-delivery-note.form'
import ContentLayout from '@/components/layout/content.layout'
import PageLayout from '@/components/layout/page.layout'
import BackButton from '@/components/ui/back-button'


const CreateDeliveryNotesPage = () => {
  return (
    <PageLayout>
      <ContentLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                Create Delivery Note
              </h1>
              <p className="text-muted-foreground">
                Create a new delivery note linked to an invoice
              </p>
            </div>
            <BackButton />
          </div>
          <DeliveryNoteForm />
        </div>
      </ContentLayout>
    </PageLayout>
  )
}

export default CreateDeliveryNotesPage
