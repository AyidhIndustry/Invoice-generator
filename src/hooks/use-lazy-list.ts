import { useState } from 'react'
import { PAGE_SIZE } from '@/lib/firestore'

/**
 * Reveals an already-loaded list `pageSize` rows at a time, so long lists
 * render quickly. Starts over whenever `items` changes, e.g. after a search.
 */
export function useLazyList<T>(
  items: T[] | undefined,
  pageSize: number = PAGE_SIZE,
) {
  const [state, setState] = useState({ items, count: pageSize })

  // Reset during render rather than in an effect to avoid a flash of rows.
  if (state.items !== items) {
    setState({ items, count: pageSize })
  }

  const count = state.items === items ? state.count : pageSize
  const list = items ?? []

  return {
    visibleItems: list.slice(0, count),
    total: list.length,
    hasMore: count < list.length,
    showMore: () => setState((s) => ({ ...s, count: s.count + pageSize })),
  }
}
