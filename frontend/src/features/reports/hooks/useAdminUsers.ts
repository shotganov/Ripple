import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAdminUsers, setUserRole, deleteAdminUser } from '../api/usersAdminApi'

export const useAdminUsers = () =>
  useQuery({ queryKey: ['admin-users'], queryFn: fetchAdminUsers })

export const useSetUserRole = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: 'USER' | 'ADMIN' }) => setUserRole(id, role),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      qc.invalidateQueries({ queryKey: ['user', id] })
    },
  })
}

export const useDeleteAdminUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteAdminUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })
}
