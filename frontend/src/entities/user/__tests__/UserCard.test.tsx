import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { UserCard } from '../ui/UserCard'
import type { User } from '@shared/model'

const mockUser: User = { id: 1, username: 'Вольтер', tag: 'voltaire', avatar: 'https://example.com/a.jpg' }
const userNoAvatar: User = { id: 2, username: 'Сенека', tag: 'seneca', avatar: '' }

const render_ = (user: User, props?: Partial<React.ComponentProps<typeof UserCard>>) =>
  render(<MemoryRouter><UserCard user={user} {...props} /></MemoryRouter>)

describe('UserCard', () => {
  it('renders username', () => {
    render_(mockUser)
    expect(screen.getByText('Вольтер')).toBeInTheDocument()
  })

  it('renders tag with @ prefix', () => {
    render_(mockUser)
    expect(screen.getByText('@voltaire')).toBeInTheDocument()
  })

  it('renders as a link', () => {
    render_(mockUser)
    expect(screen.getByRole('link')).toBeInTheDocument()
  })

  it('renders with default avatar when avatar is empty', () => {
    const { container } = render_(userNoAvatar)
    const img = container.querySelector('img')
    expect(img).toBeInTheDocument()
  })

  it('renders with custom sizeAvatar', () => {
    const { container } = render_(mockUser, { sizeAvatar: 64 })
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders with isBorder prop', () => {
    const { container } = render_(mockUser, { isBorder: true })
    expect(container.firstChild).toBeInTheDocument()
  })
})
