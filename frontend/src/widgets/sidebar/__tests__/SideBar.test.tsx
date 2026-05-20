/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import authReducer from '@features/auth/model/authSlice'
import userReducer from '@entities/user/model/userSlice'
import { SideBar } from '../SideBar'
import type { User } from '@shared/model'

jest.mock('@features/notifications', () => ({
  useUnreadCount: () => ({ data: { count: 2 } }),
}))

jest.mock('@features/chats', () => ({
  useMessagesUnreadCount: () => ({ data: { count: 3 } }),
  useSocketSync: () => {},
}))

jest.mock('@features/reports', () => ({
  usePendingReportsCount: () => ({ data: { count: 0 } }),
}))

jest.mock('@features/posts', () => ({
  CreatePostModal: ({ setIsOpen }: any) => (
    <div>
      <div>CreatePostModal</div>
      <button onClick={() => setIsOpen(false)}>Закрыть</button>
    </div>
  ),
}))

const regularUser: User = { id: 5, username: 'Вольтер', tag: 'voltaire', avatar: '', role: 'USER' }
const adminUser: User = { id: 1, username: 'Admin', tag: 'admin', avatar: '', role: 'ADMIN' }

const makeStore = (user: User | null) =>
  configureStore({
    reducer: { auth: authReducer, user: userReducer },
    preloadedState: { auth: { token: 'tok' }, user },
  })

const renderSidebar = (user: User | null = regularUser, isChatsPage = false) => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <Provider store={makeStore(user)}>
        <MemoryRouter>
          <SideBar isChatsPage={isChatsPage} />
        </MemoryRouter>
      </Provider>
    </QueryClientProvider>,
  )
}

describe('SideBar', () => {
  it('renders nothing when user is null', () => {
    const { container } = renderSidebar(null)
    expect(container.firstChild).toBeNull()
  })

  it('renders for regular user', () => {
    renderSidebar(regularUser)
    expect(screen.getByText('Вольтер')).toBeInTheDocument()
  })

  it('renders user navigation items', () => {
    renderSidebar(regularUser)
    expect(screen.getByText('Главная')).toBeInTheDocument()
  })

  it('renders admin navigation items for admin', () => {
    renderSidebar(adminUser)
    expect(screen.getByText('Жалобы')).toBeInTheDocument()
  })

  it('renders create post button for regular user', () => {
    renderSidebar(regularUser)
    expect(screen.getByText('Пост')).toBeInTheDocument()
  })

  it('opens CreatePostModal when create button is clicked', async () => {
    renderSidebar(regularUser)
    const createButton = screen.getByText('Пост')
    await userEvent.click(createButton)
    expect(screen.getByText('CreatePostModal')).toBeInTheDocument()
  })

  it('renders profile menu button', () => {
    renderSidebar(regularUser)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('dispatches clearToken and clearUser on logout', async () => {
    renderSidebar(regularUser)
    await userEvent.click(screen.getByText('Вольтер'))
    const logoutBtn = screen.getByText(/Выйти/)
    await userEvent.click(logoutBtn)
    expect(screen.queryByText('Вольтер')).not.toBeInTheDocument()
  })
})
