/* eslint-disable @typescript-eslint/no-explicit-any */
import { getErrorMessage } from '../axios'
import axios from 'axios'

describe('getErrorMessage', () => {
  it('returns message from axios error response body', () => {
    const err = new axios.AxiosError('fail', undefined, undefined, undefined, {
      status: 400,
      data: { message: 'Не найдено' },
    } as any)
    expect(getErrorMessage(err)).toBe('Не найдено')
  })

  it('falls back to axios error message when no response body message', () => {
    const err = new axios.AxiosError('network error')
    expect(getErrorMessage(err)).toBe('network error')
  })

  it('returns message from Error instance', () => {
    expect(getErrorMessage(new Error('что-то сломалось'))).toBe('что-то сломалось')
  })

  it('returns "Unknown error" for unknown value', () => {
    expect(getErrorMessage('строка')).toBe('Unknown error')
    expect(getErrorMessage(null)).toBe('Unknown error')
    expect(getErrorMessage(42)).toBe('Unknown error')
  })
})
