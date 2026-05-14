import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from '@tanstack/react-query'
import {
  createReportRequest,
  dismissReportRequest,
  listReportsRequest,
  type ReportsPage,
} from '../api/reportsApi'
import type { ReportReason, ReportStatus } from '../model/types'

type ReportsFilter = { status?: ReportStatus; archived?: boolean }

export const reportsKey = (filter?: ReportsFilter) => {
  if (filter?.status) return ['admin', 'reports', 'status', filter.status] as const
  if (filter?.archived) return ['admin', 'reports', 'archived'] as const
  return ['admin', 'reports'] as const
}

const PAGE_SIZE = 20

export const useReports = (filter?: ReportsFilter) =>
  useInfiniteQuery({
    queryKey: reportsKey(filter),
    queryFn: ({ pageParam }) =>
      listReportsRequest(pageParam ?? undefined, PAGE_SIZE, filter),
    initialPageParam: null as number | null,
    getNextPageParam: (p: ReportsPage) => p.nextCursor,
  })

export const useCreateReport = () =>
  useMutation({
    mutationFn: (payload: {
      reason: ReportReason
      postId?: number
      commentId?: number
    }) => createReportRequest(payload),
  })

export const removeReportFromCache = (queryClient: QueryClient, id: number) => {
  queryClient.setQueriesData<InfiniteData<ReportsPage>>(
    { predicate: q => q.queryKey[0] === 'admin' && q.queryKey[1] === 'reports' },
    old =>
      old
        ? {
            ...old,
            pages: old.pages.map(page => ({
              ...page,
              items: page.items.filter(r => r.id !== id),
            })),
          }
        : old,
  )
}

export const useDismissReport = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => dismissReportRequest(id),
    onSuccess: (_data, id) => removeReportFromCache(queryClient, id),
  })
}
