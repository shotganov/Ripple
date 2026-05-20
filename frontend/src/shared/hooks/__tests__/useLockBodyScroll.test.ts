import { renderHook } from '@testing-library/react'
import { useLockBodyScroll } from '../useLockBodyScroll'

describe('useLockBodyScroll', () => {
  beforeEach(() => {
    document.documentElement.style.overflow = ''
    document.documentElement.classList.remove('lock-dim')
  })

  it('sets overflow hidden on html when enabled', () => {
    renderHook(() => useLockBodyScroll(true))
    expect(document.documentElement.style.overflow).toBe('hidden')
  })

  it('does not change overflow when disabled', () => {
    renderHook(() => useLockBodyScroll(false))
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('adds lock-dim class when variant is dim', () => {
    renderHook(() => useLockBodyScroll(true, 'dim'))
    expect(document.documentElement.classList.contains('lock-dim')).toBe(true)
  })

  it('does not add lock-dim class when variant is plain', () => {
    renderHook(() => useLockBodyScroll(true, 'plain'))
    expect(document.documentElement.classList.contains('lock-dim')).toBe(false)
  })

  it('restores overflow on unmount', () => {
    document.documentElement.style.overflow = 'auto'
    const { unmount } = renderHook(() => useLockBodyScroll(true))
    expect(document.documentElement.style.overflow).toBe('hidden')
    unmount()
    expect(document.documentElement.style.overflow).toBe('auto')
  })

  it('removes lock-dim class on unmount', () => {
    const { unmount } = renderHook(() => useLockBodyScroll(true, 'dim'))
    expect(document.documentElement.classList.contains('lock-dim')).toBe(true)
    unmount()
    expect(document.documentElement.classList.contains('lock-dim')).toBe(false)
  })
})
