import { Box } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { useEffect, useRef } from 'react'
import { breakpoints, colors } from '@shared/styles'
import { UserFollowRow } from '@features/follows'
import type { User } from '@shared/model'

type Props = {
  users: User[]
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  onLoadMore?: () => void
}

export const UsersResults = ({
  users,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
}: Props) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !onLoadMore || !hasNextPage) return

    const obs = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          onLoadMore()
        }
      },
      { rootMargin: '400px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [onLoadMore, hasNextPage, isFetchingNextPage])

  return (
    <Box sx={listSx}>
      {users.map(user => (
        <Box key={user.id} sx={rowSx}>
          <UserFollowRow user={user} sizeAvatar={48} />
        </Box>
      ))}
      {hasNextPage && <Box ref={sentinelRef} sx={{ height: 1 }} />}
    </Box>
  )
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

const rowSx: SystemStyleObject<Theme> = {
  borderBottom: `1px solid ${colors.border}`,
}
