import { AdminReportsList } from '@features/reports'

export const AdminReportsPage = () => (
  <AdminReportsList
    filter={{ status: 'PENDING' }}
    emptyTitle="Жалоб нет"
    emptyHint="Здесь будут жалобы, когда они появятся"
  />
)
