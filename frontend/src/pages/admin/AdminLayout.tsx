import { Box, ButtonBase } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { NavLink, Outlet } from 'react-router-dom'
import { colors, radius, transitions } from '@shared/styles'
import { StickyTopBar } from '@shared/ui'

const tabs = [
  { to: '/admin/reports', label: 'Активные', end: true },
  { to: '/admin/reports/history', label: 'История', end: false },
]

export const AdminReportsLayout = () => (
  <Box sx={pageSx}>
    <StickyTopBar sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', p: 0 }}>
      <Box sx={tabsRowSx}>
        {tabs.map(t => (
          <ButtonBase key={t.to} component={NavLink} to={t.to} end={t.end} sx={tabSx}>
            <Box component="span" sx={tabLabelSx}>
              {t.label}
            </Box>
          </ButtonBase>
        ))}
      </Box>
    </StickyTopBar>
    <Outlet />
  </Box>
)

const pageSx: SystemStyleObject<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}

const tabsRowSx: SystemStyleObject<Theme> = {
  display: 'flex',
  height: 56,
  borderBottom: `1px solid ${colors.border}`,
}

const tabSx: SystemStyleObject<Theme> = {
  flex: 1,
  height: '100%',
  fontSize: 16,
  fontWeight: 500,
  color: colors.textMuted,
  transition: transitions.backgroundAndColor,
  '&:hover': { backgroundColor: colors.inputBg },
  '&.active': {
    color: colors.text,
    fontWeight: 700,
  },
  '&.active span::after': {
    backgroundColor: colors.accent,
    transform: 'scaleX(1)',
  },
}

const tabLabelSx: SystemStyleObject<Theme> = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  height: '100%',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: 'transparent',
    transform: 'scaleX(0)',
    transformOrigin: 'center',
    transition: 'transform 180ms ease',
  },
}
