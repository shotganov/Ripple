import { Box, ButtonBase, CircularProgress } from '@mui/material'
import type { Theme } from '@mui/material'
import { type SystemStyleObject } from '@mui/system'
import { useState, useRef, useEffect } from 'react'
import { breakpoints, colors, radius, transitions } from '@shared/styles'
import { useAdminStats } from '../hooks/useAdminStats'
import { useMetricsSummary } from '../hooks/useMetricsSummary'
import type { DailyPoint } from '../api/statsApi'

type ChartTab = 'posts' | 'comments' | 'likes' | 'users'

const chartTabs: { key: ChartTab; label: string }[] = [
  { key: 'posts', label: 'Посты' },
  { key: 'comments', label: 'Комментарии' },
  { key: 'likes', label: 'Лайки' },
  { key: 'users', label: 'Регистрации' },
]

export const AdminStatsView = () => {
  const stats = useAdminStats()
  const metrics = useMetricsSummary()
  const [activeTab, setActiveTab] = useState<ChartTab>('posts')

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
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        border: `1px solid ${colors.border}`,
        borderRadius: '0px 0px 16px 16px',
        [breakpoints.mobile]: { borderRadius: 0 },
      }}
    >
      <Box>
        <Box sx={chartTitleSx}>Активность</Box>
        <Box sx={countersSx}>
          <CounterCard label="Пользователи" value={stats.data.users} />
          <CounterCard label="Посты" value={stats.data.posts} />
          <CounterCard label="Комментарии" value={stats.data.comments} />
          <CounterCard label="Лайки" value={stats.data.likes} />
          <CounterCard label="Подписки" value={stats.data.follows} />
        </Box>
      </Box>
      {metrics.data && (
        <Box>
          <Box sx={chartTitleSx}>HTTP метрики (с момента запуска)</Box>
          <Box sx={countersSx}>
            <CounterCard label="Запросов" value={metrics.data.http.totalRequests} />
            <CounterCard label="Ошибок" value={metrics.data.http.totalErrors} />
            <CounterCard label="Ср. ответ" value={metrics.data.http.avgDurationMs} suffix=" мс" />
            <CounterCard label="WS соед." value={metrics.data.realtime.wsConnections} />
            <CounterCard label="CPU" value={metrics.data.http.cpuUsage} suffix="%" />
          </Box>
        </Box>
      )}

      <Box>
        <Box sx={chartTitleSx}>Активность по дням, последние 30 дней</Box>
        <Box sx={tabsRowSx}>
          {chartTabs.map(t => (
            <ButtonBase
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              sx={{ ...tabSx, ...(activeTab === t.key && tabActiveSx) }}
            >
              {t.label}
            </ButtonBase>
          ))}
        </Box>
        <AreaChart points={
          activeTab === 'posts' ? stats.data.postsByDay
          : activeTab === 'comments' ? stats.data.commentsByDay
          : activeTab === 'likes' ? stats.data.likesByDay
          : stats.data.usersByDay
        } />
      </Box>
    </Box>
  )
}

const CounterCard = ({
  label,
  value,
  suffix = '',
}: {
  label: string
  value: number
  suffix?: string
}) => (
  <Box sx={counterCardSx}>
    <Box sx={{ fontSize: 14, color: colors.textMuted }}>{label}</Box>
    <Box sx={{ fontSize: 28, fontWeight: 700, mt: 0.5 }}>
      {value}
      {suffix}
    </Box>
  </Box>
)

const CHART_H = 140
const CHART_PAD_TOP = 12

const AreaChart = ({ points }: { points: DailyPoint[] }) => {
  const [tooltip, setTooltip] = useState<{ idx: number } | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [width, setWidth] = useState(600)

  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const obs = new ResizeObserver(() => setWidth(el.clientWidth))
    obs.observe(el)
    setWidth(el.clientWidth)
    return () => obs.disconnect()
  }, [])

  const max = Math.max(1, ...points.map(p => p.count))
  const n = points.length
  const xStep = width / Math.max(n - 1, 1)
  const yScale = (v: number) => CHART_PAD_TOP + (1 - v / max) * (CHART_H - CHART_PAD_TOP)

  const xs = points.map((_, i) => i * xStep)
  const ys = points.map(p => yScale(p.count))

  const linePath = points.map((_, i) => `${i === 0 ? 'M' : 'L'}${xs[i]},${ys[i]}`).join(' ')
  const areaPath = `${linePath} L${xs[n - 1]},${CHART_H} L${xs[0]},${CHART_H} Z`

  const hovered = tooltip !== null ? points[tooltip.idx] : null
  const hovX = tooltip !== null ? xs[tooltip.idx] : 0
  const hovY = tooltip !== null ? ys[tooltip.idx] : 0

  return (
    <Box sx={chartSx}>
      <Box sx={{ position: 'relative' }}>
        <svg
          ref={svgRef}
          width="100%"
          height={CHART_H}
          style={{ display: 'block', overflow: 'visible' }}
          onMouseLeave={() => setTooltip(null)}
          onMouseMove={e => {
            const rect = svgRef.current?.getBoundingClientRect()
            if (!rect) return
            const mx = e.clientX - rect.left
            const idx = Math.round(mx / xStep)
            setTooltip({ idx: Math.max(0, Math.min(n - 1, idx)) })
          }}
        >
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.accent} stopOpacity="0.25" />
              <stop offset="100%" stopColor={colors.accent} stopOpacity="0.03" />
            </linearGradient>
          </defs>

          <path d={areaPath} fill="url(#areaGrad)" />
          <path d={linePath} fill="none" stroke={colors.accent} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

          {tooltip !== null && (
            <>
              <line x1={hovX} y1={CHART_PAD_TOP} x2={hovX} y2={CHART_H} stroke={colors.border} strokeWidth="1" strokeDasharray="4 3" />
              <circle cx={hovX} cy={hovY} r={4} fill={colors.accent} />
            </>
          )}
        </svg>

        {hovered && tooltip !== null && (
          <Box
            sx={{
              position: 'absolute',
              left: hovX,
              top: Math.max(0, hovY - 36),
              transform: hovX > width * 0.8 ? 'translateX(-100%) translateX(-8px)' : 'translateX(8px)',
              backgroundColor: colors.text,
              color: colors.surface,
              fontSize: 12,
              fontWeight: 600,
              px: 1,
              py: 0.5,
              borderRadius: radius.sm,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              zIndex: 10,
            }}
          >
            {hovered.date.slice(5)} · {hovered.count}
          </Box>
        )}
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

const tabsRowSx: SystemStyleObject<Theme> = {
  display: 'flex',
  gap: 0.5,
  mb: 1.5,
  flexWrap: 'wrap',
}

const tabSx: SystemStyleObject<Theme> = {
  height: 30,
  px: 1.5,
  fontSize: 13,
  fontWeight: 500,
  borderRadius: radius.pill,
  color: colors.textMuted,
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.surface,
  transition: transitions.background,
  '&:hover': { backgroundColor: colors.inputBg },
}

const tabActiveSx: SystemStyleObject<Theme> = {
  color: colors.accent,
  borderColor: colors.accent,
  backgroundColor: colors.surface,
}
