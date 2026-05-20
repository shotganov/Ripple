import {
  fetchNotificationsRequest,
  fetchUnreadCountRequest,
  markAllNotificationsReadRequest,
} from '../api/notificationsApi'

jest.mock('@shared/api', () => ({ api: { get: jest.fn(), patch: jest.fn() } }))
import { api } from '@shared/api'
const mockGet = api.get as jest.Mock
const mockPatch = api.patch as jest.Mock

beforeEach(() => { mockGet.mockClear(); mockPatch.mockClear() })

describe('notificationsApi', () => {
  it('fetchNotificationsRequest calls /notifications without params', async () => {
    mockGet.mockResolvedValue({ data: { items: [], nextCursor: null } })
    await fetchNotificationsRequest()
    expect(mockGet).toHaveBeenCalledWith('/notifications', undefined)
  })

  it('fetchNotificationsRequest passes cursor and limit', async () => {
    mockGet.mockResolvedValue({ data: { items: [], nextCursor: null } })
    await fetchNotificationsRequest(5, 20)
    expect(mockGet).toHaveBeenCalledWith('/notifications', { params: { cursor: 5, limit: 20 } })
  })

  it('fetchUnreadCountRequest calls /notifications/unread-count', async () => {
    mockGet.mockResolvedValue({ data: { count: 3 } })
    const result = await fetchUnreadCountRequest()
    expect(mockGet).toHaveBeenCalledWith('/notifications/unread-count')
    expect(result).toEqual({ count: 3 })
  })

  it('markAllNotificationsReadRequest calls PATCH /notifications/read', async () => {
    mockPatch.mockResolvedValue({ data: { count: 0 } })
    await markAllNotificationsReadRequest()
    expect(mockPatch).toHaveBeenCalledWith('/notifications/read', undefined, expect.any(Object))
  })
})
