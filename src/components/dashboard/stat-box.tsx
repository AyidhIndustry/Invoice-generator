import { Loader2 } from 'lucide-react'
import { CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'

type TaxBreakdown = {
  received: number
  paid: number
  net: number
}

type Props = {
  title: string
  value?: string | number
  subtitle?: string
  gradient?: string
  loading?: boolean
  tax?: TaxBreakdown
}

export const StatBox = ({
  title,
  value,
  subtitle,
  gradient,
  loading,
  tax,
}: Props) => {
  const isTax = title.toLowerCase() === 'tax'


  const money = useMemo(
    () =>
      new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [],
  )

  return (
    <div className="rounded-2xl shadow-md overflow-hidden border border-transparent hover:shadow-xl transition-shadow duration-200 bg-white/40 backdrop-blur-sm">
      <CardContent
        className={cn('p-5 flex items-center gap-4 h-full', gradient)}
      >
        <div className="flex flex-col w-full">
          <div className="text-sm text-slate-600">{title}</div>

          {/* ================= NORMAL STATS ================= */}
          {!isTax && (
            <>
              <div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
                {loading ? (
                  <Loader2 className="animate-spin h-6 w-6" />
                ) : (
                  value
                )}
              </div>

              {subtitle && (
                <div className="text-xs mt-1 text-slate-500">{subtitle}</div>
              )}
            </>
          )}

          {/* ================= TAX STATS ================= */}
          {isTax && (
            <div className="mt-2 space-y-1 text-sm">
              {loading || !tax ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-semibold">Received (invoice)</span>
                    <span className="font-bold text-green-600 text-xl">
                      {money.format(tax.received)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600 font-semibold">Paid (purchases)</span>
                    <span className="font-bold text-red-400 text-xl">
                      {money.format(tax.paid)}
                    </span>
                  </div>

                  {/* <div className="flex justify-between border-t pt-1">
                    <span className="text-slate-700 font-medium">Net</span>
                    <span
                      className={cn(
                        'font-bold',
                        tax.net >= 0
                          ? 'text-green-800'
                          : 'text-red-700',
                      )}
                    >
                      {tax.net}
                    </span>
                  </div> */}
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </div>
  )
}
