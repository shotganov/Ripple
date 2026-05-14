import { Box } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { breakpoints, colors } from '@shared/styles'
import { CommentSkeleton } from './CommentSkeleton'

type Props = {
  count?: number
}

export const CommentSkeletonList = ({ count = 7 }: Props) => {
  return (
    <Box sx={listSx}>
      {Array.from({ length: count }).map((_, index) => (
        <CommentSkeleton key={index} />
      ))}
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
