import { patchUserRequest } from '../api/profileApi'

jest.mock('@shared/api', () => ({ api: { patch: jest.fn() } }))
import { api } from '@shared/api'
const mockPatch = api.patch as jest.Mock

beforeEach(() => mockPatch.mockResolvedValue({ data: { id: 1 } }))
afterEach(() => mockPatch.mockClear())

describe('profileApi', () => {
  it('patchUserRequest calls PATCH /users/me with FormData', async () => {
    await patchUserRequest({ username: 'Новое имя' })
    expect(mockPatch).toHaveBeenCalledWith('/users/me', expect.any(FormData))
  })

  it('patchUserRequest includes username in FormData', async () => {
    await patchUserRequest({ username: 'Вольтер' })
    const formData: FormData = mockPatch.mock.calls[0][1]
    expect(formData.get('username')).toBe('Вольтер')
  })

  it('patchUserRequest includes bio in FormData', async () => {
    await patchUserRequest({ bio: 'Философ' })
    const formData: FormData = mockPatch.mock.calls[0][1]
    expect(formData.get('bio')).toBe('Философ')
  })

  it('patchUserRequest includes tag in FormData', async () => {
    await patchUserRequest({ tag: 'voltaire' })
    const formData: FormData = mockPatch.mock.calls[0][1]
    expect(formData.get('tag')).toBe('voltaire')
  })

  it('patchUserRequest does not include undefined fields', async () => {
    await patchUserRequest({})
    const formData: FormData = mockPatch.mock.calls[0][1]
    expect(formData.get('username')).toBeNull()
  })
})
