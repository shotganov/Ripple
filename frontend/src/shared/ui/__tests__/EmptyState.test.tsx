import { render, screen } from '@testing-library/react'
import { EmptyState } from '../EmptyState'

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="Нет данных" />)
    expect(screen.getByText('Нет данных')).toBeInTheDocument()
  })

  it('renders hint when provided', () => {
    render(<EmptyState title="Нет данных" hint="Попробуйте позже" />)
    expect(screen.getByText('Попробуйте позже')).toBeInTheDocument()
  })

  it('does not render hint when not provided', () => {
    render(<EmptyState title="Нет данных" />)
    expect(screen.queryByText('Попробуйте позже')).not.toBeInTheDocument()
  })
})
