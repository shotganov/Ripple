import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { SearchPage } from '../SearchPage'

const emptyQuery = () => ({
  data: null, isLoading: false, isError: false, hasNextPage: false,
  isFetchingNextPage: false, fetchNextPage: jest.fn(),
})

/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@features/search', () => ({
  SearchControls: ({ query, onQueryChange, onModeChange }: any) => (
    <div>
      <input
        placeholder="поиск"
        value={query}
        onChange={e => onQueryChange(e.target.value)}
      />
      <button onClick={() => onModeChange('users')}>Люди</button>
      <button onClick={() => onModeChange('posts')}>Посты</button>
    </div>
  ),
  useSearchPosts: () => emptyQuery(),
  useSearchUsers: () => emptyQuery(),
}))

jest.mock('@widgets/search', () => ({
  EmptyResults: () => <div>EmptyResults</div>,
  UsersResults: () => <div>UsersResults</div>,
}))

jest.mock('@widgets/posts', () => ({
  PostsList: () => <div>PostsList</div>,
}))

jest.mock('@entities/post', () => ({
  PostSkeletonList: () => <div>PostSkeletonList</div>,
}))

jest.mock('@shared/lib', () => ({
  useDebouncedValue: (v: string) => v,
}))

const renderPage = () =>
  render(
    <MemoryRouter>
      <SearchPage />
    </MemoryRouter>,
  )

describe('SearchPage', () => {
  it('renders search heading', () => {
    renderPage()
    expect(screen.getByText('Поиск')).toBeInTheDocument()
  })

  it('shows empty state hint when query is empty', () => {
    renderPage()
    expect(screen.getByText('Что вам интересно?')).toBeInTheDocument()
  })

  it('renders search controls', () => {
    renderPage()
    expect(screen.getByPlaceholderText('поиск')).toBeInTheDocument()
  })

  it('switches to users mode', async () => {
    renderPage()
    await userEvent.click(screen.getByText('Люди'))
    expect(screen.getByText('Люди')).toBeInTheDocument()
  })
})
