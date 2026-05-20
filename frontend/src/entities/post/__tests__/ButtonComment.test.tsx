import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ButtonComment } from '../ui/butons/ButtonComment'

describe('ButtonComment', () => {
  it('renders comment count', () => {
    render(<ButtonComment countComments={5} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders zero count', () => {
    render(<ButtonComment countComments={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('calls onCommentsClick when clicked', async () => {
    const onClick = jest.fn()
    render(<ButtonComment countComments={3} onCommentsClick={onClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not throw when onCommentsClick is not provided', async () => {
    render(<ButtonComment countComments={1} />)
    await userEvent.click(screen.getByRole('button'))
  })
})
