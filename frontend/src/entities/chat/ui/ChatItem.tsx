import { Box, ButtonBase } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { resolveAssetUrl } from '@shared/config'
import { Avatar } from '@shared/ui'
import { colors } from '@shared/styles'
import type { Chat } from '../model/types'

type Props = {
  isActive: boolean
  onClick: () => void
  chat: Chat
}

export const ChatItem = ({ isActive, onClick, chat }: Props) => {
  const last = chat.lastMessage
  const lastText = last ? last.content : 'Нет сообщений'

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: '100%',
        textAlign: 'left',
        justifyContent: 'left',
        backgroundColor: isActive ? colors.selectedBg : colors.surface,
        transition: 'background-color 220ms ease',
        color: colors.text,
        '&:hover': {
          backgroundColor: colors.hoverBgStrong,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          py: 2,
          px: 1.5,
          width: '100%',
        }}
      >
        <Avatar src={resolveAssetUrl(chat.companion.avatar)} size={48} />

        <Box
          sx={{
            py: '1px',
            display: 'flex',
            alignSelf: 'stretch',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minWidth: 0,
            flex: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Box
              sx={{
                fontSize: 16,
                fontWeight: 500,
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {chat.companion.username}
            </Box>

            {chat.unreadCount > 0 && (
              <Box sx={badgeSx}>{chat.unreadCount > 99 ? '99+' : chat.unreadCount}</Box>
            )}
          </Box>

          <Box
            sx={{
              fontSize: 14,
              lineHeight: 1.4,
              color: colors.textMuted,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontWeight: chat.unreadCount > 0 ? 600 : 400,
            }}
          >
            {lastText}
          </Box>
        </Box>
      </Box>
    </ButtonBase>
  )
}

const badgeSx: SystemStyleObject<Theme> = {
  minWidth: 20,
  height: 20,
  px: 0.75,
  borderRadius: 10,
  backgroundColor: colors.accent,
  color: colors.surface,
  fontSize: 12,
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
