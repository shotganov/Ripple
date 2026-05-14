import { Box } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { Skeleton } from '@shared/ui'
import { colors } from '@shared/styles'

export const ProfileSkeleton = () => (
  <>
    <Box sx={coverSx} />

    <Box sx={cardSx}>
      <Box
        sx={{
          position: 'absolute',
          transform: 'translateY(-70%)',
          borderRadius: '50%',
          border: `2px solid ${colors.surface}`, // белый «разрыв»
          backgroundColor: colors.surface,
          overflow: 'hidden',
        }}
      >
        <Skeleton width={128} height={128} circle />
      </Box>

      <Box sx={topRowSx}>
        <Skeleton width={120} height={30} />
      </Box>

      <Box sx={textColumnSx}>
        <Skeleton width="40%" height={13} />
        <Skeleton width="25%" height={11} />
      </Box>

      <Skeleton width="80%" height={11} />

      <Box sx={countersRowSx}>
        <Skeleton width={110} height={11} />
        <Skeleton width={110} height={11} />
      </Box>
    </Box>
  </>
)

const coverSx: SystemStyleObject<Theme> = {
  width: '100%',
  height: 200,
  backgroundColor: colors.border,
  border: `1px solid ${colors.border}`,
  borderBottom: 0,
  borderRadius: 0,
}

const cardSx: SystemStyleObject<Theme> = {
  position: 'relative',
  p: 3,
  pb: 2,
  backgroundColor: colors.surface,
  display: 'flex',
  flexDirection: 'column',
  gap: 1.25,
  border: `1px solid ${colors.border}`,
  borderTop: 0,
  borderRadius: 0,
}

const topRowSx: SystemStyleObject<Theme> = {
  display: 'flex',
  justifyContent: 'flex-end',
  mt: -1,
  mb: 2,
}

const textColumnSx: SystemStyleObject<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
}

const countersRowSx: SystemStyleObject<Theme> = {
  display: 'flex',
  gap: 2,
  mt: 0.5,
}
