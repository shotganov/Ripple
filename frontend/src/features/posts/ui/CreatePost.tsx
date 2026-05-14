import { Box, InputBase, Paper } from '@mui/material'
import { useState } from 'react'
import { colors, radius } from '@shared/styles'
import { CreatePostModal } from './CreatePostModal'
import { selectUser } from '@entities/user'
import { useAppSelector } from '@shared/hooks'
import { Avatar } from '@shared/ui'
import { resolveAssetUrl } from '@shared/config'

export const CreatePost = () => {
  const user = useAppSelector(selectUser)
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false)

  if (!user) return null

  return (
    <Box
      sx={{
        background: colors.surface,
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${colors.border}`,
        borderTop: '0px',
        py: 2,
        px: 1.5,
        borderRadius: 0,
        gap: 1,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, width: '100%', alignItems: 'center' }}>
        <Avatar src={resolveAssetUrl(user.avatar)} size={48} />

        <Paper
          elevation={0}
          sx={{
            px: 1.75,
            py: 1,
            width: '100%',
            borderRadius: radius.md,
            border: `1px solid ${colors.inputBorder}`,
            backgroundColor: colors.inputBg,
          }}
        >
          <InputBase
            placeholder={'Написать пост...'}
            onFocus={() => setIsCreatePostModalOpen(true)}
            sx={{ width: '100%' }}
          />
        </Paper>
      </Box>

      {isCreatePostModalOpen && <CreatePostModal setIsOpen={setIsCreatePostModalOpen} />}
    </Box>
  )
}
