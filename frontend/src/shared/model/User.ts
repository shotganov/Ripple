export type UserRole = 'USER' | 'ADMIN'

export type User = {
  id: number
  username: string
  tag: string
  avatar: string
  role?: UserRole
  bio?: string
  coverImage?: string
  followersCount?: number
  followingCount?: number
}
