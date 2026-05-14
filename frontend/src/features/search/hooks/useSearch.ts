import { useInfiniteQuery } from '@tanstack/react-query'
import {
  searchRequestPosts,
  searchRequestUsers,
  type PostsSearchPage,
  type UsersSearchPage,
} from '../api/searchApi'

const PAGE_SIZE = 20

export const useSearchUsers = (query: string) => {
  const trimmed = query.trim()
  return useInfiniteQuery({
    queryKey: ['search', 'users', trimmed] as const,
    queryFn: ({ pageParam }) =>
      searchRequestUsers(trimmed, pageParam ?? undefined, PAGE_SIZE),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage: UsersSearchPage) => lastPage.nextCursor,
    enabled: trimmed.length > 0,
  })
}

export const useSearchPosts = (query: string) => {
  const trimmed = query.trim()
  return useInfiniteQuery({
    queryKey: ['search', 'posts', trimmed] as const,
    queryFn: ({ pageParam }) =>
      searchRequestPosts(trimmed, pageParam ?? undefined, PAGE_SIZE),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage: PostsSearchPage) => lastPage.nextCursor,
    enabled: trimmed.length > 0,
  })
}
