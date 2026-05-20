import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { NotificationItem } from '../ui/NotificationItem'
import type { Notification } from '../model/types'

const actor = { id: 1, username: 'Сенека', tag: 'seneca', avatar: null }

const makeNotification = (overrides: Partial<Notification>): Notification => ({
  id: 1,
  type: 'LIKE',
  isRead: true,
  createdAt: '2024-01-01',
  actor,
  post: null,
  comment: null,
  ...overrides,
})

const renderItem = (notification: Notification) =>
  render(
    <MemoryRouter>
      <NotificationItem notification={notification} />
    </MemoryRouter>,
  )

describe('NotificationItem', () => {
  it('shows correct text for LIKE notification', () => {
    renderItem(makeNotification({ type: 'LIKE' }))
    expect(screen.getByText('поставил лайк на ваш пост')).toBeInTheDocument()
  })

  it('shows correct text for COMMENT notification', () => {
    renderItem(makeNotification({ type: 'COMMENT' }))
    expect(screen.getByText('оставил комментарий под вашим постом')).toBeInTheDocument()
  })

  it('shows correct text for FOLLOW notification', () => {
    renderItem(makeNotification({ type: 'FOLLOW' }))
    expect(screen.getByText('подписался на вас')).toBeInTheDocument()
  })

  it('shows actor username', () => {
    renderItem(makeNotification({}))
    expect(screen.getByText('Сенека')).toBeInTheDocument()
  })

  it('shows actor tag', () => {
    renderItem(makeNotification({}))
    expect(screen.getByText('@seneca')).toBeInTheDocument()
  })

  it('shows post content when post is present', () => {
    renderItem(
      makeNotification({
        type: 'LIKE',
        post: { id: 10, content: 'Cogito ergo sum', images: [] },
      }),
    )
    expect(screen.getByText('Cogito ergo sum')).toBeInTheDocument()
  })

  it('does not show post block when post is null', () => {
    renderItem(makeNotification({ post: null }))
    expect(screen.queryByText('Cogito ergo sum')).not.toBeInTheDocument()
  })

  it('does not show comment content in notification', () => {
    renderItem(
      makeNotification({
        type: 'COMMENT',
        comment: { id: 5, content: 'Отличная мысль!' },
      }),
    )
    expect(screen.queryByText('Отличная мысль!')).not.toBeInTheDocument()
  })
})
