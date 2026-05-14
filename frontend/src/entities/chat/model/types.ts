export type ChatCompanion = {
  id: number
  username: string
  tag: string
  avatar: string | null
}

export type ChatLastMessage = {
  id: number
  content: string
  createdAt: string
  senderId: number
  isRead: boolean
}

export type Chat = {
  id: number
  companion: ChatCompanion
  lastMessage: ChatLastMessage | null
  unreadCount: number
}
