import { Box } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { useEffect, useRef } from 'react'
import { useMarkAllNotificationsRead, useNotifications } from '@features/notifications'
import { NotificationItem } from '@entities/notification'
import { EmptyState, StickyTopBar } from '@shared/ui'
import { breakpoints, colors } from '@shared/styles'

export const NotificationsPage = () => {
  const notificationsQuery = useNotifications()
  const markAllRead = useMarkAllNotificationsRead()

  const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } =
    notificationsQuery
  const items = data?.pages.flatMap(page => page.items) ?? []

  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const isFetchingNextRef = useRef(false)
  const fetchNextPageRef = useRef(fetchNextPage)

  useEffect(() => {
    isFetchingNextRef.current = isFetchingNextPage
  }, [isFetchingNextPage])

  useEffect(() => {
    fetchNextPageRef.current = fetchNextPage
  }, [fetchNextPage])

  useEffect(() => {
    markAllRead.mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasNextPage) return

    const obs = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isFetchingNextRef.current) {
          fetchNextPageRef.current()
        }
      },
      { rootMargin: '200px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [hasNextPage])

  return (
    <Box sx={rootSx}>
      <StickyTopBar
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2.5,
          py: 1.5,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <Box sx={{ fontSize: 20, fontWeight: 700 }}>Уведомления</Box>
      </StickyTopBar>

      {isLoading && <EmptyState title="Загрузка..." />}
      {isError && <EmptyState title="Не удалось загрузить уведомления" />}
      {data && items.length === 0 && (
        <EmptyState
          title="Здесь будут уведомления"
          hint="Лайки, комментарии и подписки появятся в этом разделе"
        />
      )}

      {items.length > 0 && (
        <Box sx={listSx}>
          {items.map(item => (
            <NotificationItem key={item.id} notification={item} />
          ))}
          {hasNextPage && <Box ref={sentinelRef} sx={{ height: 1 }} />}
        </Box>
      )}

      <Box sx={{ flex: 1, minHeight: '50vh' }} />
    </Box>
  )
}

const rootSx: SystemStyleObject<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}

const listSx: SystemStyleObject<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${colors.border}`,
  borderTop: 0,
  borderRadius: '0 0 16px 16px',
  overflow: 'hidden',
  '& > :last-of-type': {
    borderBottom: 0,
  },
  [breakpoints.mobile]: {
    borderRadius: 0,
  },
}
