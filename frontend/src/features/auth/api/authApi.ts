import { api } from '@shared/api'
import type { User } from '@shared/model'
import type { Auth } from '../model/Auth'

type AuthResponse = {
  token: string
  user: User
}

export const loginRequest = (auth: Auth) =>
  api.post<AuthResponse>('/auth/login', auth).then(res => res.data)

export const registerRequest = (auth: Auth) =>
  api.post<AuthResponse>('/auth/register', auth).then(res => res.data)
