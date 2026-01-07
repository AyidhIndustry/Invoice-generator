import { Company } from '@/schemas/company.schema'

export const companyInfo: Company = {
  name: 'Ayidh Mohammed Ayidh A- Dossary Industrial Workshop',
  address: 'Al-Oraifi Area 5001 Jubail, KSA ',
  email: 'info@ayidhindustryservices.com',
  phoneNumber: '0509162731',
  CRNumber: '2055132270',
  VATNumber: '305000486200003',
  website: 'www.ayidhindustryservices.com',
  bankDetails: {
    bankName: 'Alrajhi Bank',
    IBAN: '42300-001-0006086187956',
    accountNumber: 'SA1780000423608016187956',
  },
}

export const companyInfoArbi: Partial<Company> = {
  name: '​ورشة عايض محمد عايض الدوسري الصناعية',
  bankDetails: {
    bankName: 'مصرف الراجحي',
    IBAN: '٤٢٣٠٠-٠٠١-٠٠٠٦٠٨٦١٨٧٩٥٦',
    accountNumber: 'SA١٧٨٠٠٠٠٠٤٢٣٦٠٨٠١٦١٨٧٩٥٦',
  },
}
