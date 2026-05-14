import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { alphaColors, colors, radius } from '../../styles/tokens'

type ModalContentProps = {
  children: ReactNode
  width?: number | string
  maxWidth?: number | string | Record<string, number | string>
  height?: number | string | Record<string, number | string>
  maxHeight?: number | string | Record<string, number | string>
  sx?: SystemStyleObject<Theme>
}

export const ModalContent = ({
  children,
  width = 600,
  maxWidth = 'calc(100vw - 32px)',
  height,
  maxHeight,
  sx,
}: ModalContentProps) => (
  <Box
    sx={{
      width,
      maxWidth,
      height,
      maxHeight,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      borderRadius: radius.lg,
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.surface,
      boxShadow: alphaColors.modalShadow,
      ...sx,
    }}
  >
    {children}
  </Box>
)
