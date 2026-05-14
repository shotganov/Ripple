import { Box } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { Avatar, UserInline } from '@shared/ui'
import { resolveAssetUrl } from '@shared/config'
import { breakpoints, colors } from '@shared/styles'
import { routes } from '@shared/config/routes'
import type { Notification } from '../model/types'

type Props = {
  notification: Notification
}

const kindText: Record<Notification['type'], string> = {
  LIKE: 'поставил лайк на ваш пост',
  COMMENT: 'оставил комментарий под вашим постом',
  FOLLOW: 'подписался на вас',
}

export const NotificationItem = ({ notification }: Props) => {
  return (
    <Box sx={[rootSx, !notification.isRead && unreadSx]}>
      <Avatar src={resolveAssetUrl(notification.actor.avatar)} size={44} />

      <Box sx={contentSx}>
        <UserInline
          username={notification.actor.username}
          tag={notification.actor.tag}
          to={routes.profile(notification.actor.id)}
        />

        <Box sx={textSx}>{kindText[notification.type]}</Box>

        {notification.post && <Box sx={postPreviewSx}>{notification.post.content}</Box>}

        {notification.comment && <Box sx={commentPreviewSx}>{notification.comment.content}</Box>}
      </Box>
    </Box>
  )
}

const rootSx: SystemStyleObject<Theme> = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 2,
  p: 2,
  backgroundColor: colors.surface,
  borderBottom: `1px solid ${colors.border}`,
  transition: 'background-color 220ms ease',
  [breakpoints.mobile]: {
    p: 1.5,
  },
}

const unreadSx: SystemStyleObject<Theme> = {
  backgroundColor: colors.inputBg,
}

const contentSx: SystemStyleObject<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.5,
  minWidth: 0,
  flex: 1,
}

const textSx: SystemStyleObject<Theme> = {
  fontSize: 15,
  lineHeight: 1.4,
  color: colors.textSoft,
}

const postPreviewSx: SystemStyleObject<Theme> = {
  mt: 0.5,
  fontSize: 14,
  color: colors.textMuted,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}

const commentPreviewSx: SystemStyleObject<Theme> = {
  mt: 0.5,
  fontSize: 14,
  color: colors.text,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}
