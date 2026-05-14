import { useMutation } from '@tanstack/react-query'
import { useAppDispatch } from '@shared/hooks'
import { loginRequest, registerRequest } from '../api'
import { setToken } from '../model/authSlice'
import type { Auth } from '../model/Auth'
import { setUser } from '@entities/user/model/userSlice'

const persistAuth = (data: { token: string; user: unknown }) => {
  localStorage.setItem('token', data.token)
  localStorage.setItem('user', JSON.stringify(data.user))
}

export const useLogin = () => {
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: (auth: Auth) => loginRequest(auth),
    onSuccess: data => {
      persistAuth(data)
      dispatch(setToken(data.token))
      dispatch(setUser(data.user))
    },
  })
}

export const useRegister = () => {
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: (auth: Auth) => registerRequest(auth),
    onSuccess: data => {
      persistAuth(data)
      dispatch(setToken(data.token))
      dispatch(setUser(data.user))
    },
  })
}
