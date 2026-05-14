import { Box } from '@mui/material'
import { AdminStatsView } from '@features/reports'
import { StickyTopBar } from '@shared/ui'

export const AdminStatsPage = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
    <StickyTopBar sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5 }}>
      <Box sx={{ fontSize: 20, fontWeight: 700 }}>Статистика</Box>
    </StickyTopBar>
    <AdminStatsView />
  </Box>
)
