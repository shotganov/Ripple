/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@features/auth/model/authSlice'
import userReducer from '@entities/user/model/userSlice'
import { PostsList } from '../PostsList'
import type { User } from '@shared/model'

jest.mock('@entities/post', () => ({
  PostComponent: ({ post, menu, actions }: any) => (
    <div>
      <div>Post:{post.id}</div>
      {menu}
      {actions}
    </div>
  ),
}))

jest.mock('@features/posts', () => ({
  PostActions: ({ onCommentsClick }: any) => (
    <button onClick={onCommentsClick}>PostActions</button>
  ),
  PostMenu: ({ onReport }: any) => (
    <button onClick={onReport}>PostMenu</button>
  ),
}))

jest.mock('@features/reports', () => ({
  ReportContentModal: ({ onClose }: any) => (
    <div>
      ReportModal
      <button onClick={onClose}>CloseModal</button>
    </div>
  ),
}))

const mockUser: User = { id: 1, username: 'Тест', tag: 'test', avatar: '', role: 'USER' }

const makeStore = (user = mockUser) =>
  configureStore({
    reducer: { auth: authReducer, user: userReducer },
    preloadedState: { auth: { token: 'tok' }, user },
  })

const mockPost = (id: number) => ({
  id,
  content: `Пост ${id}`,
  images: [],
  user: mockUser,
  createdAt: '2024-01-01',
  likes: 0,
  comments: 0,
  isLiked: false,
})

const renderList = (posts: any[], props?: any, user = mockUser) =>
  render(
    <Provider store={makeStore(user)}>
      <MemoryRouter>
        <PostsList posts={posts} {...props} />
      </MemoryRouter>
    </Provider>,
  )

describe('PostsList', () => {
  it('renders posts', () => {
    renderList([mockPost(1), mockPost(2)])
    expect(screen.getByText('Post:1')).toBeInTheDocument()
    expect(screen.getByText('Post:2')).toBeInTheDocument()
  })

  it('renders null for empty list', () => {
    const { container } = renderList([])
    expect(container.firstChild).toBeNull()
  })

  it('renders PostActions for each post', () => {
    renderList([mockPost(1)])
    expect(screen.getByText('PostActions')).toBeInTheDocument()
  })

  it('renders PostMenu for each post', () => {
    renderList([mockPost(1)])
    expect(screen.getByText('PostMenu')).toBeInTheDocument()
  })

  it('opens report modal when onReport is triggered', () => {
    renderList([mockPost(1)])
    expect(screen.queryByText('ReportModal')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('PostMenu'))
    expect(screen.getByText('ReportModal')).toBeInTheDocument()
  })

  it('closes report modal on onClose', () => {
    renderList([mockPost(1)])
    fireEvent.click(screen.getByText('PostMenu'))
    expect(screen.getByText('ReportModal')).toBeInTheDocument()
    fireEvent.click(screen.getByText('CloseModal'))
    expect(screen.queryByText('ReportModal')).not.toBeInTheDocument()
  })

  it('renders extra div (sentinel) when hasNextPage is true', () => {
    const { container } = renderList([mockPost(1)], { hasNextPage: true, onLoadMore: jest.fn() })
    const divs = container.querySelectorAll('div')
    expect(divs.length).toBeGreaterThan(0)
  })

  it('does not render sentinel when hasNextPage is false', () => {
    renderList([mockPost(1)], { hasNextPage: false })
    expect(screen.queryByText('LoadMore')).not.toBeInTheDocument()
  })
})
