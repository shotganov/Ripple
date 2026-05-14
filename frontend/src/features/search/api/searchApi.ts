import type { Post } from '@entities/post'
import { api } from '@shared/api'
import type { User } from '@shared/model'

export type UsersSearchPage = {
  items: User[]
  nextCursor: number | null
}

export type PostsSearchPage = {
  items: Post[]
  nextCursor: number | null
}

const buildParams = (query: string, type: 'users' | 'posts', cursor?: number, limit?: number) => {
  const params: Record<string, string | number> = { query, type }
  if (cursor) params.cursor = cursor
  if (limit) params.limit = limit
  return { params }
}

export const searchRequestUsers = (query: string, cursor?: number, limit?: number) =>
  api.get<UsersSearchPage>('/search', buildParams(query, 'users', cursor, limit)).then(res => res.data)

export const searchRequestPosts = (query: string, cursor?: number, limit?: number) =>
  api.get<PostsSearchPage>('/search', buildParams(query, 'posts', cursor, limit)).then(res => res.data)
