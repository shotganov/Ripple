import { api } from '@shared/api'
import type { CreatePost } from '../model/types'
import type { Post } from '@entities/post'

export const createPostRequest = (post: CreatePost) =>
  api.post<Post>('/posts', post).then(res => res.data)

export type LikeState = { likes: number; isLiked: boolean }

export const likePostRequest = (postId: number) =>
  api
    .post<LikeState>(`/posts/${postId}/likes`, undefined, { skipErrorToast: true })
    .then(res => res.data)

export const unlikePostRequest = (postId: number) =>
  api
    .delete<LikeState>(`/posts/${postId}/likes`, { skipErrorToast: true })
    .then(res => res.data)

export const deletePostRequest = (postId: number) =>
  api.delete<void>(`/posts/${postId}`).then(res => res.data)
