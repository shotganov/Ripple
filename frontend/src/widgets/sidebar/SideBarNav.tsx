import { Box, ButtonBase } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { NavLink, useMatch } from 'react-router-dom'
import { breakpoints, colors, radius, transitions } from '@shared/styles'
import { menuItems, type SideBarMenuItem } from './model/menuItems'
import { routes } from '@shared/config/routes'
import { useAppSelector } from '@shared/hooks'
import { selectUser } from '@entities/user'

type SideBarNavProps = {
  userId: number
  notificationsCount: number
  messagesCount: number
  reportsCount: number
}

type NavItemProps = {
  item: SideBarMenuItem
  badgeCount: number
}

const NavItem = ({ item, badgeCount }: NavItemProps) => {
  const isActive = !!useMatch(item.path)
  const Icon = isActive && item.iconActive ? item.iconActive : item.icon

  return (
    <ButtonBase component={NavLink} to={item.path} sx={navItemSx}>
      <Box sx={iconWrapSx}>
        <Icon width={26} height={26} />

        {badgeCount > 0 && (
          <Box component="span" sx={badgeSx}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </Box>
        )}
      </Box>
      <Box component="span" sx={{ lineHeight: 1.2, ...sxAdaptive }}>
        {item.text}
      </Box>
    </ButtonBase>
  )
}

const badgeFor = (path: string, notifications: number, messages: number, reports: number) => {
  if (path === '/notifications') return notifications
  if (path === '/chat') return messages
  if (path === '/admin/reports') return reports
  return 0
}

export const SideBarNav = ({
  userId,
  notificationsCount,
  messagesCount,
  reportsCount,
}: SideBarNavProps) => {
  const user = useAppSelector(selectUser)
  const isAdmin = user?.role === 'ADMIN'

  return (
    <Box sx={navListSx}>
      {menuItems
        .filter(item => {
          if (item.adminOnly && !isAdmin) return false
          if (item.userOnly && isAdmin) return false
          return true
        })
        .map(item => {
          if (item.path === '/profile/:id') item.path = routes.profile(userId)

          return (
            <NavItem
              key={item.path}
              item={item}
              badgeCount={badgeFor(item.path, notificationsCount, messagesCount, reportsCount)}
            />
          )
        })}
    </Box>
  )
}

const navListSx: SystemStyleObject<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 1,
  [breakpoints.mobile]: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 1,
  },
}

const navItemSx: SystemStyleObject<Theme> = {
  display: 'inline-flex',
  alignSelf: 'flex-start',
  width: 'fit-content',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: 1.5,
  p: 1.5,
  pr: 3.5,
  borderRadius: radius.pill,
  color: colors.black,
  fontSize: 20,
  fontWeight: 400,
  textTransform: 'none',
  transition: transitions.background,
  backgroundColor: 'transparent',
  '& svg': {
    display: 'block',
    flexShrink: 0,
    color: 'inherit',
  },
  '&.active': {
    fontWeight: 700,
  },
  '&:hover': {
    backgroundColor: '#e7e7e8',
  },
  [breakpoints.compactSidebar]: {
    width: 48,
    height: 48,
    px: 0,
    minHeight: 48,
    gap: 0,
    justifyContent: 'center',
  },
  [breakpoints.mobile]: {
    width: 44,
    height: 44,
    minHeight: 44,
    borderRadius: radius.pill,
  },
}

const iconWrapSx: SystemStyleObject<Theme> = {
  position: 'relative',
  width: 26,
  height: 26,
  flexShrink: 0,
}

const badgeSx: SystemStyleObject<Theme> = {
  position: 'absolute',
  top: -7,
  right: -3,
  minWidth: 16,
  height: 16,
  px: 0.5,
  borderRadius: radius.pill,
  border: `1px solid ${colors.surface}`,
  backgroundColor: colors.accent,
  color: colors.surface,
  fontSize: 11,
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const sxAdaptive = {
  [breakpoints.compactSidebar]: {
    display: 'none',
  },
}
