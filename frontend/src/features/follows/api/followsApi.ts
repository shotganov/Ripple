import { api } from '@shared/api'

export type FollowStatus = { isFollowing: boolean }

export const getFollowStatusRequest = (targetId: number) =>
  api.get<FollowStatus>(`/users/${targetId}/follow-status`).then(r => r.data)

export const followRequest = (targetId: number) =>
  api.post<FollowStatus>(`/users/${targetId}/follow`).then(r => r.data)

export const unfollowRequest = (targetId: number) =>
  api.delete<FollowStatus>(`/users/${targetId}/follow`).then(r => r.data)
