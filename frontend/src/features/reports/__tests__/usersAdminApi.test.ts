import { fetchAdminUsers, setUserRole, deleteAdminUser } from '../api/usersAdminApi'

jest.mock('@shared/api', () => ({
  api: {
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}))

import { api } from '@shared/api'
const mockGet = api.get as jest.Mock
const mockPatch = api.patch as jest.Mock
const mockDelete = api.delete as jest.Mock

describe('usersAdminApi', () => {
  beforeEach(() => {
    mockGet.mockClear()
    mockPatch.mockClear()
    mockDelete.mockClear()
  })

  it('fetchAdminUsers calls GET /admin/users', async () => {
    const users = [{ id: 1, username: 'Тест', tag: 'test', email: 'a@b.com', role: 'USER', avatar: null, createdAt: '2024-01-01' }]
    mockGet.mockResolvedValue({ data: users })

    const result = await fetchAdminUsers()

    expect(mockGet).toHaveBeenCalledWith('/admin/users')
    expect(result).toEqual(users)
  })

  it('setUserRole calls PATCH /admin/users/:id/role', async () => {
    mockPatch.mockResolvedValue({ data: undefined })

    await setUserRole(5, 'ADMIN')

    expect(mockPatch).toHaveBeenCalledWith('/admin/users/5/role', { role: 'ADMIN' })
  })

  it('deleteAdminUser calls DELETE /admin/users/:id', async () => {
    mockDelete.mockResolvedValue({ data: undefined })

    await deleteAdminUser(3)

    expect(mockDelete).toHaveBeenCalledWith('/admin/users/3')
  })

  it('fetchAdminUsers propagates error', async () => {
    mockGet.mockRejectedValue(new Error('Forbidden'))
    await expect(fetchAdminUsers()).rejects.toThrow('Forbidden')
  })

  it('setUserRole propagates error', async () => {
    mockPatch.mockRejectedValue(new Error('Not found'))
    await expect(setUserRole(99, 'USER')).rejects.toThrow('Not found')
  })

  it('deleteAdminUser propagates error', async () => {
    mockDelete.mockRejectedValue(new Error('Last admin'))
    await expect(deleteAdminUser(1)).rejects.toThrow('Last admin')
  })
})
