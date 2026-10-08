import { useMemo } from 'react'
import {
  keepPreviousData,
  QueryKey,
  useInfiniteQuery,
} from '@tanstack/react-query'
import { DocumentsPage, PageCursor } from '@/lib/firestore'

/**
 * Loads a list one page at a time. Further pages are fetched on demand with
 * `fetchNextPage`, and a refetch reloads only the pages already shown.
 */
export function usePaginatedDocuments<T>(
  queryKey: QueryKey,
  fetchPage: (cursor: PageCursor) => Promise<DocumentsPage<T>>,
) {
  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    initialPageParam: null as PageCursor,
    getNextPageParam: (lastPage) => lastPage.next,
    // Keep showing the current rows while a new filter loads.
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  })

  const items = useMemo(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data],
  )

  return {
    items,
    total: query.data?.pages[0]?.total,
    isPending: query.isPending,
    // A failed "load more" keeps the loaded rows; only the footer reports it.
    isError: query.isError && !query.isFetchNextPageError,
    isFetchNextPageError: query.isFetchNextPageError,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isRefreshing: query.isFetching && !query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
  }
}
