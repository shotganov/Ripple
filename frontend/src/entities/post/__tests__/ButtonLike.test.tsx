import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ButtonLike } from '../ui/butons/ButtonLike'

describe('ButtonLike', () => {
  it('renders like count', () => {
    render(<ButtonLike countLikes={42} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('calls onLikeClick when clicked', async () => {
    const onClick = jest.fn()
    render(<ButtonLike countLikes={0} onLikeClick={onClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('button is disabled when disabled prop is true', () => {
    render(<ButtonLike countLikes={5} disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('renders without crashing when isLiked is true', () => {
    render(<ButtonLike countLikes={10} isLiked />)
    expect(screen.getByText('10')).toBeInTheDocument()
  })
})
