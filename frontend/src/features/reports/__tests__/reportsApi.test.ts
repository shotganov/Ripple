import { createReportRequest, listReportsRequest, dismissByTargetRequest } from '../api/reportsApi'

jest.mock('@shared/api', () => ({ api: { get: jest.fn(), post: jest.fn(), patch: jest.fn() } }))
import { api } from '@shared/api'
const mockGet = api.get as jest.Mock
const mockPost = api.post as jest.Mock
const mockPatch = api.patch as jest.Mock

beforeEach(() => { mockGet.mockClear(); mockPost.mockClear(); mockPatch.mockClear() })

describe('reportsApi', () => {
  it('createReportRequest calls POST /reports', async () => {
    mockPost.mockResolvedValue({ data: {} })
    await createReportRequest({ reason: 'SPAM', postId: 1 })
    expect(mockPost).toHaveBeenCalledWith('/reports', { reason: 'SPAM', postId: 1 })
  })

  it('listReportsRequest calls GET /admin/reports', async () => {
    mockGet.mockResolvedValue({ data: { items: [], total: 0, offset: 0, limit: 20 } })
    await listReportsRequest()
    expect(mockGet).toHaveBeenCalledWith('/admin/reports', expect.any(Object))
  })

  it('listReportsRequest passes offset and status filter', async () => {
    mockGet.mockResolvedValue({ data: { items: [], total: 0, offset: 20, limit: 20 } })
    await listReportsRequest(20, 20, { status: 'PENDING' })
    const call = mockGet.mock.calls[0][1]
    expect(call.params.offset).toBe(20)
    expect(call.params.status).toBe('PENDING')
  })

  it('dismissByTargetRequest calls PATCH /admin/reports/:type/:targetId/dismiss', async () => {
    mockPatch.mockResolvedValue({ data: {} })
    await dismissByTargetRequest('post', 5)
    expect(mockPatch).toHaveBeenCalledWith('/admin/reports/post/5/dismiss')
  })
})
