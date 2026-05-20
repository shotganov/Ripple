import { memo } from 'react'
import { Box } from '@mui/material'
import { colors } from '@shared/styles'

type Props = {
  message: string
  isMine: boolean
}

export const MessageItem = memo(({ message, isMine }: Props) => {
  return (
    <Box
      sx={{ width: '100%', display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}
    >
      <Box
        sx={{
          width: 'fit-content',
          py: 1,
          px: 1.25,
          backgroundColor: isMine ? colors.accent : '#64748b',
          maxWidth: '400px',
          borderRadius: 3,
          color: 'white',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          fontSize: 15,
        }}
      >
        {message}
      </Box>
    </Box>
  )
})
