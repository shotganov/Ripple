import { getCommentsRequest } from '../api/getCommentsApi'

jest.mock('@shared/api', () => ({ api: { get: jest.fn() } }))
import { api } from '@shared/api'
const mockGet = api.get as jest.Mock

beforeEach(() => mockGet.mockClear())

describe('getCommentsApi', () => {
  it('getCommentsRequest calls correct endpoint', async () => {
    mockGet.mockResolvedValue({ data: { items: [], nextCursor: null } })
    const result = await getCommentsRequest(1)
    expect(mockGet).toHaveBeenCalledWith('/posts/1/comments', undefined)
    expect(result).toEqual({ items: [], nextCursor: null })
  })

  it('getCommentsRequest passes cursor and limit as params', async () => {
    mockGet.mockResolvedValue({ data: { items: [], nextCursor: null } })
    await getCommentsRequest(1, 10, 20)
    expect(mockGet).toHaveBeenCalledWith('/posts/1/comments', { params: { cursor: 10, limit: 20 } })
  })

  it('getCommentsRequest passes only provided params', async () => {
    mockGet.mockResolvedValue({ data: { items: [], nextCursor: null } })
    await getCommentsRequest(1, undefined, 15)
    expect(mockGet).toHaveBeenCalledWith('/posts/1/comments', { params: { limit: 15 } })
  })
})
