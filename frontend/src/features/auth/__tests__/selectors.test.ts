/* eslint-disable @typescript-eslint/no-explicit-any */
import { selectToken } from '../model/selectors'

describe('selectToken', () => {
  it('returns token from state', () => {
    const state = { auth: { token: 'jwt-token' }, user: null } as any
    expect(selectToken(state)).toBe('jwt-token')
  })

  it('returns null when token is not set', () => {
    const state = { auth: { token: null }, user: null } as any
    expect(selectToken(state)).toBeNull()
  })
})
