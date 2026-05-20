import { fetchMetricsSummary } from '../api/metricsApi'
import { fetchAdminStatsRequest } from '../api/statsApi'

jest.mock('@shared/api', () => ({
  api: {
    get: jest.fn(),
  },
}))

import { api } from '@shared/api'
const mockGet = api.get as jest.Mock

describe('metricsApi', () => {
  beforeEach(() => mockGet.mockClear())

  it('fetchMetricsSummary calls GET /admin/metrics/summary', async () => {
    const summary = {
      http: { totalRequests: 100, totalErrors: 2, cpuUsage: 30, avgDurationMs: 50 },
      activity: { postsCreated: 5, commentsCreated: 10, likesGiven: 20, messagesSent: 3 },
      realtime: { wsConnections: 7 },
    }
    mockGet.mockResolvedValue({ data: summary })

    const result = await fetchMetricsSummary()

    expect(mockGet).toHaveBeenCalledWith('/admin/metrics/summary')
    expect(result).toEqual(summary)
  })

  it('fetchMetricsSummary propagates error', async () => {
    mockGet.mockRejectedValue(new Error('Unauthorized'))
    await expect(fetchMetricsSummary()).rejects.toThrow('Unauthorized')
  })
})

describe('statsApi', () => {
  beforeEach(() => mockGet.mockClear())

  it('fetchAdminStatsRequest calls GET /admin/stats', async () => {
    const stats = {
      users: 10, posts: 5, comments: 20, likes: 50, follows: 8,
      postsByDay: [], commentsByDay: [], likesByDay: [], usersByDay: [],
    }
    mockGet.mockResolvedValue({ data: stats })

    const result = await fetchAdminStatsRequest()

    expect(mockGet).toHaveBeenCalledWith('/admin/stats')
    expect(result).toEqual(stats)
  })

  it('fetchAdminStatsRequest propagates error', async () => {
    mockGet.mockRejectedValue(new Error('Server error'))
    await expect(fetchAdminStatsRequest()).rejects.toThrow('Server error')
  })
})
