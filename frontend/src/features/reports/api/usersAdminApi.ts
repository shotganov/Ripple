import { api } from '@shared/api'

export type AdminUser = {
  id: number
  username: string
  tag: string
  email: string
  role: 'USER' | 'ADMIN'
  avatar: string | null
  createdAt: string
}

export const fetchAdminUsers = (): Promise<AdminUser[]> =>
  api.get('/admin/users').then(r => r.data)

export const setUserRole = (id: number, role: 'USER' | 'ADMIN'): Promise<void> =>
  api.patch(`/admin/users/${id}/role`, { role }).then(r => r.data)

export const deleteAdminUser = (id: number): Promise<void> =>
  api.delete(`/admin/users/${id}`).then(r => r.data)
