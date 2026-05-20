import { Box } from '@mui/material'
import { colors } from '@shared/styles'
import { UnstyledLink } from './UnstyledLink'

import type { MouseEvent } from 'react'

type Props = {
  to: string
  username: string
  tag: string
  onClick?: (e: MouseEvent) => void
}

export const UserInline = ({ to, username, tag, onClick }: Props) => (
  <UnstyledLink
    to={to}
    onClick={onClick}
    sx={{
      gap: 0.5,
      fontSize: 15,
      alignSelf: 'flex-start',
      minWidth: 0,
      overflow: 'hidden',
    }}
  >
    <Box
      sx={{
        fontWeight: 500,
        display: 'inline-block',

        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: '100%',
        textDecoration: 'none',
        '&:hover': { textDecoration: 'underline' },
      }}
    >
      {username}
    </Box>
    <Box
      sx={{
        color: colors.textMuted,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      @{tag}
    </Box>
  </UnstyledLink>
)
