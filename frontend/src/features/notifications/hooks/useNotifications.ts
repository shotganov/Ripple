import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query'
import type { UnreadCount } from '@entities/notification'
import {
  fetchNotificationsRequest,
  fetchUnreadCountRequest,
  markAllNotificationsReadRequest,
  type NotificationsPage,
} from '../api/notificationsApi'

const PAGE_SIZE = 20

const notificationsKey = ['notifications', 'list'] as const
const unreadCountKey = ['notifications', 'unread-count'] as const

type NotificationsInfiniteData = InfiniteData<NotificationsPage, number | null>

export const useNotifications = () =>
  useInfiniteQuery({
    queryKey: notificationsKey,
    queryFn: ({ pageParam }) =>
      fetchNotificationsRequest(pageParam ?? undefined, PAGE_SIZE),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage: NotificationsPage) => lastPage.nextCursor,
  })

export const useUnreadCount = (enabled = true) =>
  useQuery({
    queryKey: unreadCountKey,
    queryFn: fetchUnreadCountRequest,
    enabled,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  })

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markAllNotificationsReadRequest,
    onSuccess: () => {
      queryClient.setQueryData<NotificationsInfiniteData>(notificationsKey, old => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map(page => ({
            ...page,
            items: page.items.map(n => ({ ...n, isRead: true })),
          })),
        }
      })
      queryClient.setQueryData<UnreadCount>(unreadCountKey, { count: 0 })
    },
  })
}
