'use client'

import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  /** Rows currently shown. */
  shown: number
  /** All matching rows, if known. */
  total?: number
  hasMore: boolean
  isLoading: boolean
  isError?: boolean
  onLoadMore: () => void
}

/**
 * Table footer that loads the next page when it scrolls into view, with a
 * button as a fallback. Auto-loading pauses after an error until the user
 * retries.
 */
export function LoadMore({
  shown,
  total,
  hasMore,
  isLoading,
  isError = false,
  onLoadMore,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const onLoadMoreRef = useRef(onLoadMore)

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore
  }, [onLoadMore])

  // Re-observing whenever rows are added re-checks visibility, so a page too
  // short to fill the screen keeps loading until it does.
  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasMore || isLoading || isError) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMoreRef.current()
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [shown, hasMore, isLoading, isError])

  if (shown === 0) return null

  return (
    <div
      ref={sentinelRef}
      className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground"
    >
      <span>
        {hasMore
          ? `Showing ${shown}${total !== undefined ? ` of ${total}` : ''}`
          : `Showing all ${shown}`}
      </span>

      {isError && (
        <span className="text-red-600">Failed to load more rows.</span>
      )}

      {hasMore && (
        <Button
          variant="outline"
          size="sm"
          onClick={onLoadMore}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? 'Loading…' : isError ? 'Retry' : 'Load more'}
        </Button>
      )}
    </div>
  )
}
