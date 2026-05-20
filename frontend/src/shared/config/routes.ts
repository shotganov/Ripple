export const routePatterns = {
  auth: '/auth',
  feed: '/',
  search: '/search',
  notifications: '/notifications',
  chat: '/chat',
  profile: '/profile/:id',
  post: '/post/:id',
  adminReports: '/admin/reports',
  adminStats: '/admin/stats',
  adminUsers: '/admin/users',
} as const

export const routes = {
  auth: '/auth',
  feed: '/',
  search: '/search',
  chat: '/chat',
  notifications: '/notifications',
  adminReports: '/admin/reports',
  adminStats: '/admin/stats',
  adminUsers: '/admin/users',
  profile: (id: number | string) => `/profile/${id}`,
  post: (id: number | string) => `/post/${id}`,
  chatWith: (peerId: number | string) => `/chat?peer=${peerId}`,
} as const
