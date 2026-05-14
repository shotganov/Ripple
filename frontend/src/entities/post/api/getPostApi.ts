import { api } from '@shared/api'
import type { Post } from '../model/types'

export type PostsPage = {
  items: Post[]
  nextCursor: number | null
}

const pageParams = (cursor?: number, limit?: number) => {
  const params: Record<string, number> = {}
  if (cursor) params.cursor = cursor
  if (limit) params.limit = limit
  return Object.keys(params).length ? { params } : undefined
}

export const getPostsRequest = (cursor?: number, limit?: number) =>
  api.get<PostsPage>('/posts', pageParams(cursor, limit)).then(res => res.data)

export const getFeedRequest = (cursor?: number, limit?: number) =>
  api.get<PostsPage>('/posts/feed', pageParams(cursor, limit)).then(res => res.data)

export const getUserPostsRequest = (id: number, cursor?: number, limit?: number) =>
  api.get<PostsPage>(`users/${id}/posts`, pageParams(cursor, limit)).then(res => res.data)

export const getPostRequest = (id: number) => api.get<Post>(`/posts/${id}`).then(res => res.data)
