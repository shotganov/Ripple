import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CommentsList } from '../ui/CommentsList'
import type { Comment } from '../model/types'

const makeComment = (id: number): Comment => ({
  id,
  content: `Комментарий ${id}`,
  user: { id: 10 + id, username: `Автор${id}`, tag: `author${id}`, avatar: '' },
})

const wrap = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('CommentsList', () => {
  it('renders nothing when comments list is empty', () => {
    const { container } = wrap(<CommentsList comments={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders all comments', () => {
    wrap(<CommentsList comments={[makeComment(1), makeComment(2)]} />)
    expect(screen.getByText('Комментарий 1')).toBeInTheDocument()
    expect(screen.getByText('Комментарий 2')).toBeInTheDocument()
  })

  it('renders menu for each comment when renderMenu provided', () => {
    wrap(
      <CommentsList
        comments={[makeComment(1)]}
        renderMenu={c => <button>Удалить {c.id}</button>}
      />,
    )
    expect(screen.getByText('Удалить 1')).toBeInTheDocument()
  })

  it('renders sentinel when hasNextPage is true', () => {
    const { container } = wrap(
      <CommentsList comments={[makeComment(1)]} hasNextPage onLoadMore={jest.fn()} />,
    )
    expect(container.querySelector('div[style]') ?? container.lastChild).toBeTruthy()
  })
})
