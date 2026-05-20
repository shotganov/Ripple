/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommentMenu } from '../ui/CommentMenu'

jest.mock('../hooks/useComment', () => ({
  useDeleteComment: () => ({ isPending: false, mutate: jest.fn() }),
}))

jest.mock('@shared/ui', () => ({
  DropdownMenu: ({ children }: any) => <div>{children(jest.fn())}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}))

describe('CommentMenu', () => {
  it('renders delete button for own comment', () => {
    render(<CommentMenu postId={1} commentId={1} isOwnComment onReport={jest.fn()} />)
    expect(screen.getByText('Удалить комментарий')).toBeInTheDocument()
  })

  it('renders report button for non-own comment', () => {
    render(<CommentMenu postId={1} commentId={1} isOwnComment={false} showReport onReport={jest.fn()} />)
    expect(screen.getByText('Пожаловаться')).toBeInTheDocument()
  })

  it('does not render report when showReport is false', () => {
    render(<CommentMenu postId={1} commentId={1} isOwnComment={false} showReport={false} onReport={jest.fn()} />)
    expect(screen.queryByText('Пожаловаться')).not.toBeInTheDocument()
  })

  it('calls onReport when report button is clicked', async () => {
    const onReport = jest.fn()
    render(<CommentMenu postId={1} commentId={1} isOwnComment={false} showReport onReport={onReport} />)
    await userEvent.click(screen.getByText('Пожаловаться'))
    expect(onReport).toHaveBeenCalledTimes(1)
  })

  it('calls deleteComment.mutate when delete is clicked', async () => {
    const mutate = jest.fn()
    jest.spyOn(require('../hooks/useComment'), 'useDeleteComment').mockReturnValue({ isPending: false, mutate })
    render(<CommentMenu postId={1} commentId={42} isOwnComment onReport={jest.fn()} />)
    await userEvent.click(screen.getByText('Удалить комментарий'))
    expect(mutate).toHaveBeenCalledWith(42)
  })
})
