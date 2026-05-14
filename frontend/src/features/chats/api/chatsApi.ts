import { api } from '@shared/api'
import type { Chat } from '@entities/chat'
import type { Message } from '@entities/message'

export type UnreadCount = { count: number }
export type ChatsPage = { items: Chat[]; nextCursor: number | null }
export type MessagesPage = { items: Message[]; nextCursor: number | null }
export type SendMessagePayload = { chatId?: number; peerId?: number; content: string }
export type SendMessageResponse = { chatId: number; message: Message }

const pageParams = (params: Record<string, number | string | undefined>) => {
  const filtered: Record<string, number | string> = {}
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') filtered[k] = v
  })
  return Object.keys(filtered).length ? { params: filtered } : undefined
}

export const listChatsRequest = (cursor?: number, limit?: number, search?: string) =>
  api.get<ChatsPage>('/chats', pageParams({ cursor, limit, search })).then(r => r.data)

export const findChatWithPeerRequest = (peerId: number) =>
  api.get<Chat | null>(`/chats/with/${peerId}`).then(r => r.data)

export const listMessagesRequest = (chatId: number, before?: number, limit?: number) =>
  api
    .get<MessagesPage>(`/chats/${chatId}/messages`, pageParams({ before, limit }))
    .then(r => r.data)

export const sendMessageRequest = (payload: SendMessagePayload) =>
  api.post<SendMessageResponse>('/messages', payload).then(r => r.data)

export const markChatReadRequest = (chatId: number) =>
  api
    .patch<{ unreadCount: number }>(
      `/chats/${chatId}/messages/read`,
      undefined,
      { skipErrorToast: true },
    )
    .then(r => r.data)

export const fetchMessagesUnreadCountRequest = () =>
  api.get<UnreadCount>('/messages/unread-count').then(r => r.data)
