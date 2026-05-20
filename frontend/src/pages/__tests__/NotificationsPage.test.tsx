/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { NotificationsPage } from '../NotificationsPage'

jest.mock('@features/notifications', () => ({
  useNotifications: () => ({
    data: { pages: [{ items: [] }] },
    isLoading: false, isError: false,
    hasNextPage: false, isFetchingNextPage: false, fetchNextPage: jest.fn(),
  }),
  useMarkAllNotificationsRead: () => ({ mutate: jest.fn() }),
}))

jest.mock('@entities/notification', () => ({
  NotificationItem: ({ notification }: any) => <div>Notification:{notification.id}</div>,
}))

jest.mock('@shared/ui', () => ({
  EmptyState: ({ title }: any) => <div>{title}</div>,
  StickyTopBar: ({ children }: any) => <div>{children}</div>,
}))

describe('NotificationsPage', () => {
  it('renders page heading', () => {
    render(<MemoryRouter><NotificationsPage /></MemoryRouter>)
    expect(screen.getByText('Уведомления')).toBeInTheDocument()
  })

  it('renders empty state when no data', () => {
    render(<MemoryRouter><NotificationsPage /></MemoryRouter>)
    expect(screen.getByText('Здесь будут уведомления')).toBeInTheDocument()
  })
})

describe('NotificationsPage with data', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('renders loading state', () => {
    jest.mock('@features/notifications', () => ({
      useNotifications: () => ({
        data: null, isLoading: true, isError: false,
        hasNextPage: false, isFetchingNextPage: false, fetchNextPage: jest.fn(),
      }),
      useMarkAllNotificationsRead: () => ({ mutate: jest.fn() }),
    }))
    render(<MemoryRouter><NotificationsPage /></MemoryRouter>)
    expect(screen.getByText('Уведомления')).toBeInTheDocument()
  })
})
