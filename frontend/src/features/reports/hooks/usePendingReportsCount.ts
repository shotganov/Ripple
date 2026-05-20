import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@shared/api'

const countKey = ['admin-reports-count'] as const

const fetchPendingCount = (): Promise<{ count: number }> =>
  api.get('/admin/reports/count').then(r => r.data)

const markReportsSeenRequest = (): Promise<void> =>
  api.post('/admin/reports/seen').then(r => r.data)

export const usePendingReportsCount = (enabled: boolean) =>
  useQuery({
    queryKey: countKey,
    queryFn: fetchPendingCount,
    enabled,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  })

export const useMarkReportsSeen = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markReportsSeenRequest,
    onSuccess: () => {
      qc.setQueryData<{ count: number }>(countKey, { count: 0 })
    },
  })
}
