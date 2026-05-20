import type { User } from '@shared/model'

export type Comment = {
  id: number
  user: User
  content: string
  createdAt: string
}
