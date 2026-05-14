import { useEffect } from 'react'

type LockVariant = 'plain' | 'dim' | 'fullscreen'

export const useLockBodyScroll = (enabled = true, variant: LockVariant = 'plain') => {
  useEffect(() => {
    if (!enabled) return

    const html = document.documentElement
    const previousOverflow = html.style.overflow
    const previousGutter = html.style.scrollbarGutter

    html.style.overflow = 'hidden'

    if (variant === 'dim') {
      html.classList.add('lock-dim')
    } else if (variant === 'fullscreen') {
      html.style.scrollbarGutter = 'auto'
    }

    return () => {
      html.style.overflow = previousOverflow
      html.style.scrollbarGutter = previousGutter
      html.classList.remove('lock-dim')
    }
  }, [enabled, variant])
}
