import ContentLayout from '../layout/content.layout'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

const Quotations = () => {
  return (
    <ContentLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Quotation</h1>
              <p className="text-muted-foreground">
                Create and manage quotations
              </p>
            </div>
            <Link href="/quotations/create">
              <Button size="lg">
                <Plus size={20} />
                Create Quotation
              </Button>
            </Link>
          </div>
          
        </div>
    </ContentLayout>
  )
}

export default Quotations
