import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchControls } from '../ui/SearchControls'

describe('SearchControls', () => {
  it('renders both filter buttons', () => {
    render(
      <SearchControls query="" onQueryChange={jest.fn()} mode="posts" onModeChange={jest.fn()} />,
    )
    expect(screen.getByText('Посты')).toBeInTheDocument()
    expect(screen.getByText('Люди')).toBeInTheDocument()
  })

  it('calls onModeChange with "users" when Люди is clicked', async () => {
    const onModeChange = jest.fn()
    render(
      <SearchControls query="" onQueryChange={jest.fn()} mode="posts" onModeChange={onModeChange} />,
    )
    await userEvent.click(screen.getByText('Люди'))
    expect(onModeChange).toHaveBeenCalledWith('users')
  })

  it('calls onModeChange with "posts" when Посты is clicked', async () => {
    const onModeChange = jest.fn()
    render(
      <SearchControls
        query=""
        onQueryChange={jest.fn()}
        mode="users"
        onModeChange={onModeChange}
      />,
    )
    await userEvent.click(screen.getByText('Посты'))
    expect(onModeChange).toHaveBeenCalledWith('posts')
  })

  it('shows users placeholder when mode is users', () => {
    render(
      <SearchControls query="" onQueryChange={jest.fn()} mode="users" onModeChange={jest.fn()} />,
    )
    expect(screen.getByPlaceholderText('Поиск пользователей...')).toBeInTheDocument()
  })

  it('shows posts placeholder when mode is posts', () => {
    render(
      <SearchControls query="" onQueryChange={jest.fn()} mode="posts" onModeChange={jest.fn()} />,
    )
    expect(screen.getByPlaceholderText('Поиск постов...')).toBeInTheDocument()
  })
})
