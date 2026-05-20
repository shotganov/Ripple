import { colors } from '@shared/styles'
import { resolveAssetUrl } from '@shared/config'
import { formatRelativeTime } from '@shared/lib'
import type { Comment } from '../model/types'
import { Box } from '@mui/material'
import { Avatar, UnstyledLink, UserInline } from '@shared/ui'
import { routes } from '@shared/config/routes'
import type { ReactNode } from 'react'

type Props = {
  comment: Comment
  menu?: ReactNode
}

export const CommentItem = ({ comment, menu }: Props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        py: 2,
        px: 1.5,
        borderRadius: 0,
        borderBottom: `1px solid ${colors.border}`,
        backgroundColor: colors.surface,
      }}
    >
      <UnstyledLink to={routes.profile(comment.user.id)}>
        <Avatar src={resolveAssetUrl(comment.user.avatar)} size={48} />
      </UnstyledLink>

      <Box
        sx={{
          minWidth: 0,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
            <UserInline
              to={routes.profile(comment.user.id)}
              username={comment.user.username}
              tag={comment.user.tag}
            />
            {comment.createdAt && (
              <>
                <Box
                  component="span"
                  sx={{ fontSize: 14, color: colors.textMuted, flexShrink: 0, px: 0.5 }}
                >
                  ·
                </Box>
                <Box component="span" sx={{ fontSize: 14, color: colors.textMuted, flexShrink: 0 }}>
                  {formatRelativeTime(comment.createdAt)}
                </Box>
              </>
            )}
          </Box>
          {menu}
        </Box>
        <Box
          sx={{
            fontSize: 15,
            lineHeight: 1.3,
            color: colors.black,
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {comment.content}
        </Box>
      </Box>
    </Box>
  )
}
