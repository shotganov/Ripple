import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import authReducer from '@features/auth/model/authSlice'
import userReducer from '@entities/user/model/userSlice'
import { FeedPage } from '../FeedPage'
import type { User } from '@shared/model'

jest.mock('@features/posts', () => ({
  CreatePost: () => <div>CreatePost</div>,
  useAllPosts: () => ({ data: null, isLoading: true, hasNextPage: false, isFetchingNextPage: false, fetchNextPage: jest.fn() }),
  useFeedPosts: () => ({ data: null, isLoading: false, hasNextPage: false, isFetchingNextPage: false, fetchNextPage: jest.fn() }),
}))

jest.mock('@widgets/posts', () => ({
  PostsList: ({ posts }: { posts: unknown[] }) => <div>PostsList:{posts.length}</div>,
}))

jest.mock('@entities/post', () => ({
  PostSkeletonList: () => <div>PostSkeletonList</div>,
}))

jest.mock('@widgets/feed', () => ({
  FeedHeader: ({ onModeChange, tabs }: { onModeChange: (m: string) => void; tabs: { label: string; value: string }[] }) => (
    <div>
      {tabs.map(t => (
        <button key={t.value} onClick={() => onModeChange(t.value)}>
          {t.label}
        </button>
      ))}
    </div>
  ),
}))

const mockUser: User = { id: 1, username: 'Тест', tag: 'test', avatar: '', role: 'USER' }

const makeStore = () =>
  configureStore({
    reducer: { auth: authReducer, user: userReducer },
    preloadedState: { auth: { token: 'tok' }, user: mockUser },
  })

const renderPage = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <Provider store={makeStore()}>
        <MemoryRouter>
          <FeedPage />
        </MemoryRouter>
      </Provider>
    </QueryClientProvider>,
  )
}

describe('FeedPage', () => {
  it('renders CreatePost component', () => {
    renderPage()
    expect(screen.getByText('CreatePost')).toBeInTheDocument()
  })

  it('shows skeleton while loading', () => {
    renderPage()
    expect(screen.getByText('PostSkeletonList')).toBeInTheDocument()
  })

  it('renders feed tab buttons', () => {
    renderPage()
    expect(screen.getByText('Обзор')).toBeInTheDocument()
    expect(screen.getByText('Подписки')).toBeInTheDocument()
  })

  it('switches feed mode when tab is clicked', async () => {
    renderPage()
    await userEvent.click(screen.getByText('Подписки'))
    expect(screen.getByText('Подписки')).toBeInTheDocument()
  })
})
