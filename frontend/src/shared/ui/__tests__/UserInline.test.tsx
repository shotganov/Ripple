import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { UserInline } from '../UserInline'

describe('UserInline', () => {
  it('renders username', () => {
    render(
      <MemoryRouter>
        <UserInline to="/profile/1" username="Сенека" tag="seneca" />
      </MemoryRouter>,
    )
    expect(screen.getByText('Сенека')).toBeInTheDocument()
  })

  it('renders tag with @ prefix', () => {
    render(
      <MemoryRouter>
        <UserInline to="/profile/1" username="Сенека" tag="seneca" />
      </MemoryRouter>,
    )
    expect(screen.getByText('@seneca')).toBeInTheDocument()
  })

  it('renders as a link', () => {
    render(
      <MemoryRouter>
        <UserInline to="/profile/1" username="Вольтер" tag="voltaire" />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link')).toBeInTheDocument()
  })
})
