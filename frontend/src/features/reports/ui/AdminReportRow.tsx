import { Box, ButtonBase, Chip } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { colors, radius, transitions } from '@shared/styles'
import { routes } from '@shared/config/routes'
import { useDeletePost } from '@features/posts'
import { useDeleteComment } from '@features/comments'
import { PostComponent } from '@entities/post'
import { CommentItem } from '@entities/comment'
import { reportReasonLabels, type ReportGroup } from '../model/types'
import { removeGroupFromCache, useDismissByTarget } from '../hooks/useReports'

type Props = {
  group: ReportGroup
  readonly?: boolean
  isLast?: boolean
}

export const AdminReportRow = ({ group, readonly = false, isLast = false }: Props) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const dismiss = useDismissByTarget()
  const isPost = group.type === 'post'
  const target = isPost ? group.post : group.comment
  const postId = isPost ? group.targetId : (group.comment?.postId ?? 0)
  const deletePost = useDeletePost()
  const deleteComment = useDeleteComment(isPost ? 0 : (group.comment?.postId ?? 0))

  if (!target) return null

  return (
    <Box sx={[rowSx, isLast && lastRowSx]}>
      <Box sx={rowHeaderSx}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={metaSx}>
            {isPost ? 'Пост' : 'Комментарий'} — {group.reportCount}{' '}
            {group.reportCount === 1 ? 'жалоба' : group.reportCount < 5 ? 'жалобы' : 'жалоб'}
          </Box>
          <Box sx={reasonsSx}>
            {group.reasons.map(r => (
              <Chip key={r} label={reportReasonLabels[r]} size="small" sx={chipSx} />
            ))}
          </Box>
        </Box>
      </Box>

      {isPost && group.post ? (
        <ButtonBase
          onClick={e => {
            if ((e.target as HTMLElement).closest('a')) return
            navigate(routes.post(postId))
          }}
          sx={contentWrapSx}
        >
          <PostComponent
            post={{
              id: group.post.id,
              content: group.post.content,
              images: group.post.images,
              createdAt: group.post.createdAt,
              likes: group.post.likes,
              comments: group.post.comments,
              isLiked: false,
              user: group.post.user,
            }}
          />
        </ButtonBase>
      ) : !isPost && group.comment ? (
        <ButtonBase
          onClick={e => {
            if ((e.target as HTMLElement).closest('a')) return
            navigate(`${routes.post(postId)}#comment-${group.comment!.id}`)
          }}
          sx={contentWrapSx}
        >
          <CommentItem
            comment={{
              id: group.comment.id,
              content: group.comment.content,
              createdAt: group.comment.createdAt,
              user: group.comment.user,
            }}
          />
        </ButtonBase>
      ) : null}

      {!readonly && (
        <Box sx={actionsSx}>
          <ButtonBase
            onClick={() => dismiss.mutate({ type: group.type, targetId: group.targetId })}
            sx={secondaryBtnSx}
          >
            Закрыть
          </ButtonBase>

          <ButtonBase
            onClick={() => {
              const onSuccess = () => removeGroupFromCache(queryClient, group.type, group.targetId)
              if (isPost) {
                deletePost.mutate(group.targetId, { onSuccess })
              } else {
                deleteComment.mutate(group.targetId, { onSuccess })
              }
            }}
            sx={dangerBtnSx}
          >
            Удалить
          </ButtonBase>
        </Box>
      )}
    </Box>
  )
}

const rowSx: SystemStyleObject<Theme> = {
  border: `1px solid ${colors.border}`,
  borderTop: 0,
  borderRadius: 0,
  p: 1.5,
  display: 'flex',
  flexDirection: 'column',
  gap: 1.25,
}

const lastRowSx: SystemStyleObject<Theme> = {
  borderRadius: '0 0 16px 16px',
}

const rowHeaderSx: SystemStyleObject<Theme> = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 1.25,
  px: 1.5,
}

const metaSx: SystemStyleObject<Theme> = {
  fontSize: 14,
  fontWeight: 700,
  color: colors.text,
  mb: 0.5,
}

const reasonsSx: SystemStyleObject<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 0.5,
}

const chipSx: SystemStyleObject<Theme> = {
  fontSize: 12,
  height: 22,
  backgroundColor: colors.inputBg,
  color: colors.textMuted,
}

const contentWrapSx: SystemStyleObject<Theme> = {
  display: 'flex',
  width: '100%',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  textAlign: 'left',
  border: `1px solid ${colors.border}`,
  borderRadius: radius.md,
  overflow: 'hidden',
  '& > div:first-of-type': { borderBottom: 0 },
}

const actionsSx: SystemStyleObject<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 1,
  px: 1.5,
}

const baseBtnSx: SystemStyleObject<Theme> = {
  height: 36,
  px: 2,
  borderRadius: radius.pill,
  fontSize: 14,
  fontWeight: 700,
  transition: transitions.background,
}

const secondaryBtnSx: SystemStyleObject<Theme> = {
  ...baseBtnSx,
  backgroundColor: colors.inputBg,
  color: colors.text,
  '&:hover': { backgroundColor: colors.hoverBg },
}

const dangerBtnSx: SystemStyleObject<Theme> = {
  ...baseBtnSx,
  backgroundColor: colors.like,
  color: '#ffffff',
  '&:hover': { backgroundColor: colors.like, opacity: 0.9 },
}
