import { Box, ButtonBase } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { UserCard, selectUser } from '@entities/user'
import { useAppSelector } from '@shared/hooks'
import { colors, transitions } from '@shared/styles'
import type { User } from '@shared/model'
import { useFollowStatus, useToggleFollow } from '../hooks/useFollow'

type Props = {
  user: User
  sizeAvatar?: number
}

export const UserFollowRow = ({ user, sizeAvatar = 40 }: Props) => {
  const me = useAppSelector(selectUser)
  const isOwn = me?.id === user.id
  const followStatus = useFollowStatus(user.id, !isOwn)
  const toggleFollow = useToggleFollow(user.id)

  const isFollowing = followStatus.data?.isFollowing ?? false

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (toggleFollow.isPending) return
    toggleFollow.mutate(isFollowing)
  }

  return (
    <Box sx={rowSx}>
      <UserCard user={user} px={1.5} py={1.5} sizeAvatar={sizeAvatar} />

      {!isOwn && (
        <ButtonBase
          onClick={handleClick}
          disabled={toggleFollow.isPending || followStatus.isLoading}
          sx={isFollowing ? followingButtonSx : followButtonSx}
        >
          {isFollowing ? 'Отписаться' : 'Подписаться'}
        </ButtonBase>
      )}
    </Box>
  )
}

const rowSx: SystemStyleObject<Theme> = {
  position: 'relative',
}

const followButtonSx: SystemStyleObject<Theme> = {
  position: 'absolute',
  right: 12,
  top: '50%',
  transform: 'translateY(-50%)',
  flexShrink: 0,
  height: 34,
  px: 1.5,
  borderRadius: 999,
  backgroundColor: colors.accent,
  color: colors.surface,
  border: `1px solid ${colors.accent}`,
  fontSize: 14,
  fontWeight: 700,
  transition: transitions.backgroundAndOpacity,
  '&:hover': { opacity: 0.9 },
}

const followingButtonSx: SystemStyleObject<Theme> = {
  ...followButtonSx,
  backgroundColor: colors.surface,
  color: colors.accent,
  '&:hover': {
    backgroundColor: colors.hoverBg,
    opacity: 1,
  },
}
