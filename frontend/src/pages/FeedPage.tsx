import { useState } from 'react'
import { Box } from '@mui/material'
import { CreatePost, useAllPosts, useFeedPosts } from '@features/posts'
import { PostsList } from '@widgets/posts'
import { FeedHeader, type FeedMode } from '@widgets/feed'
import { PostSkeletonList } from '@entities/post'
import { useAppSelector } from '@shared/hooks'
import { selectUser } from '@entities/user'
import { colors } from '@shared/styles'
import type { SystemStyleObject, Theme } from '@mui/system'
import { StickyTopBar } from '@shared/ui'

const feedTabs = [
  { label: 'Обзор', value: 'forYou' as const },
  { label: 'Подписки', value: 'following' as const },
]

export const FeedPage = () => {
  const currentUser = useAppSelector(selectUser)
  const [feedMode, setFeedMode] = useState<FeedMode>('forYou')
  const allPosts = useAllPosts()
  const feedPosts = useFeedPosts()
  const active = feedMode === 'forYou' ? allPosts : feedPosts

  const posts = active.data?.pages.flatMap(page => page.items) ?? []

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {currentUser?.role !== 'ADMIN' ? (
        <>
          <FeedHeader tabs={feedTabs} activeMode={feedMode} onModeChange={setFeedMode} />
          <CreatePost />
        </>
      ) : (
        <StickyTopBar>
          <Box sx={tabLabelSx}>Лента</Box>
        </StickyTopBar>
      )}
      {active.isLoading && <PostSkeletonList />}
      {active.data && (
        <PostsList
          posts={posts}
          hasNextPage={active.hasNextPage}
          isFetchingNextPage={active.isFetchingNextPage}
          onLoadMore={() => active.fetchNextPage()}
        />
      )}
      {active.isFetchingNextPage && <PostSkeletonList count={2} />}
      <Box sx={{ flex: 1, minHeight: '50vh' }} />
    </Box>
  )
}

const tabLabelSx: SystemStyleObject<Theme> = {
  width: '100%',
  height: 50,
  fontSize: 17,
  fontWeight: 500,
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderBottom: `1px solid ${colors.border}`,
}
