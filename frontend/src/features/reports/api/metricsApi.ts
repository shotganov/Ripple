import { api } from '@shared/api'

export type MetricsSummary = {
  http: {
    totalRequests: number
    totalErrors: number
    cpuUsage: number
    avgDurationMs: number
  }
  activity: {
    postsCreated: number
    commentsCreated: number
    likesGiven: number
    messagesSent: number
  }
  realtime: {
    wsConnections: number
  }
}

export const fetchMetricsSummary = (): Promise<MetricsSummary> =>
  api.get('/admin/metrics/summary').then(r => r.data)
