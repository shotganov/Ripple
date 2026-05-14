import { validateProfile } from '../validator'

describe('validateProfile', () => {
  it('accepts valid profile data', () => {
    expect(validateProfile({ username: 'Alex', bio: 'Hello' })).toEqual({})
  })

  it('rejects empty username after trimming', () => {
    expect(validateProfile({ username: '   ' })).toHaveProperty('username')
  })

  it('rejects username longer than 50 characters', () => {
    expect(validateProfile({ username: 'a'.repeat(51) })).toHaveProperty('username')
  })

  it('rejects bio longer than 160 characters', () => {
    expect(validateProfile({ username: 'Alex', bio: 'b'.repeat(161) })).toHaveProperty('bio')
  })
})
