/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@features/auth/model/authSlice'
import userReducer from '@entities/user/model/userSlice'
import { PostPage } from '../PostPage'
import type { User } from '@shared/model'

jest.mock('@features/posts', () => ({
  usePost: () => ({ data: null, isLoading: true }),
  PostActions: () => <div>PostActions</div>,
  PostMenu: () => <div>PostMenu</div>,
}))

jest.mock('@features/comments', () => ({
  useComments: () => ({ data: null, isLoading: false }),
  CommentForm: () => <div>CommentForm</div>,
  CommentMenu: () => <div>CommentMenu</div>,
}))

jest.mock('@features/reports', () => ({
  ReportContentModal: () => <div>ReportModal</div>,
}))

jest.mock('@entities/post', () => ({
  PostComponent: ({ post }: any) => <div>PostComponent:{post?.id}</div>,
  PostSkeleton: () => <div>PostSkeleton</div>,
}))

jest.mock('@entities/comment', () => ({
  CommentsList: () => <div>CommentsList</div>,
  CommentSkeletonList: () => <div>CommentSkeletonList</div>,
}))

jest.mock('@shared/ui', () => ({
  EmptyState: ({ title }: any) => <div>{title}</div>,
  StickyTopBar: ({ children }: any) => <div>{children}</div>,
}))

const mockUser: User = { id: 1, username: 'Тест', tag: 'test', avatar: '', role: 'USER' }

const makeStore = () =>
  configureStore({
    reducer: { auth: authReducer, user: userReducer },
    preloadedState: { auth: { token: 'tok' }, user: mockUser },
  })

const renderPage = (postId = '42') =>
  render(
    <Provider store={makeStore()}>
      <MemoryRouter initialEntries={[`/post/${postId}`]}>
        <Routes>
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/" element={<div>Feed</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

describe('PostPage', () => {
  it('renders page heading', () => {
    renderPage()
    expect(screen.getByText('Пост')).toBeInTheDocument()
  })

  it('shows skeleton while loading', () => {
    renderPage()
    expect(screen.getByText('PostSkeleton')).toBeInTheDocument()
  })

  it('renders CommentForm', () => {
    renderPage()
    expect(screen.getByText('CommentForm')).toBeInTheDocument()
  })

  it('renders back button', () => {
    renderPage()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('clicking back button triggers navigation without crash', async () => {
    renderPage()
    const btn = screen.getByRole('button')
    await userEvent.click(btn)
    // navigated away — page shows Feed route
    expect(screen.getByText('Feed')).toBeInTheDocument()
  })
})
