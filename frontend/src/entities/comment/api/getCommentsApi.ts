import { api } from '@shared/api'
import type { Comment } from '../model/types'

export type CommentsPage = {
  items: Comment[]
  nextCursor: number | null
}

const pageParams = (cursor?: number, limit?: number) => {
  const params: Record<string, number> = {}
  if (cursor) params.cursor = cursor
  if (limit) params.limit = limit
  return Object.keys(params).length ? { params } : undefined
}

export const getCommentsRequest = (postId: number, cursor?: number, limit?: number) =>
  api
    .get<CommentsPage>(`/posts/${postId}/comments`, pageParams(cursor, limit))
    .then(res => res.data)
