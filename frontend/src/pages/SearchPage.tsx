import { useState } from 'react'
import { Box } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { SearchControls, useSearchPosts, useSearchUsers, type SearchMode } from '@features/search'
import { EmptyResults, UsersResults } from '@widgets/search'
import { PostsList } from '@widgets/posts'
import { PostSkeletonList } from '@entities/post'
import { EmptyState, StickyTopBar } from '@shared/ui'
import { colors } from '@shared/styles'
import { useDebouncedValue } from '@shared/lib'

export const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [mode, setMode] = useState<SearchMode>('posts')
  const debouncedQuery = useDebouncedValue(query)

  const usersQuery = useSearchUsers(mode === 'users' ? debouncedQuery : '')
  const postsQuery = useSearchPosts(mode === 'posts' ? debouncedQuery : '')

  const users = usersQuery.data?.pages.flatMap(p => p.items) ?? []
  const posts = postsQuery.data?.pages.flatMap(p => p.items) ?? []

  const active = mode === 'users' ? usersQuery : postsQuery
  const items = mode === 'users' ? users : posts
  const isEmpty = !!active.data && items.length === 0

  return (
    <Box sx={rootSx}>
      <StickyTopBar sx={{ display: 'flex', alignItems: 'center', px: 2.5, py: 1.5 }}>
        <Box sx={{ fontSize: 20, fontWeight: 700 }}>Поиск</Box>
      </StickyTopBar>

      <Box sx={{ px: 1.5, pb: 1.5, border: `1px solid ${colors.border}`, borderTop: 0 }}>
        <SearchControls query={query} onQueryChange={setQuery} mode={mode} onModeChange={setMode} />
      </Box>

      {query.trim().length === 0 && !isEmpty && !active.data && (
        <EmptyState title="Что вам интересно?" hint="Введите имя пользователя или текст поста" />
      )}

      {active.isError ? (
        <EmptyState title="Не удалось загрузить результаты" hint="Попробуй ещё раз позже" />
      ) : active.isLoading ? (
        <PostSkeletonList count={4} />
      ) : isEmpty ? (
        <EmptyResults />
      ) : mode === 'users' && usersQuery.data ? (
        <UsersResults
          users={users}
          hasNextPage={usersQuery.hasNextPage}
          isFetchingNextPage={usersQuery.isFetchingNextPage}
          onLoadMore={() => usersQuery.fetchNextPage()}
        />
      ) : mode === 'posts' && postsQuery.data ? (
        <PostsList
          posts={posts}
          hasNextPage={postsQuery.hasNextPage}
          isFetchingNextPage={postsQuery.isFetchingNextPage}
          onLoadMore={() => postsQuery.fetchNextPage()}
        />
      ) : null}

      {active.isFetchingNextPage && <PostSkeletonList count={2} />}

      <Box sx={{ flex: 1, minHeight: '50vh' }} />
    </Box>
  )
}

const rootSx = {
  display: 'flex',
  flexDirection: 'column',
}
