import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../model/authSlice'
import userReducer from '@entities/user/model/userSlice'
import { PrivateRouter } from '../ui/PrivateRouter'

const makeStore = (token: string | null) =>
  configureStore({
    reducer: { auth: authReducer, user: userReducer },
    preloadedState: { auth: { token }, user: null },
  })

const renderWithStore = (token: string | null) =>
  render(
    <Provider store={makeStore(token)}>
      <MemoryRouter initialEntries={['/feed']}>
        <Routes>
          <Route
            path="/feed"
            element={
              <PrivateRouter>
                <div>Protected content</div>
              </PrivateRouter>
            }
          />
          <Route path="/auth" element={<div>Auth page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

describe('PrivateRouter', () => {
  it('renders children when token is present', () => {
    renderWithStore('valid-token')
    expect(screen.getByText('Protected content')).toBeInTheDocument()
  })

  it('redirects to /auth when token is null', () => {
    renderWithStore(null)
    expect(screen.getByText('Auth page')).toBeInTheDocument()
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })
})
