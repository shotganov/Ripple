import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { PostComponent, type Post } from '@entities/post'
import { PostActions, PostMenu } from '@features/posts'
import { ReportContentModal } from '@features/reports'
import { useEffect, useRef, useState } from 'react'
import { routes } from '@shared/config/routes'
import { breakpoints, colors } from '@shared/styles'
import { useAppSelector } from '@shared/hooks'
import { selectUser } from '@entities/user'

type PostsListProps = {
  posts: Post[]
  showReport?: boolean
  commentsDisabled?: boolean
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  onLoadMore?: () => void
}

export const PostsList = ({
  posts,
  showReport = true,
  commentsDisabled = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
}: PostsListProps) => {
  const navigate = useNavigate()
  const currentUser = useAppSelector(selectUser)
  const [reportPostId, setReportPostId] = useState<number | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !onLoadMore || !hasNextPage) return

    const obs = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          onLoadMore()
        }
      },
      { rootMargin: '400px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [onLoadMore, hasNextPage, isFetchingNextPage])

  if (posts.length === 0) return null

  return (
    <Box
      sx={{
        borderRadius: '0 0 16px 16px',
        border: `1px solid ${colors.border}`,
        borderTop: 0,
        overflow: 'hidden',
        '& > :last-of-type': {
          borderBottom: 0,
        },
        [breakpoints.mobile]: {
          borderRadius: 0,
        },
      }}
    >
      {posts.map(post => (
        <PostComponent
          key={post.id}
          post={post}
          menu={
            <PostMenu
              postId={post.id}
              isOwnPost={currentUser?.role === 'ADMIN' || post.user.id === currentUser?.id}
              showReport={showReport}
              onReport={() => setReportPostId(post.id)}
            />
          }
          actions={
            <PostActions
              postId={post.id}
              likes={post.likes}
              comments={post.comments}
              isLiked={post.isLiked}
              onCommentsClick={() => {
                if (!commentsDisabled) navigate(routes.post(post.id))
              }}
            />
          }
        />
      ))}

      {hasNextPage && (
        <Box ref={sentinelRef} sx={{ height: 1 }} />
      )}

      {reportPostId !== null && (
        <ReportContentModal
          target={{ type: 'post', id: reportPostId }}
          onClose={() => setReportPostId(null)}
        />
      )}
    </Box>
  )
}
