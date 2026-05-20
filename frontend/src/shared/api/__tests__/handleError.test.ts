/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import { handleApiError } from '../handleError'

jest.mock('notistack', () => ({
  enqueueSnackbar: jest.fn(),
}))

const mockEnqueue = enqueueSnackbar as jest.Mock

const makeAxiosError = (status: number, message?: string, url = '/api/posts') => {
  return new axios.AxiosError('error', undefined, { url } as any, undefined, {
    status,
    data: message ? { message } : {},
  } as any)
}

describe('handleApiError', () => {
  beforeEach(() => {
    mockEnqueue.mockClear()
  })

  it('does nothing for non-axios errors', () => {
    handleApiError(new Error('regular'))
    expect(mockEnqueue).not.toHaveBeenCalled()
  })

  it('shows server unavailable when no response', () => {
    const error = new axios.AxiosError('network error')
    handleApiError(error)
    expect(mockEnqueue).toHaveBeenCalledWith('Нет связи с сервером', { variant: 'error' })
  })

  it('shows message for 401 on auth/login request', () => {
    const error = makeAxiosError(401, 'Неверный пароль', '/api/auth/login')
    handleApiError(error)
    expect(mockEnqueue).toHaveBeenCalledWith('Неверный пароль', { variant: 'error' })
  })

  it('shows message for 401 on auth/register request', () => {
    const error = makeAxiosError(401, 'Уже существует', '/api/auth/register')
    handleApiError(error)
    expect(mockEnqueue).toHaveBeenCalledWith('Уже существует', { variant: 'error' })
  })

  it('shows session expired message for 401 on non-auth request', () => {
    const error = makeAxiosError(401, undefined, '/api/posts')
    handleApiError(error)
    expect(mockEnqueue).toHaveBeenCalledWith('Сессия истекла, войдите снова', { variant: 'warning' })
  })

  it('shows warning for 403', () => {
    const error = makeAxiosError(403, 'Нет доступа')
    handleApiError(error)
    expect(mockEnqueue).toHaveBeenCalledWith('Нет доступа', { variant: 'warning' })
  })

  it('shows warning for 404', () => {
    const error = makeAxiosError(404, 'Не найдено')
    handleApiError(error)
    expect(mockEnqueue).toHaveBeenCalledWith('Не найдено', { variant: 'warning' })
  })

  it('shows warning for 409', () => {
    const error = makeAxiosError(409, 'Конфликт')
    handleApiError(error)
    expect(mockEnqueue).toHaveBeenCalledWith('Конфликт', { variant: 'warning' })
  })

  it('shows error for 422', () => {
    const error = makeAxiosError(422, 'Ошибка валидации')
    handleApiError(error)
    expect(mockEnqueue).toHaveBeenCalledWith('Ошибка валидации', { variant: 'error' })
  })

  it('shows server unavailable for 500', () => {
    const error = makeAxiosError(500)
    handleApiError(error)
    expect(mockEnqueue).toHaveBeenCalledWith('Сервер недоступен, попробуйте позже', { variant: 'error' })
  })

  it('uses default message when response has no message field', () => {
    const error = makeAxiosError(422)
    handleApiError(error)
    expect(mockEnqueue).toHaveBeenCalledWith('Что-то пошло не так', { variant: 'error' })
  })
})
