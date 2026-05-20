import { api } from '@shared/api'
import type { ReportGroup, ReportReason, ReportStatus } from '../model/types'

export type ReportsPage = {
  items: ReportGroup[]
  total: number
  offset: number
  limit: number
}

export const createReportRequest = (payload: {
  reason: ReportReason
  postId?: number
  commentId?: number
}) => api.post('/reports', payload).then(r => r.data)

export const listReportsRequest = (
  offset = 0,
  limit = 20,
  options?: { status?: ReportStatus; archived?: boolean },
): Promise<ReportsPage> =>
  api
    .get('/admin/reports', {
      params: { offset, limit, status: options?.status, archived: options?.archived },
    })
    .then(r => r.data)

export const dismissByTargetRequest = (type: 'post' | 'comment', targetId: number) =>
  api.patch(`/admin/reports/${type}/${targetId}/dismiss`).then(r => r.data)
