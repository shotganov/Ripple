import { Box, ButtonBase } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { useState } from 'react'
import MessageIcon from '@shared/assets/icons/icon-message.svg?react'
import TrashIcon from '@shared/assets/icons/icon-trash.svg?react'
import ProfileIcon from '@shared/assets/icons/icon-profile.svg?react'
import { colors, transitions } from '@shared/styles'
import { resolveAssetUrl } from '@shared/config'
import { plural } from '@shared/lib'
import { useFollowStatus, useToggleFollow } from '@features/follows'
import { useNavigate } from 'react-router-dom'
import { routes } from '@shared/config/routes'
import type { User } from '@shared/model'
import { useSetUserRole, useDeleteAdminUser } from '@features/reports'
import { DropdownMenu, DropdownMenuItem } from '@shared/ui'

type Props = {
  user: User
  isOwnProfile: boolean
  isAdmin?: boolean
  onEditClick: () => void
}

export const Profile = ({ user, isOwnProfile, isAdmin, onEditClick }: Props) => {
  const followStatus = useFollowStatus(user.id, !isOwnProfile)
  const toggleFollow = useToggleFollow(user.id)
  const navigate = useNavigate()
  const setRole = useSetUserRole()
  const deleteUser = useDeleteAdminUser()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const isFollowing = followStatus.data?.isFollowing ?? false
  const followLabel = isFollowing ? 'Отписаться' : 'Подписаться'

  const handleToggleFollow = () => {
    if (toggleFollow.isPending) return
    toggleFollow.mutate(isFollowing)
  }

  return (
    <Box
      sx={{
        borderRight: `1px solid ${colors.border}`,
        borderLeft: `1px solid ${colors.border}`,
      }}
    >
      <Box
        sx={{
          ...coverSx,
          ...(user.coverImage && { backgroundImage: `url(${resolveAssetUrl(user.coverImage)})` }),
        }}
      />

      <Box sx={cardSx}>
        <Box component="img" src={resolveAssetUrl(user.avatar)} sx={avatarSx} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, flexWrap: 'wrap' }}>
          {isOwnProfile ? (
            <ButtonBase
              onClick={onEditClick}
              sx={{
                ...actionButtonSx,
                color: colors.accent,
                borderColor: colors.accent,
              }}
            >
              Редактировать
            </ButtonBase>
          ) : (
            <>
              {isAdmin && !isOwnProfile && (
                <DropdownMenu triggerSx={menuTriggerSx} slotSx={{ width: 36, height: 36 }}>
                  {close => (
                    <>
                      <DropdownMenuItem
                        icon={ProfileIcon}
                        onClick={() => {
                          setRole.mutate({
                            id: user.id,
                            role: user.role === 'ADMIN' ? 'USER' : 'ADMIN',
                          })
                          close()
                        }}
                      >
                        {user.role === 'ADMIN' ? 'Разжаловать' : 'Сделать админом'}
                      </DropdownMenuItem>
                      {confirmDelete ? (
                        <DropdownMenuItem
                          icon={TrashIcon}
                          danger
                          onClick={() =>
                            deleteUser.mutate(user.id, { onSuccess: () => navigate(routes.feed) })
                          }
                        >
                          Подтвердить удаление
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          icon={TrashIcon}
                          danger
                          onClick={() => setConfirmDelete(true)}
                        >
                          Удалить аккаунт
                        </DropdownMenuItem>
                      )}
                    </>
                  )}
                </DropdownMenu>
              )}

              {!isAdmin && (
                <>
                  <ButtonBase
                    sx={messageButtonSx}
                    onClick={() => navigate(routes.chatWith(user.id))}
                  >
                    <Box component={MessageIcon} sx={{ width: 20, height: 20 }} />
                  </ButtonBase>
                  <ButtonBase
                    onClick={handleToggleFollow}
                    disabled={toggleFollow.isPending || followStatus.isLoading}
                    sx={isFollowing ? actionButtonSx : primaryActionButtonSx}
                  >
                    {followLabel}
                  </ButtonBase>
                </>
              )}
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ fontSize: 22, fontWeight: '700' }}>{user.username}</Box>
          <Box sx={{ fontSize: 15, color: colors.textMuted }}>@{user.tag}</Box>
        </Box>

        {user.bio && <Box sx={{ fontSize: 15 }}>{user.bio}</Box>}

        <Box sx={{ display: 'flex', gap: 2, fontSize: 14 }}>
          <Box>
            <Box component="span" sx={{ fontWeight: '700' }}>
              {user.followersCount}{' '}
            </Box>
            <Box component="span" sx={{ color: colors.textMuted }}>
              {plural(user.followersCount ?? 0, {
                one: 'подписчик',
                few: 'подписчика',
                many: 'подписчиков',
              })}
            </Box>
          </Box>
          <Box>
            <Box component="span" sx={{ fontWeight: '700' }}>
              {user.followingCount}{' '}
            </Box>
            <Box component="span" sx={{ color: colors.textMuted }}>
              {plural(user.followingCount ?? 0, {
                one: 'подписка',
                few: 'подписки',
                many: 'подписок',
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const coverSx: SystemStyleObject<Theme> = {
  width: '100%',
  height: 200,
  backgroundColor: colors.skyMist,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  borderBottom: 0,
  borderRadius: 0,
}

const cardSx: SystemStyleObject<Theme> = {
  position: 'relative',
  p: 2,
  pt: 3,
  backgroundColor: colors.surface,
  display: 'flex',
  flexDirection: 'column',
  gap: 1.25,
  borderBottom: `1px solid ${colors.border}`,
  borderRadius: 0,
}

const avatarSx: SystemStyleObject<Theme> = {
  display: 'block',
  position: 'absolute',
  transform: 'translateY(-70%)',
  border: `1px solid ${colors.border}`,
  borderRadius: '50%',
  width: 128,
  height: 128,
  objectFit: 'cover',
}

const messageButtonSx: SystemStyleObject<Theme> = {
  width: 36,
  height: 36,
  borderRadius: '50%',
  border: `1px solid ${colors.inputBorder}`,
  backgroundColor: colors.surface,
  color: colors.black,
  transition: transitions.background,
  '&:hover': {
    backgroundColor: colors.inputBg,
  },
}

const actionButtonSx: SystemStyleObject<Theme> = {
  height: 36,
  px: 2,
  fontSize: 15,
  fontWeight: 500,
  border: `1px solid ${colors.inputBorder}`,
  backgroundColor: colors.surface,
  borderRadius: 4,
  color: colors.black,
  transition: transitions.background,
  '&:hover': {
    backgroundColor: colors.inputBg,
  },
}

const menuTriggerSx: SystemStyleObject<Theme> = {
  position: 'static',
  transform: 'none',
  width: 36,
  height: 36,
  borderRadius: '50%',
  border: `1px solid ${colors.inputBorder}`,
  backgroundColor: colors.surface,
  color: colors.black,
  '&:hover': {
    backgroundColor: colors.inputBg,
  },
}

const primaryActionButtonSx: SystemStyleObject<Theme> = {
  height: 36,
  px: 2,
  fontSize: 14,
  fontWeight: 500,
  border: `1px solid ${colors.accent}`,
  backgroundColor: colors.accent,
  borderRadius: 4,
  color: colors.surface,
  transition: transitions.backgroundAndOpacity,
  '&:hover': {
    opacity: 0.9,
  },
}
