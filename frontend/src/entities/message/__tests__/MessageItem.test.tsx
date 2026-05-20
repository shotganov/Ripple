import { render, screen } from '@testing-library/react'
import { MessageItem } from '../ui/MessageItem'

describe('MessageItem', () => {
  it('renders message text', () => {
    render(<MessageItem message="Привет, мир!" isMine={false} />)
    expect(screen.getByText('Привет, мир!')).toBeInTheDocument()
  })

  it('renders own message (isMine=true)', () => {
    const { container } = render(<MessageItem message="Моё сообщение" isMine={true} />)
    expect(screen.getByText('Моё сообщение')).toBeInTheDocument()
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders incoming message (isMine=false)', () => {
    const { container } = render(<MessageItem message="Чужое сообщение" isMine={false} />)
    expect(screen.getByText('Чужое сообщение')).toBeInTheDocument()
    expect(container.firstChild).toBeInTheDocument()
  })
})
