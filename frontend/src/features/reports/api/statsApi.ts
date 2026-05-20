import { api } from '@shared/api'

export type DailyPoint = { date: string; count: number }

export type AdminStats = {
  users: number
  posts: number
  comments: number
  likes: number
  follows: number
  postsByDay: DailyPoint[]
  commentsByDay: DailyPoint[]
  likesByDay: DailyPoint[]
  usersByDay: DailyPoint[]
}

export const fetchAdminStatsRequest = (): Promise<AdminStats> =>
  api.get('/admin/stats').then(r => r.data)
