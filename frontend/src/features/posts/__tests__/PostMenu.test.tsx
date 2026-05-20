/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PostMenu } from '../ui/PostMenu'

jest.mock('../hooks/usePosts', () => ({
  useDeletePost: () => ({ isPending: false, mutate: jest.fn() }),
}))

jest.mock('@shared/ui', () => ({
  DropdownMenu: ({ children }: any) => {
    const close = jest.fn()
    return <div>{typeof children === 'function' ? children(close) : children}</div>
  },
  DropdownMenuItem: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}))

jest.mock('@shared/lib', () => ({
  copyToClipboard: jest.fn().mockResolvedValue(true),
}))

describe('PostMenu', () => {
  it('renders copy link item', () => {
    render(<PostMenu postId={1} onReport={jest.fn()} />)
    expect(screen.getByText('Скопировать ссылку')).toBeInTheDocument()
  })

  it('renders report item for non-own post when showReport is true', () => {
    render(<PostMenu postId={1} isOwnPost={false} showReport onReport={jest.fn()} />)
    expect(screen.getByText('Пожаловаться')).toBeInTheDocument()
  })

  it('renders delete item for own post', () => {
    render(<PostMenu postId={1} isOwnPost onReport={jest.fn()} />)
    expect(screen.getByText('Удалить пост')).toBeInTheDocument()
  })

  it('does not render report item when showReport is false', () => {
    render(<PostMenu postId={1} isOwnPost={false} showReport={false} onReport={jest.fn()} />)
    expect(screen.queryByText('Пожаловаться')).not.toBeInTheDocument()
  })

  it('calls onReport when report item is clicked', async () => {
    const onReport = jest.fn()
    render(<PostMenu postId={1} isOwnPost={false} showReport onReport={onReport} />)
    await userEvent.click(screen.getByText('Пожаловаться'))
    expect(onReport).toHaveBeenCalledTimes(1)
  })

  it('calls copyToClipboard when copy link is clicked', async () => {
    const { copyToClipboard } = require('@shared/lib')
    render(<PostMenu postId={1} onReport={jest.fn()} />)
    await userEvent.click(screen.getByText('Скопировать ссылку'))
    expect(copyToClipboard).toHaveBeenCalled()
  })
})
