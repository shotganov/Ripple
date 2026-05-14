import axios, { type InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '@shared/config'
import { handleApiError } from './handleError'

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipErrorToast?: boolean
  }
}

type RequestConfig = InternalAxiosRequestConfig & { skipErrorToast?: boolean }

export const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    const config = error?.config as RequestConfig | undefined
    if (!config?.skipErrorToast) handleApiError(error)
    return Promise.reject(error)
  },
)

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'Request error'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Unknown error'
}
