const VITE_API_BASE_URL = 'http://localhost:3000/api'

export const API_BASE_URL = VITE_API_BASE_URL ?? 'http://localhost:3000/api'

export const SERVER_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')

export const resolveAssetUrl = (path?: string | null): string => {
  if (!path) return ''
  if (/^(https?|blob|data):/.test(path)) return path
  return `${SERVER_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`
}
