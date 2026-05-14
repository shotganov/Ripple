import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminRoute, PrivateRouter } from '@features/auth'
import {
  AdminHistoryPage,
  AdminReportsLayout,
  AdminReportsPage,
  AdminStatsPage,
} from '@pages/admin'
import { AuthPage } from '@pages/AuthPage'
import { ChatPage } from '@pages/ChatPage'
import { FeedPage } from '@pages/FeedPage'
import { NotificationsPage } from '@pages/NotificationsPage'
import { PostPage } from '@pages/PostPage'
import { ProfilePage } from '@pages/ProfilePage'
import { SearchPage } from '@pages/SearchPage'
import { MainLayout } from './MainLayout'
import { routePatterns } from '@shared/config/routes'

export const AppRouter = () => (
  <Routes>
    <Route path={routePatterns.auth} element={<AuthPage />} />
    <Route
      path={routePatterns.feed}
      element={
        <PrivateRouter>
          <MainLayout />
        </PrivateRouter>
      }
    >
      <Route index element={<FeedPage />} />
      <Route path={routePatterns.search} element={<SearchPage />} />
      <Route path={routePatterns.notifications} element={<NotificationsPage />} />
      <Route path={routePatterns.chat} element={<ChatPage />} />
      <Route path={routePatterns.profile} element={<ProfilePage />} />
      <Route path={routePatterns.post} element={<PostPage />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Navigate to="/admin/reports" replace />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <AdminRoute>
            <AdminReportsLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminReportsPage />} />
        <Route path="history" element={<AdminHistoryPage />} />
      </Route>
      <Route
        path={routePatterns.adminStats}
        element={
          <AdminRoute>
            <AdminStatsPage />
          </AdminRoute>
        }
      />
    </Route>
  </Routes>
)
