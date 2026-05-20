import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../model/authSlice'
import userReducer from '@entities/user/model/userSlice'
import { AdminRoute } from '../ui/AdminRoute'
import type { User } from '@shared/model'

const makeStore = (user: User | null) =>
  configureStore({
    reducer: { auth: authReducer, user: userReducer },
    preloadedState: { auth: { token: null }, user },
  })

const adminUser: User = { id: 1, username: 'Admin', tag: 'admin', avatar: '', role: 'ADMIN' }
const regularUser: User = { id: 2, username: 'User', tag: 'user', avatar: '', role: 'USER' }

const renderWithStore = (user: User | null) =>
  render(
    <Provider store={makeStore(user)}>
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div>Admin content</div>
              </AdminRoute>
            }
          />
          <Route path="/" element={<div>Feed page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

describe('AdminRoute', () => {
  it('renders children when user is ADMIN', () => {
    renderWithStore(adminUser)
    expect(screen.getByText('Admin content')).toBeInTheDocument()
  })

  it('redirects to feed when user is regular USER', () => {
    renderWithStore(regularUser)
    expect(screen.getByText('Feed page')).toBeInTheDocument()
    expect(screen.queryByText('Admin content')).not.toBeInTheDocument()
  })

  it('redirects to feed when user is null', () => {
    renderWithStore(null)
    expect(screen.getByText('Feed page')).toBeInTheDocument()
    expect(screen.queryByText('Admin content')).not.toBeInTheDocument()
  })
})
