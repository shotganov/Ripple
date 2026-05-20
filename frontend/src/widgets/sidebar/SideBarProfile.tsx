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
  const userTag = user.tag

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
              <Box sx={{ lineHeight: 1.2, fontSize: 15, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.username}</Box>
              <Box sx={{ fontSize: 15, color: colors.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{userTag}</Box>
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
  borderRadius: radius.lg,
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.surface,
  color: colors.text,
  boxShadow: '0 14px 32px rgba(143, 161, 191, 0.26)',
  [breakpoints.compactSidebar]: {
    left: 0,
    right: 'auto',
    width: 260,
  },
}

const logoutButtonSx: SystemStyleObject<Theme> = {
  width: '100%',
  justifyContent: 'flex-start',
  p: 2,
  borderRadius: radius.lg,
  color: colors.black,
  fontSize: 15,
  fontWeight: 500,
  textAlign: 'left',
  position: 'relative',
  transition: transitions.background,
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '50%',
    bottom: -10,
    transform: 'translateX(-50%)',
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderTop: `10px solid ${colors.border}`,
    [breakpoints.compactSidebar]: { left: 28 },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    left: '50%',
    bottom: -9,
    transform: 'translateX(-50%)',
    borderLeft: '9px solid transparent',
    borderRight: '9px solid transparent',
    borderTop: `9px solid ${colors.surface}`,
    transition: `border-top-color 150ms ease`,
    [breakpoints.compactSidebar]: { left: 29 },
  },
  '&:hover': {
    backgroundColor: colors.inputBg,
    '&::after': {
      borderTopColor: colors.inputBg,
    },
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
