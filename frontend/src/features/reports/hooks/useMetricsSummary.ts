import { useQuery } from '@tanstack/react-query'
import { fetchMetricsSummary } from '../api/metricsApi'

export const useMetricsSummary = () =>
  useQuery({
    queryKey: ['admin', 'metrics', 'summary'],
    queryFn: fetchMetricsSummary,
    refetchInterval: 30_000,
  })
