import { Box, ButtonBase, ClickAwayListener, IconButton, InputBase, Paper } from '@mui/material'
import SendIcon from '@shared/assets/icons/icon-send.svg?react'
import EmojiIcon from '@shared/assets/icons/icon-emoji-gray.svg?react'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { colors, radius, transitions } from '@shared/styles/tokens'
import { zIndex } from '@shared/styles'
import { useState, useRef } from 'react'
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react'
import { useSelector } from 'react-redux'
import { selectUser } from '@entities/user'
import { resolveAssetUrl } from '@shared/config'
import { Avatar } from '@shared/ui'
import { useCreateComment } from '../hooks/useComment'
import type { CreateComment } from '../model/types'

const MAX_LENGTH = 300

type Props = {
  postId: number
}

export const CommentForm = ({ postId }: Props) => {
  const user = useSelector(selectUser)
  const [text, setText] = useState('')
  const [emojiOpen, setEmojiOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const createComment = useCreateComment(postId)

  const handleEmojiClick = (data: EmojiClickData) => {
    setText(prev => prev + data.emoji)
  }

  const trimmedLength = text.trim().length
  const isTooLong = text.length > MAX_LENGTH
  const canSend = trimmedLength > 0 && !isTooLong

  const handleSendComment = () => {
    if (!canSend) return

    const newComment: CreateComment = {
      content: text.trim(),
    }

    createComment.mutate(newComment, {
      onSuccess: () => setText(''),
    })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        p: 2,
        px: 1.5,
        alignItems: 'flex-start',
        border: `1px solid ${colors.border}`,
        borderTop: 0,
        backgroundColor: colors.surface,
      }}
    >
      <Avatar src={resolveAssetUrl(user?.avatar)} size={48} />

      <Box
        ref={wrapRef}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          width: '100%',
          position: 'relative',
        }}
      >
        {emojiOpen && (
          <ClickAwayListener onClickAway={() => setEmojiOpen(false)}>
            <Box
              sx={{
                position: 'absolute',
                top: '110%',
                left: 0,
                zIndex: zIndex.modal,
                transform: 'scale(0.8)',
                transformOrigin: 'top left',
              }}
            >
              <EmojiPicker previewConfig={{ showPreview: false }} onEmojiClick={handleEmojiClick} />
            </Box>
          </ClickAwayListener>
        )}
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            width: '100%',
            px: 1,
            py: 1,
            borderRadius: 3,
            border: `1px solid ${isTooLong ? colors.error : colors.inputBorder}`,
            backgroundColor: colors.inputBg,
            transition: transitions.background,
            '&:focus-within': {
              backgroundColor: colors.inputFocusBg,
            },
          }}
        >
          <IconButton
            disableRipple
            onClick={() => setEmojiOpen(prev => !prev)}
            sx={{
              p: 0,
              width: 24,
              height: 24,
              color: colors.textMuted,
              opacity: 0.8,
              flexShrink: 0,
              mt: '3px',
              borderRadius: radius.pill,
              '&:hover': { backgroundColor: colors.inputFocusBg },
            }}
          >
            <EmojiIcon width={22} height={22} />
          </IconButton>

          <InputBase
            multiline
            maxRows={6}
            value={text}
            placeholder="Написать комментарий..."
            onChange={event => setText(event.target.value)}
            sx={{
              flex: 1,
              fontSize: 15,
              lineHeight: 1.5,
              color: colors.text,
            }}
          />

          <ButtonBase
            onClick={handleSendComment}
            disabled={!canSend}
            sx={{
              width: 30,
              height: 30,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              backgroundColor: colors.accent,
              transition: transitions.backgroundAndOpacity,
              '&:hover': { opacity: 0.9 },
              '&.Mui-disabled': { opacity: 0.8 },
            }}
          >
            <SendIcon width={20} height={20} />
          </ButtonBase>
        </Paper>

        {isTooLong && (
          <Box sx={errorTextSx}>Комментарий не может быть длиннее {MAX_LENGTH} символов</Box>
        )}
      </Box>
    </Box>
  )
}

const errorTextSx: SystemStyleObject<Theme> = {
  fontSize: 13,
  fontWeight: 500,
  color: colors.error,
  ml: 0.5,
}
