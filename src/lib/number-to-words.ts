import { ToWords } from 'to-words'

const toWords = new ToWords({
  localeCode: 'en-US',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
  },
})

export function convertSAR(amount: number): string {
  const words = toWords.convert(amount, {
    currencyOptions: {
      name: 'Riyal',
      plural: 'Riyals',
      symbol: 'SAR',
      fractionalUnit: {
        name: 'Halala',
        plural: 'Halalas',
        symbol: '',
      },
    },
  })

  return words
}
