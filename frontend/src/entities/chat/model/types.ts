import type { User } from '@shared/model'

export type ChatLastMessage = {
  id: number
  content: string
  createdAt: string
  senderId: number
  isRead: boolean
}

export type Chat = {
  id: number
  companion: User
  lastMessage: ChatLastMessage | null
  unreadCount: number
}
