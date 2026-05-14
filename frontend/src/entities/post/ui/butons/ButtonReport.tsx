import { Box, ButtonBase } from '@mui/material'
import { alphaColors, colors, transitions } from '@shared/styles/tokens'
import ReportIcon from '@shared/assets/icons/icon-report.svg?react'

type Props = {
  onReportClick: () => void
}

export const ButtonReport = ({ onReportClick }: Props) => {
  return (
    <ButtonBase
      onClick={onReportClick}
      sx={{
        width: 24,
        height: 24,
        mr: -0.25,
        borderRadius: '50%',
        color: colors.textMuted,
        transition: transitions.backgroundAndColor,
        '&:hover': {
          color: colors.accent,
          backgroundColor: alphaColors.accentHoverBg,
        },
      }}
    >
      <Box component={ReportIcon} sx={{ width: 17.5, height: 17.5, color: 'inherit' }} />
    </ButtonBase>
  )
}
