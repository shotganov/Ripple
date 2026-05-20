import { store } from '../store'

describe('Redux store', () => {
  it('initializes with auth state containing token', () => {
    const state = store.getState()
    expect(state).toHaveProperty('auth')
    expect(state.auth).toHaveProperty('token')
  })

  it('initializes with user state', () => {
    const state = store.getState()
    expect(state).toHaveProperty('user')
  })

  it('has correct reducer keys', () => {
    const state = store.getState()
    const keys = Object.keys(state)
    expect(keys).toContain('auth')
    expect(keys).toContain('user')
  })
})
