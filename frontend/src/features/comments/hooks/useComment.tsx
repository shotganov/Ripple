import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query'
import { getCommentsRequest } from '@entities/comment'
import type { Comment, CommentsPage } from '@entities/comment'
import { createCommentRequest, deleteCommentRequest } from '../api/commentsApi'
import type { CreateComment } from '../model/types'

const PAGE_SIZE = 20

const commentsKey = (postId: number) => ['posts', postId, 'comments'] as const

export const useComments = (postId: number) =>
  useInfiniteQuery({
    queryKey: commentsKey(postId),
    queryFn: ({ pageParam }) =>
      getCommentsRequest(postId, pageParam ?? undefined, PAGE_SIZE),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage: CommentsPage) => lastPage.nextCursor,
    enabled: Number.isFinite(postId),
  })

export const useCreateComment = (postId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (comment: CreateComment) => createCommentRequest(postId, comment),
    onSuccess: newComment => {
      queryClient.setQueryData<InfiniteData<CommentsPage, number | null>>(
        commentsKey(postId),
        old => {
          if (!old) return old
          const [firstPage, ...rest] = old.pages
          if (!firstPage) return old
          if (firstPage.items.some(c => c.id === newComment.id)) return old
          return {
            ...old,
            pages: [
              { ...firstPage, items: [newComment as Comment, ...firstPage.items] },
              ...rest,
            ],
          }
        },
      )
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
    },
  })
}

export const useDeleteComment = (postId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId: number) => deleteCommentRequest(commentId),
    onSuccess: (_data, commentId) => {
      queryClient.setQueryData<InfiniteData<CommentsPage, number | null>>(
        commentsKey(postId),
        old => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map(page => ({
              ...page,
              items: page.items.filter(c => c.id !== commentId),
            })),
          }
        },
      )
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
