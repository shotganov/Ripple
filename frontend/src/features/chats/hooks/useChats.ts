import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query'
import type { Message } from '@entities/message'
import {
  fetchMessagesUnreadCountRequest,
  findChatWithPeerRequest,
  listChatsRequest,
  listMessagesRequest,
  markChatReadRequest,
  sendMessageRequest,
  type ChatsPage,
  type MessagesPage,
  type SendMessagePayload,
  type UnreadCount,
} from '../api/chatsApi'

export const chatsKey = ['chats', 'list'] as const
export const chatsSearchKey = (search: string) => ['chats', 'list', search] as const
export const chatWithPeerKey = (peerId: number) => ['chats', 'with', peerId] as const
export const messagesKey = (chatId: number) => ['chats', chatId, 'messages'] as const
export const messagesUnreadCountKey = ['messages', 'unread-count'] as const

const CHATS_PAGE_SIZE = 20
const MESSAGES_PAGE_SIZE = 30

type ChatsInfiniteData = InfiniteData<ChatsPage, number | null>
type MessagesInfiniteData = InfiniteData<MessagesPage, number | null>

export const useChats = (enabled = true, search = '') => {
  const trimmed = search.trim()
  return useInfiniteQuery({
    queryKey: trimmed ? chatsSearchKey(trimmed) : chatsKey,
    queryFn: ({ pageParam }) =>
      listChatsRequest(pageParam ?? undefined, CHATS_PAGE_SIZE, trimmed || undefined),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage: ChatsPage) => lastPage.nextCursor,
    enabled,
  })
}

export const useChatWithPeer = (peerId: number) =>
  useQuery({
    queryKey: chatWithPeerKey(peerId),
    queryFn: () => findChatWithPeerRequest(peerId),
    enabled: Number.isFinite(peerId) && peerId > 0,
  })

export const useChatMessages = (chatId: number) =>
  useInfiniteQuery({
    queryKey: messagesKey(chatId),
    queryFn: ({ pageParam }) =>
      listMessagesRequest(chatId, pageParam ?? undefined, MESSAGES_PAGE_SIZE),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage: MessagesPage) => lastPage.nextCursor,
    enabled: Number.isFinite(chatId) && chatId > 0,
  })

export const useMessagesUnreadCount = (enabled = true) =>
  useQuery({
    queryKey: messagesUnreadCountKey,
    queryFn: fetchMessagesUnreadCountRequest,
    enabled,
    refetchOnWindowFocus: true,
  })

const appendMessageToCache = (
  data: MessagesInfiniteData | undefined,
  message: Message,
): MessagesInfiniteData | undefined => {
  if (!data || data.pages.length === 0) {
    return data
      ? data
      : {
          pages: [{ items: [message], nextCursor: null }],
          pageParams: [null],
        }
  }
  if (data.pages.some(p => p.items.some(m => m.id === message.id))) return data
  const firstPage = data.pages[0]
  return {
    ...data,
    pages: [{ ...firstPage, items: [...firstPage.items, message] }, ...data.pages.slice(1)],
  }
}

export const useSendMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SendMessagePayload) => sendMessageRequest(payload),
    onSuccess: ({ chatId, message }) => {
      queryClient.setQueryData<MessagesInfiniteData>(messagesKey(chatId), old =>
        appendMessageToCache(old, message),
      )
      queryClient.invalidateQueries({ queryKey: chatsKey })
    },
  })
}

export const useMarkChatRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (chatId: number) => markChatReadRequest(chatId),
    onMutate: async chatId => {
      await queryClient.cancelQueries({ queryKey: chatsKey })

      const prevChats = queryClient.getQueryData<ChatsInfiniteData>(chatsKey)
      const prevUnread = queryClient.getQueryData<UnreadCount>(messagesUnreadCountKey)

      let cleared = 0
      if (prevChats) {
        queryClient.setQueryData<ChatsInfiniteData>(chatsKey, old => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map(page => ({
              ...page,
              items: page.items.map(c => {
                if (c.id === chatId && c.unreadCount > 0) {
                  cleared += c.unreadCount
                  return { ...c, unreadCount: 0 }
                }
                return c
              }),
            })),
          }
        })
      }
      if (prevUnread) {
        queryClient.setQueryData<UnreadCount>(messagesUnreadCountKey, {
          count: Math.max(0, prevUnread.count - cleared),
        })
      }

      return { prevChats, prevUnread }
    },
    onError: (_err, _chatId, context) => {
      if (context?.prevChats) queryClient.setQueryData(chatsKey, context.prevChats)
      if (context?.prevUnread) {
        queryClient.setQueryData(messagesUnreadCountKey, context.prevUnread)
      }
    },
  })
}

export { appendMessageToCache }
