import ContentLayout from '@/components/layout/content.layout'
import PageLayout from '@/components/layout/page.layout'
import PurchaseView from '@/components/purchases/purchase-view'

interface PurchasePageProps {
  params: Promise<{ id: string }>
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
