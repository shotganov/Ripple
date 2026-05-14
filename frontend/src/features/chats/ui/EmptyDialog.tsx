import { Box } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { breakpoints, colors } from '@shared/styles'

export const EmptyDialog = () => <Box sx={rootSx}>Выберите чат</Box>

const rootSx: SystemStyleObject<Theme> = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.textSoft,
  fontSize: 18,
  border: `1px solid ${colors.border}`,
  borderRadius: '0px 16px 16px 0px',
  [breakpoints.tablet]: {
    display: 'none',
  },
}
