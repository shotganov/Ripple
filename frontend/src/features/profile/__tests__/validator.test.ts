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

  it('accepts bio exactly at 160 characters', () => {
    expect(validateProfile({ username: 'Alex', bio: 'b'.repeat(160) })).not.toHaveProperty('bio')
  })

  it('skips tag validation when tag is undefined', () => {
    expect(validateProfile({ username: 'Alex' })).not.toHaveProperty('tag')
  })

  it('rejects empty tag after trimming', () => {
    expect(validateProfile({ username: 'Alex', tag: '   ' })).toHaveProperty('tag')
  })

  it('rejects tag shorter than 3 characters', () => {
    expect(validateProfile({ username: 'Alex', tag: 'ab' })).toHaveProperty('tag')
  })

  it('rejects tag longer than 30 characters', () => {
    expect(validateProfile({ username: 'Alex', tag: 'a'.repeat(31) })).toHaveProperty('tag')
  })

  it('rejects tag with special characters', () => {
    expect(validateProfile({ username: 'Alex', tag: 'my-tag!' })).toHaveProperty('tag')
  })

  it('accepts valid tag with letters, digits and underscore', () => {
    expect(validateProfile({ username: 'Alex', tag: 'my_tag123' })).not.toHaveProperty('tag')
  })

  it('accepts tag exactly at min length (3)', () => {
    expect(validateProfile({ username: 'Alex', tag: 'abc' })).not.toHaveProperty('tag')
  })

  it('accepts tag exactly at max length (30)', () => {
    expect(validateProfile({ username: 'Alex', tag: 'a'.repeat(30) })).not.toHaveProperty('tag')
  })
})
