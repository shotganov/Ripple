import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from '@tanstack/react-query'
import {
  getFeedRequest,
  getPostRequest,
  getPostsRequest,
  getUserPostsRequest,
} from '@entities/post'
import type { Post, PostsPage } from '@entities/post'
import type { CreatePost } from '../model/types'
import {
  createPostRequest,
  deletePostRequest,
  likePostRequest,
  unlikePostRequest,
} from '../api/postApi'

const PAGE_SIZE = 20

const seedPostDetails = (queryClient: QueryClient, posts: Post[]) => {
  posts.forEach(post => {
    queryClient.setQueryData(['posts', 'detail', post.id], post)
  })
}

type InfinitePostsData = InfiniteData<PostsPage, number | null>

const buildInfiniteQuery = (
  queryKey: readonly unknown[],
  fetcher: (cursor?: number) => Promise<PostsPage>,
  enabled = true,
) => ({
  queryKey,
  queryFn: ({ pageParam }: { pageParam: number | null }) =>
    fetcher(pageParam ?? undefined),
  initialPageParam: null as number | null,
  getNextPageParam: (lastPage: PostsPage) => lastPage.nextCursor,
  enabled,
})

export const useAllPosts = () => {
  const queryClient = useQueryClient()
  const query = useInfiniteQuery(
    buildInfiniteQuery(['posts', 'list'], cursor =>
      getPostsRequest(cursor, PAGE_SIZE).then(page => {
        seedPostDetails(queryClient, page.items)
        return page
      }),
    ),
  )
  return query
}

export const useFeedPosts = () => {
  const queryClient = useQueryClient()
  return useInfiniteQuery(
    buildInfiniteQuery(['posts', 'feed'], cursor =>
      getFeedRequest(cursor, PAGE_SIZE).then(page => {
        seedPostDetails(queryClient, page.items)
        return page
      }),
    ),
  )
}

export const useUserPosts = (id: number) => {
  const queryClient = useQueryClient()
  return useInfiniteQuery(
    buildInfiniteQuery(
      ['posts', 'user', id],
      cursor =>
        getUserPostsRequest(id, cursor, PAGE_SIZE).then(page => {
          seedPostDetails(queryClient, page.items)
          return page
        }),
      Number.isFinite(id),
    ),
  )
}

export const usePost = (id: number) =>
  useQuery({
    queryKey: ['posts', 'detail', id],
    queryFn: () => getPostRequest(id),
    enabled: Number.isFinite(id),
  })

const patchPagedPosts = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  postId: number,
  patch: Partial<Post>,
) => {
  queryClient.setQueriesData<InfinitePostsData>({ queryKey }, old => {
    if (!old) return old
    return {
      ...old,
      pages: old.pages.map(page => ({
        ...page,
        items: page.items.map(p => (p.id === postId ? { ...p, ...patch } : p)),
      })),
    }
  })
}

const patchPostInCaches = (queryClient: QueryClient, postId: number, patch: Partial<Post>) => {
  patchPagedPosts(queryClient, ['posts', 'list'], postId, patch)
  patchPagedPosts(queryClient, ['posts', 'feed'], postId, patch)
  patchPagedPosts(queryClient, ['posts', 'user'], postId, patch)
  patchPagedPosts(queryClient, ['search', 'posts'], postId, patch)

  queryClient.setQueryData<Post>(['posts', 'detail', postId], old =>
    old ? { ...old, ...patch } : old,
  )
}

export const useToggleLike = (postId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (isCurrentlyLiked: boolean) =>
      isCurrentlyLiked ? unlikePostRequest(postId) : likePostRequest(postId),
    onMutate: isCurrentlyLiked => {
      const detail = queryClient.getQueryData<Post>(['posts', 'detail', postId])
      const prevLikes = detail?.likes ?? 0
      patchPostInCaches(queryClient, postId, {
        isLiked: !isCurrentlyLiked,
        likes: prevLikes + (isCurrentlyLiked ? -1 : 1),
      })
    },
    onSuccess: data => {
      patchPostInCaches(queryClient, postId, data)
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
    },
    onError: (_err, isCurrentlyLiked) => {
      const detail = queryClient.getQueryData<Post>(['posts', 'detail', postId])
      const prevLikes = detail?.likes ?? 0
      patchPostInCaches(queryClient, postId, {
        isLiked: isCurrentlyLiked,
        likes: prevLikes + (isCurrentlyLiked ? 1 : -1),
      })
    },
  })
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (post: CreatePost) => createPostRequest(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

const removePostFromPagedCaches = (queryClient: QueryClient, postId: number) => {
  const stripFromPage = (page: PostsPage): PostsPage => ({
    ...page,
    items: page.items.filter(p => p.id !== postId),
  })
  const stripFromInfinite = (key: readonly unknown[]) => {
    queryClient.setQueriesData<InfinitePostsData>({ queryKey: key }, old =>
      old ? { ...old, pages: old.pages.map(stripFromPage) } : old,
    )
  }
  stripFromInfinite(['posts', 'list'])
  stripFromInfinite(['posts', 'feed'])
  stripFromInfinite(['posts', 'user'])
  stripFromInfinite(['search', 'posts'])
  queryClient.removeQueries({ queryKey: ['posts', 'detail', postId] })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: number) => deletePostRequest(postId),
    onSuccess: (_data, postId) => {
      removePostFromPagedCaches(queryClient, postId)
    },
  })
}
