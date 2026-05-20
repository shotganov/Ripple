import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as typeof global.TextDecoder

// jsdom does not implement IntersectionObserver
global.IntersectionObserver = class {
  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()
} as unknown as typeof IntersectionObserver

// Suppress known harmless React warnings that clutter test output
const SUPPRESSED = [
  'An empty string ("") was passed to the src attribute',
  'Warning: ReactDOM.render is no longer supported',
]

const originalError = console.error.bind(console)
console.error = (...args: unknown[]) => {
  const msg = typeof args[0] === 'string' ? args[0] : ''
  if (SUPPRESSED.some(s => msg.includes(s))) return
  originalError(...args)
}
