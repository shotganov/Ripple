import { Box, ButtonBase } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import { Avatar, UnstyledLink, UserInline } from '@shared/ui'
import { resolveAssetUrl } from '@shared/config'
import { breakpoints, colors, radius } from '@shared/styles'
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

const getNotificationLink = (notification: Notification): string => {
  if (notification.type === 'FOLLOW') return routes.profile(notification.actor.id)
  if (notification.type === 'COMMENT' && notification.comment && notification.post) {
    return `${routes.post(notification.post.id)}#comment-${notification.comment.id}`
  }
  if (notification.post) return routes.post(notification.post.id)
  return routes.feed
}

export const NotificationItem = ({ notification }: Props) => {
  const images = notification.post?.images ?? []
  const navigate = useNavigate()

  return (
    <ButtonBase
      onClick={() => navigate(getNotificationLink(notification))}
      sx={[rootSx, !notification.isRead && unreadSx]}
    >
      <UnstyledLink
        to={routes.profile(notification.actor.id)}
        sx={{ display: 'flex', alignItems: 'flex-start', alignSelf: 'flex-start' }}
        onClick={e => e.stopPropagation()}
      >
        <Avatar src={resolveAssetUrl(notification.actor.avatar)} size={48} />
      </UnstyledLink>
      <Box sx={contentSx}>
        <UserInline
          username={notification.actor.username}
          tag={notification.actor.tag}
          to={routes.profile(notification.actor.id)}
          onClick={e => e.stopPropagation()}
        />

        <Box>
          <Box sx={textSx}>{kindText[notification.type]}</Box>
          {notification.post?.content && notification.type === 'LIKE' && (
            <Box sx={postPreviewSx}>{notification.post.content}</Box>
          )}

          {images.length > 0 && notification.type === 'LIKE' && (
            <Box sx={imageRowSx}>
              {images.map((src, i) => (
                <Box key={i} component="img" src={resolveAssetUrl(src)} alt="" sx={imageSx} />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </ButtonBase>
  )
}

const rootSx: SystemStyleObject<Theme> = {
  display: 'flex',
  width: '100%',
  alignItems: 'flex-start',
  textAlign: 'left',
  gap: 1.5,
  py: 1.5,
  px: 2,
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
  gap: 1,
  minWidth: 0,
  flex: 1,
}

const textSx: SystemStyleObject<Theme> = {
  fontSize: 15,
  lineHeight: 1.3,
  color: colors.black,
}

const postPreviewSx: SystemStyleObject<Theme> = {
  mt: 0.5,
  fontSize: 13,
  lineHeight: 1.3,
  color: colors.textMuted,
  whiteSpace: 'pre-wrap',
}


const imageRowSx: SystemStyleObject<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 0.75,
  mt: 0.5,
}

const imageSx: SystemStyleObject<Theme> = {
  width: 100,
  height: 100,
  objectFit: 'cover',
  borderRadius: radius.sm,
  display: 'block',
}
