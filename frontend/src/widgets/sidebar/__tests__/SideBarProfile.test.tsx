import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { SideBarProfile } from '../SideBarProfile'
import type { User } from '@shared/model'

const mockUser: User = { id: 1, username: 'Вольтер', tag: 'voltaire', avatar: '' }

const renderProfile = (isOpen = false, onLogout = jest.fn(), onToggle = jest.fn()) =>
  render(
    <MemoryRouter>
      <SideBarProfile isOpen={isOpen} onLogout={onLogout} onToggle={onToggle} user={mockUser} />
    </MemoryRouter>,
  )

describe('SideBarProfile', () => {
  it('renders username', () => {
    renderProfile()
    expect(screen.getByText('Вольтер')).toBeInTheDocument()
  })

  it('renders tag', () => {
    renderProfile()
    expect(screen.getByText('@voltaire')).toBeInTheDocument()
  })

  it('calls onToggle when profile button is clicked', async () => {
    const onToggle = jest.fn()
    renderProfile(false, jest.fn(), onToggle)
    const buttons = screen.getAllByRole('button')
    await userEvent.click(buttons[0])
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('shows logout button when isOpen is true', () => {
    renderProfile(true)
    expect(screen.getByText(/Выйти/)).toBeInTheDocument()
  })

  it('does not show logout button when isOpen is false', () => {
    renderProfile(false)
    expect(screen.queryByText(/Выйти/)).not.toBeInTheDocument()
  })

  it('calls onLogout when logout button is clicked', async () => {
    const onLogout = jest.fn()
    renderProfile(true, onLogout)
    await userEvent.click(screen.getByText(/Выйти/))
    expect(onLogout).toHaveBeenCalledTimes(1)
  })
})
