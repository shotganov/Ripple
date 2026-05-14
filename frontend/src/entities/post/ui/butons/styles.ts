import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { colors, radius, transitions } from '@shared/styles/tokens'

export const postActionButtonSx: SystemStyleObject<Theme> = {
  px: 1,
  pl: 0.5,
  py: 0.5,
  borderRadius: radius.md,
  fontSize: 14,
  fontWeight: 500,
  display: 'flex',
  color: colors.textMuted,
  alignItems: 'center',
  transition: transitions.background,
}
