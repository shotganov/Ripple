import { Box } from '@mui/material'
import { useEffect, useRef, type ReactNode } from 'react'
import { breakpoints, colors } from '@shared/styles'
import type { Comment } from '../model/types'
import { CommentItem } from './CommentItem'

type Props = {
  comments: Comment[]
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  onLoadMore?: () => void
  renderMenu?: (comment: Comment) => ReactNode
}

export const CommentsList = ({
  comments,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
  renderMenu,
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
      { rootMargin: '200px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [onLoadMore, hasNextPage, isFetchingNextPage])

  if (comments.length === 0) return null

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${colors.border}`,
        borderTop: 0,
        borderRadius: '0 0 16px 16px',
        overflow: 'hidden',
        [breakpoints.mobile]: {
          borderRadius: 0,
        },
      }}
    >
      <Box sx={{ '& > :last-of-type': { borderBottom: 0 } }}>
        {comments.map((c, i) => (
          <Box
            key={c.id}
            id={`comment-${c.id}`}
            sx={
              i === comments.length - 1 && !hasNextPage
                ? { '& > *': { borderBottom: 0 } }
                : undefined
            }
          >
            <CommentItem comment={c} menu={renderMenu?.(c)} />
          </Box>
        ))}
        {hasNextPage && <Box ref={sentinelRef} sx={{ height: 1 }} />}
      </Box>
    </Box>
  )
}
