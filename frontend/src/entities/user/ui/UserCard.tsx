import { Box, ButtonBase } from '@mui/material'
import { colors } from '@shared/styles'
import { Avatar } from '@shared/ui'
import type { User } from '@shared/model'
import { NavLink } from 'react-router-dom'
import SocialIcon from '@shared/assets/icons/icon-social2.svg'
import { routes } from '@shared/config/routes'

type Props = {
  user: User
  sizeAvatar?: number
  px?: number
  py?: number
  isBorder?: boolean
}

export const UserCard = ({ user, px = 0, py = 1, isBorder = false, sizeAvatar = 40 }: Props) => {
  return (
    <ButtonBase
      key={user.id}
      component={NavLink}
      to={routes.profile(user.id)}
      sx={{
        width: '100%',
        py: py,
        px: px,
        borderRadius: 0,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: 1.5,
        minWidth: 0,
        border: isBorder ? `1px solid ${colors.border}` : 'none',
        backgroundColor: '#ffffff',
        transition: 'background-color 180ms ease',
        '&:hover': {
          backgroundColor: colors.hoverBg,
        },
      }}
    >
      <Avatar src={user.avatar ? user.avatar : SocialIcon} size={sizeAvatar} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          minWidth: 0,
          py: 0.25,
        }}
      >
        <Box
          sx={{
            maxWidth: 220,
            fontSize: 15,
            fontWeight: 500,
            color: colors.text,
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {user.username}
        </Box>

        <Box
          sx={{
            maxWidth: 220,
            fontSize: 15,
            lineHeight: 1.35,
            color: colors.textMuted,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          @{user.tag}
        </Box>
      </Box>
    </ButtonBase>
  )
}
