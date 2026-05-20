import { routes, routePatterns } from '../routes'

describe('routes', () => {
  it('profile builds correct path for numeric id', () => {
    expect(routes.profile(42)).toBe('/profile/42')
  })

  it('profile builds correct path for string id', () => {
    expect(routes.profile('me')).toBe('/profile/me')
  })

  it('post builds correct path', () => {
    expect(routes.post(7)).toBe('/post/7')
  })

  it('chatWith builds correct query string', () => {
    expect(routes.chatWith(5)).toBe('/chat?peer=5')
  })

  it('static routes have correct values', () => {
    expect(routes.feed).toBe('/')
    expect(routes.auth).toBe('/auth')
    expect(routes.search).toBe('/search')
    expect(routes.chat).toBe('/chat')
    expect(routes.notifications).toBe('/notifications')
  })
})

describe('routePatterns', () => {
  it('profile pattern contains :id', () => {
    expect(routePatterns.profile).toContain(':id')
  })

  it('post pattern contains :id', () => {
    expect(routePatterns.post).toContain(':id')
  })
})
