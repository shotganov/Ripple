// api.ts uses import.meta.env (Vite-only). In Jest this module is replaced via
// moduleNameMapper → src/test/mocks/api.ts which provides the same exports.
import { resolveAssetUrl } from '@shared/config/api'

describe('resolveAssetUrl', () => {
  it('returns empty string for undefined', () => {
    expect(resolveAssetUrl(undefined)).toBe('')
  })

  it('returns empty string for null', () => {
    expect(resolveAssetUrl(null)).toBe('')
  })

  it('returns empty string for empty string', () => {
    expect(resolveAssetUrl('')).toBe('')
  })

  it('returns http url as-is', () => {
    expect(resolveAssetUrl('http://example.com/img.png')).toBe('http://example.com/img.png')
  })

  it('returns https url as-is', () => {
    expect(resolveAssetUrl('https://res.cloudinary.com/img.jpg')).toBe(
      'https://res.cloudinary.com/img.jpg',
    )
  })

  it('returns blob url as-is', () => {
    expect(resolveAssetUrl('blob:http://localhost/abc')).toBe('blob:http://localhost/abc')
  })

  it('returns data url as-is', () => {
    expect(resolveAssetUrl('data:image/png;base64,abc')).toBe('data:image/png;base64,abc')
  })

  it('prepends server origin to absolute path (starts with /)', () => {
    const result = resolveAssetUrl('/uploads/avatar.png')
    expect(result).toMatch(/\/uploads\/avatar\.png$/)
    expect(result).not.toContain('//uploads')
  })

  it('prepends server origin with slash to relative path (no leading /)', () => {
    const result = resolveAssetUrl('uploads/avatar.png')
    expect(result).toMatch(/\/uploads\/avatar\.png$/)
  })
})
