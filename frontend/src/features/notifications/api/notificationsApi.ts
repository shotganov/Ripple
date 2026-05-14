import { api } from '@shared/api'
import type { Notification, UnreadCount } from '@entities/notification'

export type NotificationsPage = {
  items: Notification[]
  nextCursor: number | null
}

const pageParams = (cursor?: number, limit?: number) => {
  const params: Record<string, number> = {}
  if (cursor) params.cursor = cursor
  if (limit) params.limit = limit
  return Object.keys(params).length ? { params } : undefined
}

export const fetchNotificationsRequest = (cursor?: number, limit?: number) =>
  api
    .get<NotificationsPage>('/notifications', pageParams(cursor, limit))
    .then(res => res.data)

export const fetchUnreadCountRequest = () =>
  api.get<UnreadCount>('/notifications/unread-count').then(res => res.data)

export const markAllNotificationsReadRequest = () =>
  api
    .patch<UnreadCount>('/notifications/read', undefined, { skipErrorToast: true })
    .then(res => res.data)
