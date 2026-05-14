import { colors } from '@shared/styles'
import { resolveAssetUrl } from '@shared/config'
import type { Comment } from '../model/types'
import { Box } from '@mui/material'
import { Avatar, UserInline } from '@shared/ui'
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
        alignItems: 'flex-start',
        gap: 2,
        p: 2,
        px: 1.5,
        borderRadius: 0,
        borderBottom: `1px solid ${colors.border}`,
        backgroundColor: colors.surface,
      }}
    >
      <Avatar src={resolveAssetUrl(comment.user.avatar)} size={48} />

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <UserInline
            to={routes.profile(comment.user.id)}
            username={comment.user.username}
            tag={comment.user.tag}
          />
          {menu}
        </Box>
        <Box
          sx={{
            mt: 0.5,
            fontSize: 15,
            lineHeight: 1.45,
            color: colors.textSoft,
          }}
        >
          {comment.content}
        </Box>
      </Box>
    </Box>
  )
}
