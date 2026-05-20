import { Outlet, useLocation } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import { useEffect } from 'react'
import { SideBar } from '@widgets/sidebar'
import { SearchPanel } from '@widgets/search'
import { breakpoints, colors } from '@shared/styles'
import { routes } from '@shared/config/routes'
import { useAppSelector } from '@shared/hooks'
import { selectToken } from '@features/auth'
import { selectUser } from '@entities/user'
import { useSocketSync } from '@features/chats'
import { connectSocket, disconnectSocket } from '@shared/api'
import type { SystemStyleObject, Theme } from '@mui/system'

export const MainLayout = () => {
  const { pathname } = useLocation()
  const isChatsPage = pathname === routes.chat
  const isSearchPage = pathname === routes.search
  const token = useAppSelector(selectToken)
  const user = useAppSelector(selectUser)
  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => {
    if (token) {
      connectSocket(token)
      return () => {
        disconnectSocket()
      }
    }
  }, [token])

  useSocketSync()

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: isChatsPage ? 0 : 2.5,
        px: 3,
        pb: 0,
        minHeight: '100vh',
        backgroundColor: colors.pageBg,
        [breakpoints.tablet]: {
          gap: 2.5,
        },
        [breakpoints.mobile]: {
          px: 0,
          pb: 9,
          'body.chat-dialog-open &': {
            pb: 0,
          },
        },
      }}
    >
      <SideBar isChatsPage={isChatsPage} />

      <Container
        maxWidth={false}
        disableGutters
        sx={{
          m: 0,
          maxWidth: isChatsPage ? '990px' : '600px',
          [breakpoints.tablet]: {
            maxWidth: '620px',
          },
          [breakpoints.mobile]: {
            maxWidth: '100%',
          },
        }}
      >
        <Outlet />
      </Container>

      {!isChatsPage && !isAdmin && <SearchPanel isSearchPage={isSearchPage} />}
      {isAdmin && <Box sx={wrapSx}></Box>}
    </Box>
  )
}

const wrapSx: SystemStyleObject<Theme> = {
  width: 250,
  flexShrink: 0,
  [breakpoints.compactSidebar]: {
    display: 'none',
  },
}
