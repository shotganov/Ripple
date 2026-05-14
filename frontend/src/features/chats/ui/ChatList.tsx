import { Box } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { useEffect, useRef } from 'react'
import { Title, SearchInput } from '@shared/ui'
import { ChatItem, type Chat } from '@entities/chat'
import { breakpoints, colors, radius } from '@shared/styles'

type ChatListProps = {
  chats: Chat[]
  selectedChatId: number | null
  isDraftActive: boolean
  isLoading: boolean
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  onLoadMore?: () => void
  onSelectChat: (chatId: number) => void
  searchQuery: string
  onSearchChange: (value: string) => void
}

export const ChatList = ({
  chats,
  selectedChatId,
  isDraftActive,
  isLoading,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
  onSelectChat,
  searchQuery,
  onSearchChange,
}: ChatListProps) => {
  const hasSelection = selectedChatId !== null || isDraftActive
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const hasSearch = searchQuery.trim().length > 0

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !onLoadMore || !hasNextPage) return

    const obs = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          onLoadMore()
        }
      },
      { rootMargin: '200px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [onLoadMore, hasNextPage, isFetchingNextPage])

  return (
    <Box sx={rootSx(hasSelection)}>
      <Box sx={headerSx}>
        <Title text="Чаты" fontSize={22} />
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Поиск по чатам..."
          px={1.75}
          py={1}
        />
      </Box>

      {isLoading ? (
        <Box sx={emptyHintSx}>Загрузка...</Box>
      ) : chats.length > 0 ? (
        <>
          {chats.map(chat => (
            <ChatItem
              key={chat.id}
              isActive={selectedChatId === chat.id}
              onClick={() => onSelectChat(chat.id)}
              chat={chat}
            />
          ))}
          {hasNextPage && <Box ref={sentinelRef} sx={{ height: 1 }} />}
        </>
      ) : (
        <Box sx={emptyHintSx}>{hasSearch ? 'Ничего не найдено' : 'Нет чатов'}</Box>
      )}
    </Box>
  )
}

const rootSx = (hasSelection: boolean) =>
  ({
    width: 330,
    flexShrink: 0,
    borderTop: `1px solid ${colors.border}`,
    borderBottom: `1px solid ${colors.border}`,
    overflowY: 'auto',
    [breakpoints.tablet]: {
      display: hasSelection ? 'none' : 'block',
      width: '100%',
      borderRadius: radius.lg,
      border: `1px solid ${colors.border}`,
    },
    [breakpoints.mobile]: {
      border: 0,
    },
  }) as const

const headerSx: SystemStyleObject<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  p: 2,
  borderBottom: `1px solid ${colors.border}`,
}

const emptyHintSx: SystemStyleObject<Theme> = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  mt: 10,
  color: colors.textSoft,
  fontSize: 18,
}
