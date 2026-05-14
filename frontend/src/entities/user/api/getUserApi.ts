import { api } from '@shared/api'
import { type User } from '@shared/model'

export const getUserRequest = (id: number) => api.get<User>(`/users/${id}`).then(res => res.data)

export const getUserSuggestionsRequest = () =>
  api.get<User[]>('/users/suggestions').then(res => res.data)
