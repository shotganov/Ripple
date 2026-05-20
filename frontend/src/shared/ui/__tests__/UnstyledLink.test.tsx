import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { UnstyledLink } from '../UnstyledLink'

describe('UnstyledLink', () => {
  it('renders children', () => {
    render(
      <MemoryRouter>
        <UnstyledLink to="/profile/1">Профиль</UnstyledLink>
      </MemoryRouter>,
    )
    expect(screen.getByText('Профиль')).toBeInTheDocument()
  })

  it('renders as an anchor element', () => {
    render(
      <MemoryRouter>
        <UnstyledLink to="/feed">Лента</UnstyledLink>
      </MemoryRouter>,
    )
    expect(screen.getByRole('link')).toBeInTheDocument()
  })

  it('href contains the target path', () => {
    render(
      <MemoryRouter>
        <UnstyledLink to="/search">Поиск</UnstyledLink>
      </MemoryRouter>,
    )
    const link = screen.getByRole('link') as HTMLAnchorElement
    expect(link.href).toContain('/search')
  })
})
