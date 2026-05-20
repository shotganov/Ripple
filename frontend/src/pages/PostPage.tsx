import { useState, useEffect } from 'react'
import { Box, ButtonBase } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { PostActions, PostMenu, usePost } from '@features/posts'
import { ReportContentModal, type ReportTarget } from '@features/reports'
import BackIcon from '@shared/assets/icons/icon-back.svg?react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { breakpoints, colors, transitions } from '@shared/styles'
import { routes } from '@shared/config/routes'
import { CommentForm } from '@features/comments'
import { CommentSkeletonList, CommentsList } from '@entities/comment'
import { PostComponent, PostSkeleton } from '@entities/post'
import { CommentMenu, useComments } from '@features/comments'
import { EmptyState, StickyTopBar } from '@shared/ui'
import { useAppSelector } from '@shared/hooks'
import { selectUser } from '@entities/user'

export const PostPage = () => {
  const [reportTarget, setReportTarget] = useState<ReportTarget | null>(null)
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const postId = Number(id)
  const post = usePost(postId)
  const comments = useComments(postId)
  const currentUser = useAppSelector(selectUser)
  const commentItems = comments.data?.pages.flatMap(page => page.items) ?? []
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash || !hash.startsWith('#comment-')) {
      window.scrollTo(0, 0)
      return
    }
    if (comments.isLoading) return
    const el = document.querySelector(hash)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [hash, comments.isLoading])

  const handleNavigateBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(routes.feed)
    }
  }

  return (
    <Box sx={pageSx}>
      <StickyTopBar sx={{ display: 'flex', alignItems: 'center', gap: 3, px: 2, py: 0.5 }}>
        <ButtonBase onClick={handleNavigateBack} sx={backButtonSx}>
          <Box component={BackIcon} sx={backIconSx} />
        </ButtonBase>
        <Box sx={{ fontSize: 20, fontWeight: 700 }}>Пост</Box>
      </StickyTopBar>

      <Box sx={postBlockSx}>
        {post.isLoading && <PostSkeleton bordered />}

        {post.data && (
          <PostComponent
            post={post.data}
            menu={
              <PostMenu
                postId={postId}
                isOwnPost={post.data?.user.id === currentUser?.id || currentUser?.role === 'ADMIN'}
                onReport={() => setReportTarget({ type: 'post', id: postId })}
                onDeleted={handleNavigateBack}
              />
            }
            actions={
              <PostActions
                postId={postId}
                likes={post.data.likes}
                comments={post.data.comments}
                isLiked={post.data.isLiked}
              />
            }
          />
        )}

        {reportTarget && (
          <ReportContentModal target={reportTarget} onClose={() => setReportTarget(null)} />
        )}
      </Box>

      <CommentForm postId={postId} />

      {comments.isLoading && <CommentSkeletonList />}

      {comments.data && commentItems.length === 0 && (
        <EmptyState title="Тишина..." hint="Самое время оставить первый комментарий" />
      )}

      {comments.data && commentItems.length > 0 && (
        <CommentsList
          comments={commentItems}
          hasNextPage={comments.hasNextPage}
          isFetchingNextPage={comments.isFetchingNextPage}
          onLoadMore={() => comments.fetchNextPage()}
          renderMenu={c => (
            <CommentMenu
              postId={postId}
              commentId={c.id}
              isOwnComment={c.user.id === currentUser?.id}
              isAdmin={currentUser?.role === 'ADMIN'}
              onReport={() => setReportTarget({ type: 'comment', id: c.id })}
            />
          )}
        />
      )}

      {comments.isFetchingNextPage && <CommentSkeletonList count={2} />}

      {comments.data && <Box sx={{ flex: 1, minHeight: '50vh' }} />}
    </Box>
  )
}

const pageSx: SystemStyleObject<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  position: 'relative',
  borderRadius: 4,
  [breakpoints.mobile]: {
    mt: 0,
    borderRadius: 0,
  },
}

const postBlockSx: SystemStyleObject<Theme> = {
  borderLeft: `1px solid ${colors.border}`,
  borderRight: `1px solid ${colors.border}`,
}

const backButtonSx: SystemStyleObject<Theme> = {
  width: 36,
  height: 36,
  borderRadius: '50%',
  color: colors.text,
  transition: transitions.background,
  '&:hover': {
    backgroundColor: colors.hoverBg,
  },
}

const backIconSx: SystemStyleObject<Theme> = {
  width: 22,
  height: 22,
  color: 'inherit',
  objectFit: 'cover',
}
