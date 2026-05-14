import type { User } from '@shared/model'

export type Post = {
  id: number
  content: string
  images: string[]
  createdAt: string
  likes: number
  comments: number
  isLiked: boolean
  user: User
}
