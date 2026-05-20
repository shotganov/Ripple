import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@features/auth/model/authSlice'
import userReducer from '@entities/user/model/userSlice'
import { SideBarNav } from '../SideBarNav'
import type { User } from '@shared/model'

const makeStore = (user: User | null) =>
  configureStore({
    reducer: { auth: authReducer, user: userReducer },
    preloadedState: { auth: { token: 'tok' }, user },
  })

const regularUser: User = { id: 5, username: 'Тест', tag: 'test', avatar: '', role: 'USER' }
const adminUser: User = { id: 1, username: 'Admin', tag: 'admin', avatar: '', role: 'ADMIN' }

const renderNav = (
  user: User | null,
  props = { notificationsCount: 0, messagesCount: 0, reportsCount: 0 },
) =>
  render(
    <Provider store={makeStore(user)}>
      <MemoryRouter>
        <SideBarNav userId={user?.id ?? 0} {...props} />
      </MemoryRouter>
    </Provider>,
  )

describe('SideBarNav', () => {
  it('renders user-only items for regular user', () => {
    renderNav(regularUser)
    expect(screen.getByText('Главная')).toBeInTheDocument()
    expect(screen.getByText('Уведомления')).toBeInTheDocument()
    expect(screen.getByText('Чаты')).toBeInTheDocument()
  })

  it('hides admin-only items for regular user', () => {
    renderNav(regularUser)
    expect(screen.queryByText('Жалобы')).not.toBeInTheDocument()
    expect(screen.queryByText('Статистика')).not.toBeInTheDocument()
  })

  it('shows admin-only items for admin user', () => {
    renderNav(adminUser)
    expect(screen.getByText('Жалобы')).toBeInTheDocument()
    expect(screen.getByText('Статистика')).toBeInTheDocument()
  })

  it('hides user-only items for admin user', () => {
    renderNav(adminUser)
    expect(screen.queryByText('Уведомления')).not.toBeInTheDocument()
    expect(screen.queryByText('Чаты')).not.toBeInTheDocument()
  })

  it('renders badge for notifications count', () => {
    renderNav(regularUser, { notificationsCount: 5, messagesCount: 0, reportsCount: 0 })
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders 99+ for badge count over 99', () => {
    renderNav(regularUser, { notificationsCount: 150, messagesCount: 0, reportsCount: 0 })
    expect(screen.getByText('99+')).toBeInTheDocument()
  })

  it('renders badge for messages count', () => {
    renderNav(regularUser, { notificationsCount: 0, messagesCount: 3, reportsCount: 0 })
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
