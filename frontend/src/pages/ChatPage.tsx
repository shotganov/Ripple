import { Box } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChatDialog, ChatList, EmptyDialog, useChatWithPeer, useChats } from '@features/chats'
import { useGetUser } from '@features/profile'
import type { ChatCompanion } from '@entities/chat'
import { selectUser } from '@entities/user'
import { useAppSelector } from '@shared/hooks'
import { useDebouncedValue } from '@shared/lib'
import { breakpoints, colors } from '@shared/styles'

export const ChatPage = () => {
  const user = useAppSelector(selectUser)
  const [params, setParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebouncedValue(searchQuery)

  const chatId = Number(params.get('id')) || null
  const peerId = Number(params.get('peer')) || null

  const chatsQuery = useChats(!!user, debouncedSearch)
  const draftPeerQuery = useGetUser(peerId && !chatId ? peerId : Number.NaN)
  const existingChatWithPeerQuery = useChatWithPeer(peerId && !chatId ? peerId : 0)

  useEffect(() => {
    const existing = existingChatWithPeerQuery.data
    if (peerId && !chatId && existing) {
      setParams({ id: String(existing.id) }, { replace: true })
    }
  }, [peerId, chatId, existingChatWithPeerQuery.data, setParams])

  useEffect(() => {
    document.body.classList.toggle('chat-dialog-open', !!chatId || !!peerId)
    return () => {
      document.body.classList.remove('chat-dialog-open')
    }
  }, [chatId, peerId])

  if (!user) return null

  const chats = chatsQuery.data?.pages.flatMap(p => p.items) ?? []
  const selectedChat = chatId ? (chats.find(c => c.id === chatId) ?? null) : null

  const draftCompanion: ChatCompanion | null =
    peerId && !chatId && draftPeerQuery.data
      ? {
          id: draftPeerQuery.data.id,
          username: draftPeerQuery.data.username,
          tag: draftPeerQuery.data.tag,
          avatar: draftPeerQuery.data.avatar ?? null,
        }
      : null

  const handleSelectChat = (id: number) => {
    setParams({ id: String(id) }, { replace: true })
  }

  const handleBack = () => {
    setParams({}, { replace: true })
  }

  const handleChatCreated = (id: number) => {
    setParams({ id: String(id) }, { replace: true })
  }

  const dialogCompanion = selectedChat?.companion ?? draftCompanion

  return (
    <Box sx={rootSx(!!chatId || !!peerId)}>
      <Box sx={containerSx}>
        <ChatList
          chats={chats}
          selectedChatId={chatId}
          isDraftActive={!!peerId && !chatId}
          isLoading={chatsQuery.isLoading}
          hasNextPage={chatsQuery.hasNextPage}
          isFetchingNextPage={chatsQuery.isFetchingNextPage}
          onLoadMore={() => chatsQuery.fetchNextPage()}
          onSelectChat={handleSelectChat}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {dialogCompanion ? (
          <ChatDialog
            currentUserId={user.id}
            chatId={chatId}
            companion={dialogCompanion}
            onBack={handleBack}
            onChatCreated={handleChatCreated}
          />
        ) : (
          <EmptyDialog />
        )}
      </Box>
    </Box>
  )
}

const rootSx = (hasOpenDialog: boolean) =>
  ({
    py: 1,
    height: '100vh',
    width: '100%',
    [breakpoints.mobile]: {
      py: 0,
      height: hasOpenDialog ? '100vh' : 'calc(100vh - 72px)',
    },
  }) as const

const containerSx: SystemStyleObject<Theme> = {
  display: 'flex',
  backgroundColor: colors.surface,
  height: '100%',
  borderLeft: 0,
  borderRadius: '0 16px 16px 0',
  overflow: 'hidden',
  [breakpoints.tablet]: {
    borderRadius: 0,
  },
  [breakpoints.mobile]: {
    border: 0,
    borderRadius: 0,
  },
}
