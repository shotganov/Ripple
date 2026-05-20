/* eslint-disable @typescript-eslint/no-explicit-any */
import { selectUser } from '../model/selectors'
import type { User } from '@shared/model'

const mockUser: User = { id: 1, username: 'Тест', tag: 'test', avatar: '' }

describe('selectUser', () => {
  it('returns user from state', () => {
    const state = { user: mockUser, auth: { token: null } } as any
    expect(selectUser(state)).toEqual(mockUser)
  })

  it('returns null when user is not set', () => {
    const state = { user: null, auth: { token: null } } as any
    expect(selectUser(state)).toBeNull()
  })
})
