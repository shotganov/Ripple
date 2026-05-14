import { Box, ButtonBase, ClickAwayListener } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import MoreIcon from '@shared/assets/icons/icon-more.svg?react'
import { resolveAssetUrl } from '@shared/config'
import type { User } from '@shared/model'
import { breakpoints, colors, radius, transitions, zIndex } from '@shared/styles'
import { Avatar } from '@shared/ui'

type SideBarProfileProps = {
  isOpen: boolean
  onLogout: () => void
  onToggle: () => void
  user: User
}

export const SideBarProfile = ({ isOpen, onLogout, onToggle, user }: SideBarProfileProps) => {
  const userTag = user.tag || 'fsdfd'

  const handleClickAway = () => {
    if (isOpen) onToggle()
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        [breakpoints.compactSidebar]: {
          display: 'flex',
          justifyContent: 'center',
        },
        [breakpoints.mobile]: { display: 'none' },
      }}
    >
      {isOpen && (
        <Box sx={menuSx}>
          <ButtonBase onClick={onLogout} sx={logoutButtonSx}>
            Выйти @{userTag}
          </ButtonBase>
        </Box>
      )}

      <ButtonBase onClick={onToggle} sx={profileButtonSx}>
        <Box sx={profileInfoSx}>
          <Avatar src={resolveAssetUrl(user.avatar)} size={44} />

          <Box sx={sxAdaptive}>
            <Box sx={{ lineHeight: 1.2, fontSize: 15, fontWeight: 500 }}>{user.username}</Box>
            <Box sx={{ fontSize: 15, color: colors.textMuted }}>@{userTag}</Box>
          </Box>
        </Box>
        <Box sx={moreIconSx}>
          <MoreIcon width={14} />
        </Box>
      </ButtonBase>
    </Box>
    </ClickAwayListener>
  )
}

const menuSx: SystemStyleObject<Theme> = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 'calc(100% + 12px)',
  zIndex: zIndex.sidebarMenu,
  p: 1,
  borderRadius: 4,
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.surface,
  color: colors.text,
  boxShadow: '0 14px 32px rgba(143, 161, 191, 0.26)',
  [breakpoints.compactSidebar]: {
    left: 0,
    right: 'auto',
    width: 260,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    left: '50%',
    bottom: -8,
    width: 16,
    height: 16,
    borderRight: `1px solid ${colors.border}`,
    borderBottom: `1px solid ${colors.border}`,
    backgroundColor: colors.surface,
    transform: 'translateX(-50%) rotate(45deg)',
    [breakpoints.compactSidebar]: {
      left: 24,
    },
  },
}

const logoutButtonSx: SystemStyleObject<Theme> = {
  width: '100%',
  justifyContent: 'flex-start',
  px: 2,
  py: 1.5,
  borderRadius: radius.md,
  color: colors.textSoft,
  fontSize: 16,
  fontWeight: 700,
  textAlign: 'left',
  transition: transitions.background,
  '&:hover': {
    color: colors.text,
    backgroundColor: colors.inputBg,
  },
}

const profileButtonSx: SystemStyleObject<Theme> = {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  p: 1.5,
  borderRadius: radius.pill,
  color: colors.text,
  transition: transitions.background,
  '&:hover': {
    backgroundColor: colors.inputBg,
  },
  [breakpoints.compactSidebar]: {
    width: 48,
    height: 48,
    p: 0,
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: colors.hoverBg,
    },
  },
  [breakpoints.mobile]: {
    display: 'none',
  },
}

const profileInfoSx: SystemStyleObject<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  textAlign: 'left',
  [breakpoints.compactSidebar]: {
    gap: 0,
    justifyContent: 'center',
  },
}

const moreIconSx: SystemStyleObject<Theme> = {
  width: 20,
  color: colors.textMuted,
  [breakpoints.compactSidebar]: {
    display: 'none',
  },
}

const sxAdaptive = {
  [breakpoints.compactSidebar]: {
    display: 'none',
  },
}
