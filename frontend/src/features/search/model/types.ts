import type { Post } from '@entities/post'
import type { User } from '@shared/model'

export type SearchMode = 'posts' | 'users'

export type SearchResult = {
  users?: User[]
  posts?: Post[]
}
