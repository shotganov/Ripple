import { Box, ButtonBase, InputBase, Paper } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import BackIcon from '@shared/assets/icons/icon-back.svg?react'
import SendIcon from '@shared/assets/icons/icon-send.svg?react'
import { MessageItem } from '@entities/message'
import type { ChatCompanion } from '@entities/chat'
import { breakpoints, colors, radius, transitions } from '@shared/styles'
import { Avatar } from '@shared/ui'
import { resolveAssetUrl } from '@shared/config'
import { useChatMessages, useMarkChatRead, useSendMessage } from '../hooks/useChats'

type ChatDialogProps = {
  currentUserId: number
  chatId: number | null
  companion: ChatCompanion
  onBack: () => void
  onChatCreated: (chatId: number) => void
}

export const ChatDialog = ({
  currentUserId,
  chatId,
  companion,
  onBack,
  onChatCreated,
}: ChatDialogProps) => {
  const [text, setText] = useState('')
  const messagesQuery = useChatMessages(chatId ?? 0)
  const sendMessage = useSendMessage()
  const markRead = useMarkChatRead()

  useEffect(() => {
    if (chatId) markRead.mutate(chatId)
  }, [chatId, markRead])

  const lastIncomingId = (() => {
    if (!chatId) return null
    const data = messagesQuery.data
    if (!data) return null
    for (let p = 0; p < data.pages.length; p += 1) {
      const page = data.pages[p]
      for (let i = page.items.length - 1; i >= 0; i -= 1) {
        if (page.items[i].senderId !== currentUserId) {
          return page.items[i].id
        }
      }
    }
    return null
  })()

  useEffect(() => {
    if (!chatId || lastIncomingId === null) return
    markRead.mutate(chatId)
  }, [chatId, lastIncomingId, markRead])

  const messages = useMemo(
    () =>
      chatId
        ? (messagesQuery.data?.pages
            .slice()
            .reverse()
            .flatMap(p => p.items) ?? [])
        : [],
    [chatId, messagesQuery.data],
  )

  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const prevChatIdRef = useRef<number | null>(null)
  const prevLastIdRef = useRef<number | null>(null)
  const isFetchingNextRef = useRef(false)
  const fetchNextPageRef = useRef(messagesQuery.fetchNextPage)
  const savedScrollHeightRef = useRef<number | null>(null)

  useEffect(() => {
    isFetchingNextRef.current = messagesQuery.isFetchingNextPage
  }, [messagesQuery.isFetchingNextPage])

  useEffect(() => {
    fetchNextPageRef.current = messagesQuery.fetchNextPage
  }, [messagesQuery.fetchNextPage])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !chatId) return
    if (!messagesQuery.hasNextPage) return

    const obs = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isFetchingNextRef.current) {
          if (containerRef.current) {
            savedScrollHeightRef.current = containerRef.current.scrollHeight
          }
          fetchNextPageRef.current()
        }
      },
      { rootMargin: '200px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [chatId, messagesQuery.hasNextPage])

  useLayoutEffect(() => {
    if (savedScrollHeightRef.current === null) return
    const container = containerRef.current
    if (!container) {
      savedScrollHeightRef.current = null
      return
    }
    const delta = container.scrollHeight - savedScrollHeightRef.current
    if (delta > 0) {
      container.scrollTop += delta
    }
    savedScrollHeightRef.current = null
  }, [messages.length])

  const lastMessageId = messages[messages.length - 1]?.id ?? null
  const lastMessageSenderId = messages[messages.length - 1]?.senderId ?? null

  useEffect(() => {
    if (!chatId || lastMessageId === null) return

    const chatChanged = prevChatIdRef.current !== chatId
    const newMessage = !chatChanged && prevLastIdRef.current !== lastMessageId
    const container = containerRef.current

    if (chatChanged && container) {
      let firstUnreadId: number | null = null
      for (const m of messages) {
        if (m.senderId !== currentUserId && !m.isRead) {
          firstUnreadId = m.id
          break
        }
      }

      if (firstUnreadId !== null) {
        const el = container.querySelector<HTMLElement>(`[data-message-id="${firstUnreadId}"]`)
        if (el) {
          el.scrollIntoView({ block: 'start' })
        } else {
          container.scrollTop = container.scrollHeight
        }
      } else {
        container.scrollTop = container.scrollHeight
      }
    } else if (newMessage && container) {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight
      const isMine = lastMessageSenderId === currentUserId
      if (isMine || distanceFromBottom < 200) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
      }
    }

    prevChatIdRef.current = chatId
    prevLastIdRef.current = lastMessageId
  }, [chatId, lastMessageId, lastMessageSenderId, currentUserId, messages])

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || sendMessage.isPending) return

    sendMessage.mutate(
      chatId ? { chatId, content: trimmed } : { peerId: companion.id, content: trimmed },
      {
        onSuccess: ({ chatId: newId }) => {
          setText('')
          if (!chatId) onChatCreated(newId)
        },
      },
    )
  }

  return (
    <Box sx={rootSx}>
      <Box sx={headerSx}>
        <ButtonBase onClick={onBack} sx={backBtnSx}>
          <Box component={BackIcon} sx={backIconSx} />
        </ButtonBase>

        <Avatar src={resolveAssetUrl(companion.avatar)} size={48} />

        <Box sx={userInfoSx}>
          <Box sx={userNameSx}>{companion.username}</Box>
          <Box sx={{ fontSize: 13, color: colors.textMuted }}>@{companion.tag}</Box>
        </Box>
      </Box>

      <Box ref={containerRef} sx={messagesListSx}>
        {messagesQuery.hasNextPage && <Box ref={sentinelRef} sx={{ height: 1, flexShrink: 0 }} />}
        <Box sx={messagesInnerSx}>
          {messages.map(item => (
            <Box key={item.id} data-message-id={item.id}>
              <MessageItem message={item.content} isMine={item.senderId === currentUserId} />
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ px: 1.5, py: 1 }}>
        <Paper elevation={0} sx={messageInputWrapSx}>
          <InputBase
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Написать сообщение..."
            sx={messageInputSx}
            onKeyDown={event => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                handleSend()
              }
            }}
          />

          {text.trim().length > 0 && (
            <ButtonBase
              type="button"
              onClick={handleSend}
              disabled={sendMessage.isPending}
              sx={sendBtnSx}
            >
              <SendIcon width={20} height={20} />
            </ButtonBase>
          )}
        </Paper>
      </Box>
    </Box>
  )
}

