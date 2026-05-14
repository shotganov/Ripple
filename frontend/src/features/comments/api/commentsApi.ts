import { api } from '@shared/api'
import type { CreateComment } from '../model/types'
import type { Comment } from '@entities/comment'

export const createCommentRequest = (postId: number, comment: CreateComment) =>
  api.post<Comment>(`/posts/${postId}/comments`, comment).then(res => res.data)

export const deleteCommentRequest = (commentId: number) =>
  api.delete<void>(`/comments/${commentId}`).then(res => res.data)
