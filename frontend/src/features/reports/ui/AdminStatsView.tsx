import { Box, CircularProgress } from '@mui/material'
import type { Theme } from '@mui/material'
import { type SystemStyleObject } from '@mui/system'
import { breakpoints, colors, radius } from '@shared/styles'
import { useAdminStats } from '../hooks/useAdminStats'

export const AdminStatsView = () => {
  const stats = useAdminStats()

  if (stats.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={28} />
      </Box>
    )
  }
  if (!stats.data) return null

  return (
    <Box
      sx={{
        px: 2,
        py: 2,
        border: `1px solid ${colors.border}`,
        borderRadius: '0px 0px 16px 16px',
        [breakpoints.mobile]: { borderRadius: 0 },
      }}
    >
      <Box sx={countersSx}>
        <CounterCard label="Пользователи" value={stats.data.users} />
        <CounterCard label="Посты" value={stats.data.posts} />
        <CounterCard label="Комментарии" value={stats.data.comments} />
        <CounterCard label="Лайки" value={stats.data.likes} />
        <CounterCard label="Подписки" value={stats.data.follows} />
      </Box>

      <Box sx={chartTitleSx}>Посты по дням, последние 30 дней</Box>
      <PostsBarChart points={stats.data.postsByDay} />
    </Box>
  )
}

const CounterCard = ({ label, value }: { label: string; value: number }) => (
  <Box sx={counterCardSx}>
    <Box sx={{ fontSize: 14, color: colors.textMuted }}>{label}</Box>
    <Box sx={{ fontSize: 28, fontWeight: 700, mt: 0.5 }}>{value}</Box>
  </Box>
)

const PostsBarChart = ({ points }: { points: { date: string; count: number }[] }) => {
  const max = Math.max(1, ...points.map(p => p.count))
  return (
    <Box sx={chartSx}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5, height: 140 }}>
        {points.map(p => (
          <Box
            key={p.date}
            title={`${p.date}: ${p.count}`}
            sx={{
              flex: 1,
              height: `${(p.count / max) * 100}%`,
              minHeight: 2,
              backgroundColor: colors.accent,
              borderRadius: '4px 4px 0 0',
              transition: 'opacity 180ms ease',
              '&:hover': { opacity: 0.7 },
            }}
          />
        ))}
      </Box>
      <Box sx={chartLabelsSx}>
        <span>{points[0]?.date.slice(5)}</span>
        <span>{points[points.length - 1]?.date.slice(5)}</span>
      </Box>
    </Box>
  )
}

const countersSx: SystemStyleObject<Theme> = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: 1.5,
}

const counterCardSx: SystemStyleObject<Theme> = {
  border: `1px solid ${colors.border}`,
  borderRadius: radius.md,
  px: 2,
  py: 1.5,
  backgroundColor: colors.surface,
}

const chartTitleSx: SystemStyleObject<Theme> = {
  mt: 2.5,
  mb: 1,
  fontSize: 14,
  fontWeight: 700,
  color: colors.textMuted,
}

const chartSx: SystemStyleObject<Theme> = {
  border: `1px solid ${colors.border}`,
  borderRadius: radius.md,
  p: 1.5,
  backgroundColor: colors.surface,
}

const chartLabelsSx: SystemStyleObject<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  mt: 0.5,
  fontSize: 12,
  color: colors.textMuted,
}
