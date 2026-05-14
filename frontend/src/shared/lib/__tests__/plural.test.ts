import { plural } from '../plural'

const forms = {
  one: 'one',
  few: 'few',
  many: 'many',
}

describe('plural', () => {
  it('returns singular form for counts ending with one', () => {
    expect(plural(1, forms)).toBe('one')
    expect(plural(21, forms)).toBe('one')
  })

  it('returns few form for russian plural rule', () => {
    expect(plural(2, forms)).toBe('few')
    expect(plural(24, forms)).toBe('few')
  })

  it('returns many form for zero and teen counts', () => {
    expect(plural(0, forms)).toBe('many')
    expect(plural(11, forms)).toBe('many')
  })

  it('falls back to many form for unsupported plural categories', () => {
    expect(plural(1.5, forms)).toBe('many')
  })
})
