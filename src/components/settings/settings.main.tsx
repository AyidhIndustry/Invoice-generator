import ContentLayout from '../layout/content.layout'
import { Card, CardHeader, CardContent } from '../ui/card'
import {
  Building2,
  Globe,
  Phone,
  Mail,
  MapPin,
  BadgeInfo,
  Receipt,
  Landmark,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { companyInfo } from '@/data/company-info'

interface InfoRowProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}

const InfoRow = ({ icon: Icon, label, value }: InfoRowProps) => (
  <div className="flex items-start gap-3 py-2">
    <Icon className="w-5 h-5 text-primary" />
    <div>
      <p className="text-sm font-semibold text-muted-foreground">{label}</p>
      <p className="text-base font-medium">{value}</p>
    </div>
  </div>
)

const Settings = () => {
  return (
    <ContentLayout>
      <Card className="shadow-lg border border-muted rounded-2xl">
        <CardHeader>
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold xl:text-3xl flex items-center gap-2">
            <Building2 className="w-7 h-7 text-primary" />
            Company Information
          </h1>
          <p className="text-muted-foreground">
            All the information of your company
          </p>
        </CardHeader>

        <CardContent className="space-y-6 mt-2">
          <div>
            <h2 className="text-xl font-semibold mb-2">General Info</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <InfoRow
                icon={Building2}
                label="Company Name"
                value={companyInfo.name}
              />
              <InfoRow
                icon={MapPin}
                label="Address"
                value={companyInfo.address ?? '-'}
              />
              <InfoRow
                icon={Mail}
                label="Email"
                value={companyInfo.email ?? '-'}
              />
              <InfoRow
                icon={Phone}
                label="Phone Number"
                value={companyInfo.phoneNumber ?? '-'}
              />
              <InfoRow
                icon={BadgeInfo}
                label="CR Number"
                value={companyInfo.CRNumber ?? '-'}
              />
              <InfoRow
                icon={Receipt}
                label="VAT Number"
                value={companyInfo.VATNumber ?? '-'}
              />
              <InfoRow
                icon={Globe}
                label="Website"
                value={companyInfo.website ?? '-'}
              />
            </div>
          </div>

          <Separator />
          {companyInfo.bankDetails && (
            <>
              <div>
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Landmark className="w-6 h-6 text-primary" /> Bank Details
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <InfoRow
                    icon={Landmark}
                    label="Bank Name"
                    value={companyInfo.bankDetails.bankName}
                  />
                  <InfoRow
                    icon={Receipt}
                    label="IBAN"
                    value={companyInfo.bankDetails.IBAN}
                  />
                  <InfoRow
                    icon={Receipt}
                    label="Account Number"
                    value={companyInfo.bankDetails.accountNumber}
                  />
                </div>
              </div>
              <Separator />
            </>
          )}
        </CardContent>
      </Card>
    </ContentLayout>
  )
}

export default Settings
