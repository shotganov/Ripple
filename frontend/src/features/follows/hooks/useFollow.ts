import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  followRequest,
  getFollowStatusRequest,
  unfollowRequest,
  type FollowStatus,
} from '../api/followsApi'

export const followStatusKey = (targetId: number) => ['follow-status', targetId] as const

export const useFollowStatus = (targetId: number, enabled = true) =>
  useQuery({
    queryKey: followStatusKey(targetId),
    queryFn: () => getFollowStatusRequest(targetId),
    enabled: enabled && Number.isFinite(targetId),
    staleTime: Infinity,
  })

export const useToggleFollow = (targetId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (isCurrentlyFollowing: boolean) =>
      isCurrentlyFollowing ? unfollowRequest(targetId) : followRequest(targetId),
    onSuccess: data => {
      queryClient.setQueryData<FollowStatus>(followStatusKey(targetId), data)
      queryClient.invalidateQueries({ queryKey: ['user', targetId] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
    },
  })
}
