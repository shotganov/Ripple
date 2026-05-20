import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { breakpoints, colors, zIndex } from '@shared/styles'

type Props = {
  children: ReactNode
  sx?: SystemStyleObject<Theme>
}

export const StickyTopBar = ({ children, sx }: Props) => (
  <Box sx={outerSx}>
    <Box sx={[innerSx, ...(Array.isArray(sx) ? sx : [sx])]}>{children}</Box>
  </Box>
)

const outerSx: SystemStyleObject<Theme> = {
  position: 'sticky',
  zIndex: zIndex.bottomBar,
  top: 0,
  pt: 1,
  background: `linear-gradient(${colors.pageBg} 20px, transparent 8px)`,
  [breakpoints.mobile]: {
    position: 'relative',
    pt: 0,
    background: 'transparent',
  },
}

const innerSx: SystemStyleObject<Theme> = {
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderRadius: '16px 16px 0 0',
  border: `1px solid ${colors.border}`,
  borderBottom: 0,
  [breakpoints.mobile]: {
    borderRadius: 0,
    borderTop: 0,
  },
}
