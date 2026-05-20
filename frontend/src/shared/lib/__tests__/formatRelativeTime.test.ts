import { formatRelativeTime } from '../formatRelativeTime'

const secondsAgo = (s: number) => new Date(Date.now() - s * 1000).toISOString()
const yearsAgo = (y: number) => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - y)
  return d.toISOString()
}

describe('formatRelativeTime', () => {
  it('returns seconds label for diff < 60s', () => {
    const result = formatRelativeTime(secondsAgo(30))
    expect(result).toMatch(/^\d+с$/)
  })

  it('returns minutes label for diff 60s–3600s', () => {
    const result = formatRelativeTime(secondsAgo(120))
    expect(result).toMatch(/^\d+м$/)
  })

  it('returns hours label for diff 3600s–86400s', () => {
    const result = formatRelativeTime(secondsAgo(7200))
    expect(result).toMatch(/^\d+ч$/)
  })

  it('returns day+month for same year', () => {
    const result = formatRelativeTime(secondsAgo(86400 * 3))
    expect(result).not.toMatch(/с$|м$|ч$/)
    expect(result).not.toMatch(/\d{4}$/)
  })

  it('returns day+month+year for different year', () => {
    const result = formatRelativeTime(yearsAgo(2))
    expect(result).toMatch(/\d{4}$/)
  })

  it('returns exactly 0с for very recent', () => {
    const result = formatRelativeTime(secondsAgo(0))
    expect(result).toMatch(/^\d+с$/)
  })

  it('returns 59с for 59 seconds ago', () => {
    const result = formatRelativeTime(secondsAgo(59))
    expect(result).toBe('59с')
  })

  it('returns 1м for exactly 60 seconds ago', () => {
    const result = formatRelativeTime(secondsAgo(60))
    expect(result).toBe('1м')
  })

  it('returns 1ч for exactly 3600 seconds ago', () => {
    const result = formatRelativeTime(secondsAgo(3600))
    expect(result).toBe('1ч')
  })
})
