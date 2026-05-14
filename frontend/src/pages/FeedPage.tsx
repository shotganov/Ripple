import { useState } from 'react'
import { Box } from '@mui/material'
import { CreatePost, useAllPosts, useFeedPosts } from '@features/posts'
import { PostsList } from '@widgets/posts'
import { FeedHeader, type FeedMode } from '@widgets/feed'
import { PostSkeletonList } from '@entities/post'

const feedTabs = [
  { label: 'Обзор', value: 'forYou' as const },
  { label: 'Подписки', value: 'following' as const },
]

export const FeedPage = () => {
  const [feedMode, setFeedMode] = useState<FeedMode>('forYou')
  const allPosts = useAllPosts()
  const feedPosts = useFeedPosts()
  const active = feedMode === 'forYou' ? allPosts : feedPosts

  const posts = active.data?.pages.flatMap(page => page.items) ?? []

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <FeedHeader tabs={feedTabs} activeMode={feedMode} onModeChange={setFeedMode} />
      <CreatePost />
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
