import { getPostsRequest, getFeedRequest, getUserPostsRequest, getPostRequest } from '../api/getPostApi'

jest.mock('@shared/api', () => ({ api: { get: jest.fn() } }))
import { api } from '@shared/api'
const mockGet = api.get as jest.Mock

const fakeData = { items: [], nextCursor: null }
beforeEach(() => mockGet.mockResolvedValue({ data: fakeData }))
afterEach(() => mockGet.mockClear())

describe('getPostApi', () => {
  it('getPostsRequest calls /posts', async () => {
    await getPostsRequest()
    expect(mockGet).toHaveBeenCalledWith('/posts', undefined)
  })

  it('getPostsRequest passes cursor and limit', async () => {
    await getPostsRequest(5, 10)
    expect(mockGet).toHaveBeenCalledWith('/posts', { params: { cursor: 5, limit: 10 } })
  })

  it('getFeedRequest calls /posts/feed', async () => {
    await getFeedRequest()
    expect(mockGet).toHaveBeenCalledWith('/posts/feed', undefined)
  })

  it('getFeedRequest passes cursor', async () => {
    await getFeedRequest(3)
    expect(mockGet).toHaveBeenCalledWith('/posts/feed', { params: { cursor: 3 } })
  })

  it('getUserPostsRequest calls correct user endpoint', async () => {
    await getUserPostsRequest(42)
    expect(mockGet).toHaveBeenCalledWith('users/42/posts', undefined)
  })

  it('getPostRequest calls /posts/:id', async () => {
    mockGet.mockResolvedValue({ data: { id: 7 } })
    const result = await getPostRequest(7)
    expect(mockGet).toHaveBeenCalledWith('/posts/7')
    expect(result).toEqual({ id: 7 })
  })
})
