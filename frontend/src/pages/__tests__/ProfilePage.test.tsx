/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@features/auth/model/authSlice'
import userReducer from '@entities/user/model/userSlice'
import { ProfilePage } from '../ProfilePage'
import type { User } from '@shared/model'

jest.mock('@features/profile', () => ({
  useGetUser: () => ({ data: null, isLoading: true }),
  EditProfileModal: () => <div>EditProfileModal</div>,
}))

jest.mock('@features/posts', () => ({
  useUserPosts: () => ({ data: null, isLoading: false }),
}))

jest.mock('@widgets/profile', () => ({
  Profile: ({ user }: any) => <div>Profile:{user?.username}</div>,
  ProfileSkeleton: () => <div>ProfileSkeleton</div>,
}))

jest.mock('@widgets/posts', () => ({
  PostsList: () => <div>PostsList</div>,
}))

jest.mock('@entities/post', () => ({
  PostSkeletonList: () => <div>PostSkeletonList</div>,
}))

jest.mock('@shared/ui', () => ({
  EmptyState: ({ title }: any) => <div>{title}</div>,
  StickyTopBar: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('@shared/lib', () => ({
  plural: (n: number) => `${n}`,
}))

const mockUser: User = { id: 1, username: 'Тест', tag: 'test', avatar: '', role: 'USER' }

const makeStore = (user: User | null = mockUser) =>
  configureStore({
    reducer: { auth: authReducer, user: userReducer },
    preloadedState: { auth: { token: 'tok' }, user },
  })

const renderPage = (userId = '1', user: User | null = mockUser) =>
  render(
    <Provider store={makeStore(user)}>
      <MemoryRouter initialEntries={[`/profile/${userId}`]}>
        <Routes>
          <Route path="/profile/:id" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

describe('ProfilePage', () => {
  it('renders nothing when not logged in', () => {
    const { container } = renderPage('1', null)
    expect(container.firstChild).toBeNull()
  })

  it('renders ProfileSkeleton while loading', () => {
    renderPage()
    expect(screen.getByText('ProfileSkeleton')).toBeInTheDocument()
  })

  it('renders back button', () => {
    renderPage()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
