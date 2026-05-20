import { loginRequest, registerRequest } from '../api/authApi'

jest.mock('@shared/api', () => ({
  api: {
    post: jest.fn(),
  },
}))

import { api } from '@shared/api'
const mockPost = api.post as jest.Mock

describe('authApi', () => {
  beforeEach(() => mockPost.mockClear())

  it('loginRequest calls POST /auth/login with credentials', async () => {
    const fakeResponse = { data: { token: 'tok', user: { id: 1 } } }
    mockPost.mockResolvedValue(fakeResponse)

    const result = await loginRequest({ email: 'a@b.com', password: 'pass' })

    expect(mockPost).toHaveBeenCalledWith('/auth/login', { email: 'a@b.com', password: 'pass' })
    expect(result).toEqual(fakeResponse.data)
  })

  it('registerRequest calls POST /auth/register with credentials', async () => {
    const fakeResponse = { data: { token: 'tok2', user: { id: 2 } } }
    mockPost.mockResolvedValue(fakeResponse)

    const result = await registerRequest({ email: 'c@d.com', password: 'pass2', tag: 'user' })

    expect(mockPost).toHaveBeenCalledWith('/auth/register', expect.objectContaining({ email: 'c@d.com' }))
    expect(result).toEqual(fakeResponse.data)
  })

  it('loginRequest propagates error on failure', async () => {
    mockPost.mockRejectedValue(new Error('Network error'))
    await expect(loginRequest({ email: 'a@b.com', password: 'bad' })).rejects.toThrow('Network error')
  })
})
