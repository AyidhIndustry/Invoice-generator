import ContentLayout from '@/components/layout/content.layout'
import PageLayout from '@/components/layout/page.layout'
import PurchaseView from '@/components/purchases/purchase-view'
import { Card } from '@/components/ui/card'
import { useGetPurchasesById } from '@/hooks/purchases/use-get-purchase-by-id' 

interface PurchasePageProps {
  params: {
    id: string
  }
}

export default async function PurchasePage({ params }: PurchasePageProps) {
  const { id } = await params
  

  return (
    <PageLayout>
      <ContentLayout>
        <div className='space-y-6'>
            <h2 className="text-3xl font-bold">Purchase #{id}</h2>
            <PurchaseView id={id}/>
        </div>
      </ContentLayout>
    </PageLayout>
  )
}
