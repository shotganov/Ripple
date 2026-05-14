import { useEffect } from 'react'
import { useQueryClient, type InfiniteData } from '@tanstack/react-query'
import { getSocket } from '@shared/api'
import { useAppSelector } from '@shared/hooks'
import { selectUser } from '@entities/user'
import type { Message } from '@entities/message'
import {
  appendMessageToCache,
  chatsKey,
  messagesKey,
  messagesUnreadCountKey,
} from './useChats'
import type { ChatsPage, MessagesPage, UnreadCount } from '../api/chatsApi'

type MessageNewPayload = { chatId: number; message: Message }
type MessageReadPayload = { chatId: number; readerId: number }

type MessagesInfiniteData = InfiniteData<MessagesPage, number | null>
type ChatsInfiniteData = InfiniteData<ChatsPage, number | null>

export const useSocketSync = () => {
  const queryClient = useQueryClient()
  const user = useAppSelector(selectUser)
  const currentUserId = user?.id

  useEffect(() => {
    if (!currentUserId) return
    const socket = getSocket()

    const handleNew = ({ chatId, message }: MessageNewPayload) => {
      queryClient.setQueryData<MessagesInfiniteData>(messagesKey(chatId), old =>
        appendMessageToCache(old, message),
      )

      queryClient.invalidateQueries({ queryKey: chatsKey })

      if (message.senderId !== currentUserId) {
        queryClient.setQueryData<UnreadCount>(messagesUnreadCountKey, prev =>
          prev ? { count: prev.count + 1 } : { count: 1 },
        )
      }
    }

    const handleRead = ({ chatId }: MessageReadPayload) => {
      queryClient.setQueryData<MessagesInfiniteData>(messagesKey(chatId), old => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map(page => ({
            ...page,
            items: page.items.map(m =>
              m.senderId === currentUserId && !m.isRead ? { ...m, isRead: true } : m,
            ),
          })),
        }
      })

      queryClient.setQueryData<ChatsInfiniteData>(chatsKey, old => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map(page => ({
            ...page,
            items: page.items.map(c => {
              if (c.id !== chatId || !c.lastMessage) return c
              if (c.lastMessage.senderId !== currentUserId) return c
              return { ...c, lastMessage: { ...c.lastMessage, isRead: true } }
            }),
          })),
        }
      })
    }

    const handleConnect = () => {
      queryClient.invalidateQueries({ queryKey: chatsKey })
      queryClient.invalidateQueries({ queryKey: messagesUnreadCountKey })
    }

    socket.on('message:new', handleNew)
    socket.on('message:read', handleRead)
    socket.on('connect', handleConnect)

    return () => {
      socket.off('message:new', handleNew)
      socket.off('message:read', handleRead)
      socket.off('connect', handleConnect)
    }
  }, [currentUserId, queryClient])
}
