import { menuItems } from '../model/menuItems'
import { routes } from '@shared/config/routes'

describe('menuItems', () => {
  it('contains expected navigation items', () => {
    const labels = menuItems.map(item => item.text)
    expect(labels).toContain('Главная')
    expect(labels).toContain('Поиск')
    expect(labels).toContain('Уведомления')
    expect(labels).toContain('Чаты')
    expect(labels).toContain('Профиль')
  })

  it('contains admin-only items', () => {
    const adminItems = menuItems.filter(item => item.adminOnly)
    expect(adminItems.length).toBeGreaterThan(0)
    expect(adminItems.map(i => i.text)).toContain('Жалобы')
    expect(adminItems.map(i => i.text)).toContain('Статистика')
  })

  it('contains user-only items', () => {
    const userItems = menuItems.filter(item => item.userOnly)
    expect(userItems.length).toBeGreaterThan(0)
    expect(userItems.map(i => i.text)).toContain('Уведомления')
    expect(userItems.map(i => i.text)).toContain('Чаты')
  })

  it('home item points to feed route', () => {
    const home = menuItems.find(item => item.text === 'Главная')
    expect(home?.path).toBe(routes.feed)
  })

  it('search item points to search route', () => {
    const search = menuItems.find(item => item.text === 'Поиск')
    expect(search?.path).toBe(routes.search)
  })

  it('all items have icon and path', () => {
    menuItems.forEach(item => {
      expect(item.icon).toBeDefined()
      expect(item.path).toBeTruthy()
    })
  })
})
