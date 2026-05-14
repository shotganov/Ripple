import { useQuery } from '@tanstack/react-query'
import { fetchAdminStatsRequest } from '../api/statsApi'

export const adminStatsKey = ['admin', 'stats'] as const

export const useAdminStats = () =>
  useQuery({
    queryKey: adminStatsKey,
    queryFn: fetchAdminStatsRequest,
  })
