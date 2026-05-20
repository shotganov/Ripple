import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChatItem } from '../ui/ChatItem'
import type { Chat } from '../model/types'

const mockChat: Chat = {
  id: 1,
  companion: { id: 2, username: 'Сенека', tag: 'seneca', avatar: '' },
  lastMessage: { id: 10, content: 'Привет!', senderId: 2, isRead: false, createdAt: '2024-01-01' },
  unreadCount: 0,
}

describe('ChatItem', () => {
  it('renders companion username', () => {
    render(<ChatItem isActive={false} onClick={jest.fn()} chat={mockChat} />)
    expect(screen.getByText('Сенека')).toBeInTheDocument()
  })

  it('renders last message content', () => {
    render(<ChatItem isActive={false} onClick={jest.fn()} chat={mockChat} />)
    expect(screen.getByText('Привет!')).toBeInTheDocument()
  })

  it('renders "Нет сообщений" when no last message', () => {
    render(<ChatItem isActive={false} onClick={jest.fn()} chat={{ ...mockChat, lastMessage: null }} />)
    expect(screen.getByText('Нет сообщений')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = jest.fn()
    render(<ChatItem isActive={false} onClick={onClick} chat={mockChat} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders unread count badge when unreadCount > 0', () => {
    render(<ChatItem isActive={false} onClick={jest.fn()} chat={{ ...mockChat, unreadCount: 5 }} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders 99+ when unreadCount exceeds 99', () => {
    render(<ChatItem isActive={false} onClick={jest.fn()} chat={{ ...mockChat, unreadCount: 100 }} />)
    expect(screen.getByText('99+')).toBeInTheDocument()
  })

  it('does not render badge when unreadCount is 0', () => {
    render(<ChatItem isActive={false} onClick={jest.fn()} chat={mockChat} />)
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })
})
