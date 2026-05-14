import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { patchUserRequest } from '../api/profileApi'
import { getUserRequest } from '@entities/user/api/getUserApi'

export const useGetUser = (id: number) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserRequest(id),
    enabled: Number.isFinite(id),
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: patchUserRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['search'] })
    },
  })
}
