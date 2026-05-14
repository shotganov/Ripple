import { Box, ButtonBase } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@shared/hooks'
import { clearToken } from '@features/auth'
import { clearUser } from '@entities/user'
import { selectUser } from '@entities/user'
import { CreatePostModal } from '@features/posts'
import { useUnreadCount } from '@features/notifications'
import { useMessagesUnreadCount } from '@features/chats'
import { alphaColors, breakpoints, colors, transitions, zIndex } from '@shared/styles'
import SocialIcon from '@shared/assets/icons/icon-social.svg?react'
import { SideBarNav } from './SideBarNav'
import { SideBarProfile } from './SideBarProfile'
import { routes } from '@shared/config/routes'

type Props = {
  isChatsPage: boolean
}

export const SideBar = ({ isChatsPage }: Props) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(selectUser)
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const unreadCountQuery = useUnreadCount(!!user && user.role !== 'ADMIN')
  const messagesUnreadQuery = useMessagesUnreadCount(!!user && user.role !== 'ADMIN')
  if (!user) return null
  const isAdmin = user?.role === 'ADMIN'
  const notificationsCount = unreadCountQuery.data?.count ?? 0
  const messagesCount = messagesUnreadQuery.data?.count ?? 0

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    dispatch(clearToken())
    dispatch(clearUser())
    setIsProfileMenuOpen(false)

    navigate(routes.auth)
  }

  return (
    <Box sx={{ ...rootSx }}>
      <Box
        sx={[
          panelSx,
          {
            borderRadius: isChatsPage ? '16px 0px 0px 16px' : 4,
            [breakpoints.tablet]: {
              borderRadius: 4,
            },
            [breakpoints.mobile]: { borderRadius: 0 },
          },
        ]}
      >
        <Box sx={topSectionSx}>
          <Box sx={logoSx}>
            <SocialIcon width={25} height={25} />
            {/* <Box component="span" sx={sxAdaptive}>
              <Title text="Social" fontSize={22} />
            </Box> */}
          </Box>

          <SideBarNav
            userId={user.id}
            notificationsCount={notificationsCount}
            messagesCount={messagesCount}
          />

          {!isAdmin && (
            <ButtonBase
              type="button"
              onClick={() => setIsCreatePostOpen(true)}
              sx={createPostButtonSx}
            >
              <Box component="span" sx={sxAdaptive}>
                Пост
              </Box>
              <Box component="span" sx={createPostIconSx} />
            </ButtonBase>
          )}
        </Box>

        <SideBarProfile
          isOpen={isProfileMenuOpen}
          onLogout={handleLogout}
          onToggle={() => setIsProfileMenuOpen(current => !current)}
          user={user}
        />
      </Box>

      {isCreatePostOpen && <CreatePostModal setIsOpen={setIsCreatePostOpen} />}
    </Box>
  )
}

const rootSx: SystemStyleObject<Theme> = {
  maxWidth: 280,
  width: '100%',
  height: '100vh',
  position: 'sticky',
  top: 0,
  py: 1,
  alignSelf: 'flex-start',
  zIndex: zIndex.sidebar,
  [breakpoints.compactSidebar]: {
    width: 72,
    maxWidth: 72,
  },
  [breakpoints.mobile]: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    top: 'auto',
    zIndex: zIndex.bottomBar,
    width: '100%',
    maxWidth: 'none',
    height: 54,
    ml: 0,
    p: 0,
    'body.chat-dialog-open &': {
      display: 'none',
    },
  },
}

const panelSx: SystemStyleObject<Theme> = {
  border: `1px solid ${colors.border}`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  px: 1.5,
  py: 1.5,
  borderRadius: 0,
  backgroundColor: colors.surface,
  height: '100%',
  width: '100%',
  [breakpoints.compactSidebar]: {
    alignItems: 'center',
    px: 1,
  },
  [breakpoints.mobile]: {
    flexDirection: 'row',
    justifyContent: 'center',
    px: 1.5,
    py: 1,
    borderRight: 0,
    borderTop: `1px solid ${colors.border}`,
    boxShadow: alphaColors.bottomBarShadow,
  },
}

const topSectionSx: SystemStyleObject<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  [breakpoints.compactSidebar]: {
    alignItems: 'center',
    gap: 1.25,
  },
  [breakpoints.mobile]: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 0.5,
  },
}

const logoSx: SystemStyleObject<Theme> = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  px: 1.7,
  pb: 1,
  [breakpoints.compactSidebar]: {
    px: 0,
    pb: 0,
    width: 48,
    height: 48,
    justifyContent: 'center',
    mb: 1,
  },
  [breakpoints.mobile]: {
    display: 'none',
  },
}

const createPostButtonSx: SystemStyleObject<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 52,
  mx: 1,
  mt: 1,
  px: 10,
  borderRadius: 10,
  backgroundColor: colors.accent,
  color: colors.surface,
  fontSize: 17,
  fontWeight: 700,
  transition: transitions.backgroundAndOpacity,
  '&:hover': {
    opacity: 0.9,
  },
  [breakpoints.compactSidebar]: {
    width: 48,
    height: 48,
    minHeight: 48,
    mx: 0,
    mt: 0.5,
    px: 0,
    borderRadius: '50%',
  },
  [breakpoints.mobile]: {
    display: 'none',
  },
}

const createPostIconSx: SystemStyleObject<Theme> = {
  display: 'none',
  position: 'relative',
  width: 20,
  height: 20,
  [breakpoints.compactSidebar]: {
    display: 'block',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '50%',
    top: 0,
    width: 3,
    height: '100%',
    borderRadius: 3,
    backgroundColor: 'currentColor',
    transform: 'translateX(-50%)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    width: '100%',
    height: 3,
    borderRadius: 999,
    backgroundColor: 'currentColor',
    transform: 'translateY(-50%)',
  },
}

const sxAdaptive = {
  [breakpoints.compactSidebar]: {
    display: 'none',
  },
}
