import { Box, ButtonBase, Paper } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { colors, radius, transitions } from '@shared/styles'
import { StickyTopBar } from '@shared/ui'
import type { FeedMode } from '../model/FeedMode'

type FeedTab = {
  label: string
  value: FeedMode
}

type FeedHeaderProps = {
  activeMode: FeedMode
  onModeChange: (mode: FeedMode) => void
  tabs: FeedTab[]
}

export const FeedHeader = ({ activeMode, onModeChange, tabs }: FeedHeaderProps) => {
  return (
    <StickyTopBar>
      <Paper elevation={0} sx={tabsPaperSx}>
        {tabs.map(tab => {
          const active = activeMode === tab.value

          return (
            <ButtonBase
              key={tab.value}
              onClick={() => onModeChange(tab.value)}
              sx={{
                ...tabButtonSx,
                fontWeight: active ? 700 : 500,
                color: active ? colors.text : colors.textMuted,
              }}
            >
              <Box
                component="span"
                sx={{
                  ...tabLabelSx,
                  '&::after': {
                    ...tabLabelUnderlineSx,
                    backgroundColor: active ? colors.accent : 'transparent',
                    transform: active ? 'scaleX(1)' : 'scaleX(0)',
                  },
                }}
              >
                {tab.label}
              </Box>
            </ButtonBase>
          )
        })}
      </Paper>
    </StickyTopBar>
  )
}

const tabsPaperSx: SystemStyleObject<Theme> = {
  display: 'flex',
  borderRadius: 0,
  borderBottom: `1px solid ${colors.border}`,
  backgroundColor: 'transparent',
  overflow: 'hidden',
}

const tabButtonSx: SystemStyleObject<Theme> = {
  width: '50%',
  height: 56,
  fontSize: 16,
  transition: transitions.backgroundAndColor,
  '&:hover': {
    backgroundColor: colors.inputBg,
  },
}

const tabLabelSx: SystemStyleObject<Theme> = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  height: '100%',
}

const tabLabelUnderlineSx: SystemStyleObject<Theme> = {
  content: '""',
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: 3,
  borderRadius: radius.pill,
  transformOrigin: 'center',
  transition: 'transform 180ms ease',
}
