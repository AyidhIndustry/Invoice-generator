import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface IconLinkButtonProps {
  href: string
  /** Accessible name, also shown as a tooltip. */
  label: string
  icon: LucideIcon
}

/** Small outlined icon button that navigates, for table row actions. */
export function IconLinkButton({
  href,
  label,
  icon: Icon,
}: IconLinkButtonProps) {
  return (
    <Button asChild size="sm" variant="outline" title={label}>
      <Link href={href} aria-label={label}>
        <Icon />
      </Link>
    </Button>
  )
}