const rootSx: SystemStyleObject<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  border: `1px solid ${colors.border}`,
  borderRadius: '0px 16px 16px 0px',
  [breakpoints.tablet]: {
    borderRadius: 4,
  },
  [breakpoints.mobile]: {
    borderRadius: 0,
    borderLeft: 0,
    borderRight: 0,
  },
}

const headerSx: SystemStyleObject<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  p: 1,
  pl: 1.5,
  backgroundColor: colors.surface,
  borderBottom: `1px solid ${colors.border}`,
  borderRadius: '0px 16px 0px 0px',
  [breakpoints.tablet]: {
    borderRadius: '16px 16px 0px 0px',
  },
  [breakpoints.mobile]: {
    borderRadius: 0,
  },
}

const backBtnSx: SystemStyleObject<Theme> = {
  display: 'none',
  width: 36,
  height: 36,
  borderRadius: '50%',
  color: colors.text,
  transition: transitions.background,
  '&:hover': {
    backgroundColor: colors.hoverBg,
  },
  [breakpoints.compactSidebar]: {
    display: 'flex',
  },
}

const backIconSx: SystemStyleObject<Theme> = {
  width: 22,
  height: 22,
  color: 'inherit',
  objectFit: 'cover',
}

const userInfoSx: SystemStyleObject<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.25,
  minWidth: 0,
}

const userNameSx: SystemStyleObject<Theme> = {
  fontSize: 18,
  fontWeight: 500,
  lineHeight: 1.2,
}

const messagesListSx: SystemStyleObject<Theme> = {
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
}

const messagesInnerSx: SystemStyleObject<Theme> = {
  marginTop: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  px: 1.5,
  pt: 2,
}

const messageInputSx: SystemStyleObject<Theme> = {
  width: '100%',
  fontSize: 15,
  color: colors.text,
}

const messageInputWrapSx: SystemStyleObject<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  px: 1.5,
  py: 1,
  borderRadius: radius.md,
  border: `1px solid ${colors.inputBorder}`,
  backgroundColor: colors.inputBg,
  transition: transitions.backgroundAndBorder,
  '&:focus-within': {
    backgroundColor: colors.inputFocusBg,
    borderColor: colors.inputFocusBorder,
  },
}

const sendBtnSx: SystemStyleObject<Theme> = {
  width: 36,
  height: 30,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  borderRadius: 2.5,
  backgroundColor: colors.iconMuted,
  cursor: 'pointer',
  transition: transitions.background,
  '&:hover': {
    backgroundColor: colors.iconMutedHover,
  },
}
