import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function LoadingState({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        {message}
      </CardContent>
    </Card>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="py-10 text-center text-red-600">
        {message}
      </CardContent>
    </Card>
  )
}
