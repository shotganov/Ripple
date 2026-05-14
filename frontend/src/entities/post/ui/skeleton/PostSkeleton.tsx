import { Box } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { MediaSkeleton } from '@shared/ui'
import { colors } from '@shared/styles'
import CommentIcon from '@shared/assets/icons/icon-comment.svg?react'
import HeartIcon from '@shared/assets/icons/icon-like.svg?react'

type Props = { bordered?: boolean }

export const PostSkeleton = ({ bordered = false }: Props) => (
  <MediaSkeleton
    avatarSize={48}
    bordered={bordered}
    lines={['40%', '100%', '100%', '50%']}
    footer={
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Box component={HeartIcon} sx={iconSx} />
        <Box component={CommentIcon} sx={{ ...iconSx, height: 19 }} />
      </Box>
    }
  />
)

const iconSx: SystemStyleObject<Theme> = {
  width: 24,
  height: 18,
  flexShrink: 0,
  color: colors.textMuted,
  display: 'block',
}
