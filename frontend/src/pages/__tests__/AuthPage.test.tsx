import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@features/auth/model/authSlice'
import userReducer from '@entities/user/model/userSlice'
import { AuthPage } from '../AuthPage'

jest.mock('@features/auth', () => ({
  ...jest.requireActual('@features/auth'),
  AuthForm: ({ mode, onModeChange }: { mode: string; onModeChange: (m: string) => void }) => (
    <div>
      <div>AuthForm:{mode}</div>
      <button onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}>
        Переключить
      </button>
    </div>
  ),
}))

const makeStore = (token: string | null = null) =>
  configureStore({
    reducer: { auth: authReducer, user: userReducer },
    preloadedState: { auth: { token }, user: null },
  })

const renderPage = (token: string | null = null) =>
  render(
    <Provider store={makeStore(token)}>
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    </Provider>,
  )

describe('AuthPage', () => {
  it('renders login title by default', () => {
    renderPage()
    expect(screen.getByText('Войти')).toBeInTheDocument()
  })

  it('renders login subtitle', () => {
    renderPage()
    expect(screen.getByText('Введите логин и пароль')).toBeInTheDocument()
  })

  it('renders AuthForm in login mode', () => {
    renderPage()
    expect(screen.getByText('AuthForm:login')).toBeInTheDocument()
  })

  it('switches to register mode when AuthForm triggers onModeChange', async () => {
    renderPage()
    await userEvent.click(screen.getByText('Переключить'))
    expect(screen.getByText('Регистрация')).toBeInTheDocument()
    expect(screen.getByText('AuthForm:register')).toBeInTheDocument()
  })
})
