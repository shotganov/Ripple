import { AdminReportsList } from '@features/reports'

export const AdminHistoryPage = () => (
  <AdminReportsList
    filter={{ archived: true }}
    emptyTitle="История пуста"
    emptyHint="Здесь будут закрытые жалобы и удалённый контент"
    readonly
  />
)
