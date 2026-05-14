import { Box, Paper } from '@mui/material'
import { breakpoints, colors } from '@shared/styles'

type Props = {
  title: string
  hint?: string
}

export const EmptyState = ({ title, hint }: Props) => {
  return (
    <Paper elevation={0} sx={wrapSx}>
      <Box sx={titleSx}>{title}</Box>
      {hint && <Box sx={hintSx}>{hint}</Box>}
    </Paper>
  )
}

const wrapSx = {
  py: 3.5,
  backgroundColor: colors.surface,
  textAlign: 'center',
  border: `1px solid ${colors.border}`,
  borderTop: 0,
  borderRadius: `0px 0px 16px 16px`,
  [breakpoints.mobile]: {
    borderRadius: 0,
    borderRight: 0,
    borderLeft: 0,
  },
}

const titleSx = {
  fontSize: 18,
  fontWeight: 600,
  color: colors.text,
  mb: 1,
}

const hintSx = {
  fontSize: 14,
  lineHeight: 1.5,
  color: colors.textMuted,
}
