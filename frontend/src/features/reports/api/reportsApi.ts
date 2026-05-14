import { api } from '@shared/api'
import type { AdminReport, ReportReason, ReportStatus } from '../model/types'

export type ReportsPage = { items: AdminReport[]; nextCursor: number | null }

export const createReportRequest = (payload: {
  reason: ReportReason
  postId?: number
  commentId?: number
}) => api.post('/reports', payload).then(r => r.data)

export const listReportsRequest = (
  cursor?: number,
  limit = 20,
  options?: { status?: ReportStatus; archived?: boolean },
): Promise<ReportsPage> =>
  api
    .get('/admin/reports', {
      params: { cursor, limit, status: options?.status, archived: options?.archived },
    })
    .then(r => r.data)

export const dismissReportRequest = (id: number) =>
  api.patch(`/admin/reports/${id}/dismiss`).then(r => r.data)
