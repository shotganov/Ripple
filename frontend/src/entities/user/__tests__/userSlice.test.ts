import userReducer, { setUser, updateUser, clearUser } from '../model/userSlice'
import type { User } from '@shared/model'

const mockUser: User = {
  id: 1,
  username: 'Тест',
  tag: 'test',
  avatar: '',
  role: 'USER',
  bio: 'Bio',
  coverImage: '',
  followersCount: 0,
  followingCount: 0,
}

describe('userSlice', () => {
  it('has null as initial state', () => {
    expect(userReducer(undefined, { type: '@@INIT' })).toBeNull()
  })

  it('setUser stores the user', () => {
    const state = userReducer(undefined, setUser(mockUser))
    expect(state).toEqual(mockUser)
  })

  it('clearUser resets state to null', () => {
    const withUser = userReducer(undefined, setUser(mockUser))
    expect(userReducer(withUser, clearUser())).toBeNull()
  })

  it('updateUser merges partial data', () => {
    const withUser = userReducer(undefined, setUser(mockUser))
    const updated = userReducer(withUser, updateUser({ username: 'Новое имя', bio: 'Новое bio' }))
    expect(updated?.username).toBe('Новое имя')
    expect(updated?.bio).toBe('Новое bio')
    expect(updated?.tag).toBe('test')
  })

  it('updateUser does nothing when state is null', () => {
    const state = userReducer(null, updateUser({ username: 'X' }))
    expect(state).toBeNull()
  })
})
