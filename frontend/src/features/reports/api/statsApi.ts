import { api } from '@shared/api'

export type AdminStats = {
  users: number
  posts: number
  comments: number
  likes: number
  follows: number
  postsByDay: { date: string; count: number }[]
}

export const fetchAdminStatsRequest = (): Promise<AdminStats> =>
  api.get('/admin/stats').then(r => r.data)
