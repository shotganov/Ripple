import authReducer, { setToken, clearToken } from '../model/authSlice'

describe('authSlice', () => {
  it('has null token as initial state', () => {
    expect(authReducer(undefined, { type: '@@INIT' })).toEqual({ token: null })
  })

  it('setToken stores the token', () => {
    const state = authReducer(undefined, setToken('abc123'))
    expect(state.token).toBe('abc123')
  })

  it('clearToken resets token to null', () => {
    const withToken = authReducer(undefined, setToken('abc123'))
    const cleared = authReducer(withToken, clearToken())
    expect(cleared.token).toBeNull()
  })

  it('setToken overwrites existing token', () => {
    const first = authReducer(undefined, setToken('old'))
    const second = authReducer(first, setToken('new'))
    expect(second.token).toBe('new')
  })
})
