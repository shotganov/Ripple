import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from '@tanstack/react-query'
import {
  createReportRequest,
  dismissByTargetRequest,
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
      listReportsRequest(pageParam ?? 0, PAGE_SIZE, filter),
    initialPageParam: 0 as number,
    getNextPageParam: (lastPage: ReportsPage) => {
      const nextOffset = lastPage.offset + lastPage.limit
      return nextOffset < lastPage.total ? nextOffset : null
    },
  })

export const useCreateReport = () =>
  useMutation({
    mutationFn: (payload: {
      reason: ReportReason
      postId?: number
      commentId?: number
    }) => createReportRequest(payload),
  })

export const removeGroupFromCache = (
  queryClient: QueryClient,
  type: 'post' | 'comment',
  targetId: number,
) => {
  queryClient.setQueriesData<InfiniteData<ReportsPage>>(
    { predicate: q => q.queryKey[0] === 'admin' && q.queryKey[1] === 'reports' },
    old =>
      old
        ? {
            ...old,
            pages: old.pages.map(page => ({
              ...page,
              total: page.total - (page.items.some(g => g.type === type && g.targetId === targetId) ? 1 : 0),
              items: page.items.filter(g => !(g.type === type && g.targetId === targetId)),
            })),
          }
        : old,
  )
}

export const useDismissByTarget = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ type, targetId }: { type: 'post' | 'comment'; targetId: number }) =>
      dismissByTargetRequest(type, targetId),
    onSuccess: (_data, { type, targetId }) => removeGroupFromCache(queryClient, type, targetId),
  })
}
