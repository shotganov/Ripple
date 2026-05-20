/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { PostComponent } from '../ui/PostComponent'
import type { User } from '@shared/model'

jest.mock('@shared/ui', () => ({
  Avatar: ({ src }: any) => <img src={src} alt="avatar" />,
  ImagePreviewModal: ({ onClose }: any) => (
    <div>
      <div>ImagePreview</div>
      <button onClick={onClose}>Закрыть</button>
    </div>
  ),
  UnstyledLink: ({ children, to }: any) => <a href={to}>{children}</a>,
  UserInline: ({ username, tag }: any) => (
    <div>
      <span>{username}</span>
      <span>@{tag}</span>
    </div>
  ),
}))

const mockUser: User = { id: 1, username: 'Вольтер', tag: 'voltaire', avatar: '' }

const mockPost = (overrides = {}) => ({
  id: 1,
  content: 'Свобода — право делать всё что дозволено законами.',
  images: [] as string[],
  user: mockUser,
  createdAt: '2024-01-01',
  likes: 0,
  comments: 0,
  isLiked: false,
  ...overrides,
})

const renderPost = (post: any, extras?: { actions?: React.ReactNode; menu?: React.ReactNode }) =>
  render(
    <MemoryRouter>
      <PostComponent post={post} {...extras} />
    </MemoryRouter>,
  )

describe('PostComponent', () => {
  it('renders post content', () => {
    renderPost(mockPost())
    expect(screen.getByText('Свобода — право делать всё что дозволено законами.')).toBeInTheDocument()
  })

  it('renders author username', () => {
    renderPost(mockPost())
    expect(screen.getByText('Вольтер')).toBeInTheDocument()
  })

  it('renders author tag', () => {
    renderPost(mockPost())
    expect(screen.getByText('@voltaire')).toBeInTheDocument()
  })

  it('renders actions when provided', () => {
    renderPost(mockPost(), { actions: <div>Лайк</div> })
    expect(screen.getByText('Лайк')).toBeInTheDocument()
  })

  it('renders menu when provided', () => {
    renderPost(mockPost(), { menu: <button>Удалить</button> })
    expect(screen.getByText('Удалить')).toBeInTheDocument()
  })

  it('does not render images when post has no images', () => {
    renderPost(mockPost({ images: [] }))
    const imgs = document.querySelectorAll('img')
    expect(imgs.length).toBe(1) // only avatar
  })

  it('renders images when post has images', () => {
    renderPost(mockPost({ images: ['https://example.com/img.jpg'] }))
    const imgs = document.querySelectorAll('img')
    expect(imgs.length).toBeGreaterThan(1)
  })

  it('opens image preview modal when image is clicked', async () => {
    const { container } = renderPost(mockPost({ images: ['https://example.com/img.jpg'] }))
    const img = container.querySelectorAll('img')[1] // second img = post image
    await userEvent.click(img)
    expect(screen.getByText('ImagePreview')).toBeInTheDocument()
  })

  it('closes image preview modal when close button is clicked', async () => {
    const { container } = renderPost(mockPost({ images: ['https://example.com/img.jpg'] }))
    const img = container.querySelectorAll('img')[1]
    await userEvent.click(img)
    await userEvent.click(screen.getByText('Закрыть'))
    expect(screen.queryByText('ImagePreview')).not.toBeInTheDocument()
  })
})
