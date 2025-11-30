import Link from 'next/link'
import ContentLayout from '../layout/content.layout'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import DeliveryNotesTable from './delivery-note.table'

const DeliveryNotes = () => {
  return (
    <ContentLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Delivery Notes</h1>
            <p className="text-muted-foreground">
              Manage and track delivery notes linked to invoices
            </p>
          </div>
          <Link href="/delivery-notes/create">
            <Button variant={'default'}>
              <Plus size={20} /> Create Delivery Note
            </Button>
          </Link>
        </div>
        <DeliveryNotesTable />
      </div>
    </ContentLayout>
  )
}

export default DeliveryNotes
