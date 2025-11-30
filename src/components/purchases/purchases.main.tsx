import ContentLayout from '../layout/content.layout'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import PurchasesTable from './purchase.table'

const Purchases = () => {
  return (
     <ContentLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Purchases</h1>
              <p className="text-muted-foreground">
                Record and track business purchases
              </p>
            </div>
            <Link href="/purchases/create">
              <Button size="lg">
                <Plus size={20} />
                Create Purchase
              </Button>
            </Link>
          </div>
          <PurchasesTable/>
        </div>
    </ContentLayout>
  )
}

export default Purchases
