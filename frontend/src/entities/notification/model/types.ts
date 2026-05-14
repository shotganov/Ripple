export type NotificationKind = 'LIKE' | 'FOLLOW' | 'COMMENT'

export type NotificationActor = {
  id: number
  username: string
  tag: string
  avatar: string | null
}

export type NotificationPost = {
  id: number
  content: string
  images: string[]
}

export type NotificationComment = {
  id: number
  content: string
}

export type Notification = {
  id: number
  type: NotificationKind
  isRead: boolean
  createdAt: string
  actor: NotificationActor
  post: NotificationPost | null
  comment: NotificationComment | null
}

export type UnreadCount = {
  count: number
}
