import { api } from '@shared/api'
import type { User } from '@shared/model'
import type { LoginData, RegisterData } from '../model/Auth'

type AuthResponse = {
  token: string
  user: User
}

export const loginRequest = (data: LoginData) =>
  api.post<AuthResponse>('/auth/login', data).then(res => res.data)

export const registerRequest = (data: RegisterData) =>
  api.post<AuthResponse>('/auth/register', data).then(res => res.data)
