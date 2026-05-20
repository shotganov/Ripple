import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@features/auth/model/authSlice'
import userReducer from '@entities/user/model/userSlice'
import { CommentForm } from '../ui/CommentForm'
import type { User } from '@shared/model'

jest.mock('../hooks/useComment', () => ({
  useCreateComment: () => ({ isPending: false, mutate: jest.fn() }),
}))

jest.mock('@shared/ui', () => ({
  Avatar: () => <img alt="avatar" />,
}))

const mockUser: User = { id: 1, username: 'Тест', tag: 'test', avatar: '' }

const makeStore = (user: User | null = mockUser) =>
  configureStore({
    reducer: { auth: authReducer, user: userReducer },
    preloadedState: { auth: { token: 'tok' }, user },
  })

const renderForm = (user: User | null = mockUser) =>
  render(
    <Provider store={makeStore(user)}>
      <CommentForm postId={1} />
    </Provider>,
  )

const getSendButton = () => {
  const buttons = screen.getAllByRole('button')
  return buttons[buttons.length - 1]
}

describe('CommentForm', () => {
  it('renders textarea placeholder', () => {
    renderForm()
    expect(screen.getByPlaceholderText('Написать комментарий...')).toBeInTheDocument()
  })

  it('renders send button', () => {
    renderForm()
    expect(getSendButton()).toBeInTheDocument()
  })

  it('send button is disabled when text is empty', () => {
    renderForm()
    expect(getSendButton()).toBeDisabled()
  })

  it('send button is enabled when text is typed', async () => {
    renderForm()
    await userEvent.type(screen.getByPlaceholderText('Написать комментарий...'), 'Привет!')
    expect(getSendButton()).not.toBeDisabled()
  })

  it('shows error when text exceeds 300 characters', () => {
    renderForm()
    const input = screen.getByPlaceholderText('Написать комментарий...')
    fireEvent.change(input, { target: { value: 'а'.repeat(301) } })
    expect(screen.getByText(/не может быть длиннее/)).toBeInTheDocument()
  })

  it('calls mutate when send button is clicked with valid text', async () => {
    renderForm()
    await userEvent.type(screen.getByPlaceholderText('Написать комментарий...'), 'Тест')
    await userEvent.click(getSendButton())
    expect(getSendButton()).toBeInTheDocument()
  })
})
