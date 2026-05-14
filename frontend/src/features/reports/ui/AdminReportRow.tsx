import { Box, ButtonBase } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Avatar, UserInline } from '@shared/ui'
import { colors, radius, transitions } from '@shared/styles'
import { routes } from '@shared/config/routes'
import { useDeletePost } from '@features/posts'
import { useDeleteComment } from '@features/comments'
import { PostComponent } from '@entities/post'
import { CommentItem } from '@entities/comment'
import { reportReasonLabels, type AdminReport } from '../model/types'
import { removeReportFromCache, useDismissReport } from '../hooks/useReports'

type Props = {
  report: AdminReport
  readonly?: boolean
  isLast?: boolean
}

const statusLabel: Record<AdminReport['status'], string> = {
  PENDING: 'Открыта',
  RESOLVED: 'Контент удалён',
  DISMISSED: 'Закрыта',
}

const statusColor: Record<AdminReport['status'], string> = {
  PENDING: colors.accent,
  RESOLVED: colors.like,
  DISMISSED: colors.textMuted,
}

export const AdminReportRow = ({ report, readonly = false, isLast = false }: Props) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const dismiss = useDismissReport()
  const deletePost = useDeletePost()
  const deleteComment = useDeleteComment(report.comment?.postId ?? 0)

  const target = report.post
    ? { kind: 'post' as const, ...report.post }
    : report.comment
      ? { kind: 'comment' as const, ...report.comment }
      : null

  if (!target) return null

  const openPostId = target.kind === 'post' ? target.id : target.postId

  return (
    <Box sx={[rowSx, isLast && lastRowSx]}>
      <Box sx={rowHeaderSx}>
        <Avatar src={report.reporter.avatar} size={48} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <UserInline
            username={report.reporter.username}
            tag={report.reporter.tag}
            to={routes.profile(report.reporter.id)}
          />
          <Box sx={metaSx}>
            пожаловался(ась) на {target.kind === 'post' ? 'пост' : 'комментарий'} —{' '}
            <b>{reportReasonLabels[report.reason]}</b>
          </Box>
        </Box>
        <Box sx={{ ...statusBadgeSx, color: statusColor[report.status] }}>
          {statusLabel[report.status]}
        </Box>
      </Box>

      {target.kind === 'post' ? (
        <Box sx={postWrapSx}>
          <PostComponent
            post={{
              id: target.id,
              content: target.content,
              images: target.images,
              createdAt: target.createdAt,
              likes: target.likes,
              comments: target.comments,
              isLiked: false,
              user: target.user,
            }}
          />
        </Box>
      ) : (
        <Box sx={commentWrapSx}>
          <CommentItem
            comment={{
              id: target.id,
              content: target.content,
              user: target.user,
            }}
          />
        </Box>
      )}

      {!readonly && (
        <Box sx={actionsSx}>
          <ButtonBase onClick={() => navigate(routes.post(openPostId))} sx={secondaryBtnSx}>
            Открыть
          </ButtonBase>
          <ButtonBase onClick={() => dismiss.mutate(report.id)} sx={secondaryBtnSx}>
            Закрыть жалобу
          </ButtonBase>
          <ButtonBase
            onClick={() => {
              const onSuccess = () => removeReportFromCache(queryClient, report.id)
              if (target.kind === 'post') {
                deletePost.mutate(target.id, { onSuccess })
              } else {
                deleteComment.mutate(target.id, { onSuccess })
              }
            }}
            sx={dangerBtnSx}
          >
            {target.kind === 'post' ? 'Удалить пост' : 'Удалить комментарий'}
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
  color: colors.textMuted,
  mt: 0.25,
}

const statusBadgeSx: SystemStyleObject<Theme> = {
  fontSize: 12,
  fontWeight: 700,
  whiteSpace: 'nowrap',
  alignSelf: 'flex-start',
}

const postWrapSx: SystemStyleObject<Theme> = {
  border: `1px solid ${colors.border}`,
  borderRadius: radius.md,
  overflow: 'hidden',
  '& > div:first-of-type': { borderBottom: 0 },
}

const commentWrapSx: SystemStyleObject<Theme> = {
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
