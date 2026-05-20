import {
  listChatsRequest,
  findChatWithPeerRequest,
  listMessagesRequest,
  sendMessageRequest,
  markChatReadRequest,
  fetchMessagesUnreadCountRequest,
} from '../api/chatsApi'

jest.mock('@shared/api', () => ({ api: { get: jest.fn(), post: jest.fn(), patch: jest.fn() } }))
import { api } from '@shared/api'
const mockGet = api.get as jest.Mock
const mockPost = api.post as jest.Mock
const mockPatch = api.patch as jest.Mock

const empty = { data: {} }
beforeEach(() => { mockGet.mockResolvedValue(empty); mockPost.mockResolvedValue(empty); mockPatch.mockResolvedValue(empty) })
afterEach(() => { mockGet.mockClear(); mockPost.mockClear(); mockPatch.mockClear() })

describe('chatsApi', () => {
  it('listChatsRequest calls /chats', async () => {
    await listChatsRequest()
    expect(mockGet).toHaveBeenCalledWith('/chats', undefined)
  })

  it('listChatsRequest passes search param', async () => {
    await listChatsRequest(undefined, undefined, 'Сенека')
    expect(mockGet).toHaveBeenCalledWith('/chats', { params: { search: 'Сенека' } })
  })

  it('findChatWithPeerRequest calls /chats/with/:peerId', async () => {
    await findChatWithPeerRequest(3)
    expect(mockGet).toHaveBeenCalledWith('/chats/with/3')
  })

  it('listMessagesRequest calls /chats/:chatId/messages', async () => {
    await listMessagesRequest(7)
    expect(mockGet).toHaveBeenCalledWith('/chats/7/messages', undefined)
  })

  it('listMessagesRequest passes before param', async () => {
    await listMessagesRequest(7, 100)
    expect(mockGet).toHaveBeenCalledWith('/chats/7/messages', { params: { before: 100 } })
  })

  it('sendMessageRequest calls POST /messages', async () => {
    await sendMessageRequest({ chatId: 1, content: 'Привет' })
    expect(mockPost).toHaveBeenCalledWith('/messages', { chatId: 1, content: 'Привет' })
  })

  it('markChatReadRequest calls PATCH /chats/:chatId/messages/read', async () => {
    await markChatReadRequest(5)
    expect(mockPatch).toHaveBeenCalledWith('/chats/5/messages/read', undefined, expect.any(Object))
  })

  it('fetchMessagesUnreadCountRequest calls /messages/unread-count', async () => {
    await fetchMessagesUnreadCountRequest()
    expect(mockGet).toHaveBeenCalledWith('/messages/unread-count')
  })
})
