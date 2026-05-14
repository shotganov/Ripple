import axios, { type AxiosError } from 'axios'
import { enqueueSnackbar } from 'notistack'

export type ApiErrorBody = {
  statusCode?: number
  message?: string
  code?: string
}

type Severity = 'error' | 'warning' | 'info'

const show = (message: string, variant: Severity = 'error') => {
  enqueueSnackbar(message, { variant })
}

const handleAuthExpired = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  if (window.location.pathname !== '/auth') {
    window.location.assign('/auth')
  }
}

export const handleApiError = (error: unknown) => {
  if (!axios.isAxiosError(error)) return

  const err = error as AxiosError<ApiErrorBody>

  if (!err.response) {
    show('Нет связи с сервером', 'error')
    return
  }

  const status = err.response.status
  const message = err.response.data?.message ?? 'Что-то пошло не так'

  const url = err.config?.url ?? ''
  const isAuthRequest = url.includes('/auth/login') || url.includes('/auth/register')

  if (status === 401) {
    if (isAuthRequest) {
      show(message || 'Неверный логин или пароль', 'error')
      return
    }
    handleAuthExpired()
    show('Сессия истекла, войдите снова', 'warning')
    return
  }

  if (status === 403 || status === 404 || status === 409) {
    show(message, 'warning')
    return
  }

  if (status >= 400 && status < 500) {
    show(message, 'error')
    return
  }

  show('Сервер недоступен, попробуйте позже', 'error')
}
