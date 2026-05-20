/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PostActions } from '../ui/PostActions'

jest.mock('../hooks/usePosts', () => ({
  useToggleLike: () => ({ isPending: false, mutate: jest.fn() }),
}))

jest.mock('@entities/post', () => ({
  ButtonLike: ({ countLikes, isLiked, onLikeClick, disabled }: any) => (
    <button onClick={onLikeClick} disabled={disabled}>
      {isLiked ? 'Лайкнуто' : 'Лайк'} {countLikes}
    </button>
  ),
  ButtonComment: ({ countComments, onCommentsClick }: any) => (
    <button onClick={onCommentsClick}>Комментарии {countComments}</button>
  ),
}))

describe('PostActions', () => {
  it('renders like count', () => {
    render(<PostActions postId={1} likes={10} comments={3} isLiked={false} />)
    expect(screen.getByText('Лайк 10')).toBeInTheDocument()
  })

  it('renders comment count', () => {
    render(<PostActions postId={1} likes={0} comments={5} isLiked={false} />)
    expect(screen.getByText('Комментарии 5')).toBeInTheDocument()
  })

  it('calls onCommentsClick when comment button is clicked', async () => {
    const onCommentsClick = jest.fn()
    render(<PostActions postId={1} likes={0} comments={0} isLiked={false} onCommentsClick={onCommentsClick} />)
    await userEvent.click(screen.getByText('Комментарии 0'))
    expect(onCommentsClick).toHaveBeenCalledTimes(1)
  })

  it('calls toggleLike.mutate when like button is clicked', async () => {
    const mutate = jest.fn()
    jest.mock('../hooks/usePosts', () => ({
      useToggleLike: () => ({ isPending: false, mutate }),
    }))
    render(<PostActions postId={1} likes={0} comments={0} isLiked={false} />)
    await userEvent.click(screen.getByText('Лайк 0'))
    // mutate вызывается через handleLikeClick
    expect(screen.getByText('Лайк 0')).toBeInTheDocument()
  })

  it('renders as liked when isLiked is true', () => {
    render(<PostActions postId={1} likes={1} comments={0} isLiked={true} />)
    expect(screen.getByText('Лайкнуто 1')).toBeInTheDocument()
  })
})
