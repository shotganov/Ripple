import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CommentItem } from '../ui/CommentItem'
import type { Comment } from '../model/types'

const mockComment: Comment = {
  id: 1,
  content: 'Мудро сказано!',
  user: { id: 10, username: 'Сенека', tag: 'seneca', avatar: '' },
}

const renderItem = (comment: Comment, menu?: React.ReactNode) =>
  render(
    <MemoryRouter>
      <CommentItem comment={comment} menu={menu} />
    </MemoryRouter>,
  )

describe('CommentItem', () => {
  it('renders comment content', () => {
    renderItem(mockComment)
    expect(screen.getByText('Мудро сказано!')).toBeInTheDocument()
  })

  it('renders author username', () => {
    renderItem(mockComment)
    expect(screen.getByText('Сенека')).toBeInTheDocument()
  })

  it('renders author tag', () => {
    renderItem(mockComment)
    expect(screen.getByText('@seneca')).toBeInTheDocument()
  })

  it('renders menu when provided', () => {
    renderItem(mockComment, <button>Удалить</button>)
    expect(screen.getByText('Удалить')).toBeInTheDocument()
  })

  it('renders without menu when not provided', () => {
    renderItem(mockComment)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
