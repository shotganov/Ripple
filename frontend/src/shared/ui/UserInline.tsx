import { Box } from '@mui/material'
import { colors } from '@shared/styles'
import { UnstyledLink } from './UnstyledLink'

type Props = {
  to: string
  username: string
  tag: string
}

export const UserInline = ({ to, username, tag }: Props) => (
  <UnstyledLink
    to={to}
    sx={{
      gap: 1,
      fontSize: 15,
      lineHeight: 1.2,
      alignSelf: 'flex-start',
      width: 'fit-content',
    }}
  >
    <Box
      sx={{
        fontWeight: 500,
        display: 'inline-block',
        lineHeight: 0.8,
        borderBottom: '1px solid transparent',
        '&:hover': { borderBottomColor: 'currentColor' },
      }}
    >
      {username}
    </Box>
    <Box sx={{ color: colors.textMuted }}>@{tag}</Box>
  </UnstyledLink>
)
