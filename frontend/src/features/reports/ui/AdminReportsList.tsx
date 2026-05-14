import { Box, CircularProgress } from '@mui/material'
import { useEffect, useRef } from 'react'
import { EmptyState } from '@shared/ui'
import { useReports } from '../hooks/useReports'
import { AdminReportRow } from './AdminReportRow'
import type { ReportStatus } from '../model/types'

type Props = {
  filter: { status?: ReportStatus; archived?: boolean }
  emptyTitle: string
  emptyHint: string
  readonly?: boolean
}

export const AdminReportsList = ({ filter, emptyTitle, emptyHint, readonly }: Props) => {
  const reports = useReports(filter)
  const items = reports.data?.pages.flatMap(p => p.items) ?? []
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !reports.hasNextPage) return
    const obs = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !reports.isFetchingNextPage) {
          reports.fetchNextPage()
        }
      },
      { rootMargin: '300px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [reports])

  return (
    <Box>
      {reports.isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      )}
      {reports.data && items.length === 0 && <EmptyState title={emptyTitle} hint={emptyHint} />}
      {items.map((r, i) => (
        <AdminReportRow
          key={r.id}
          report={r}
          readonly={readonly}
          isLast={i === items.length - 1 && !reports.hasNextPage}
        />
      ))}
      {reports.hasNextPage && <Box ref={sentinelRef} sx={{ height: 1 }} />}
    </Box>
  )
}
