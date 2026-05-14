import { Box, ButtonBase, InputBase, Paper } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { colors, transitions } from '@shared/styles/tokens'
import SocialIcon from '@shared/assets/icons/icon-social.svg'
import { useState } from 'react'
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
  const createComment = useCreateComment(postId)

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
        gap: 2,
        p: 2,
        px: 1.5,
        alignItems: 'center',
        border: `1px solid ${colors.border}`,
        borderTop: 0,
        backgroundColor: colors.surface,
      }}
    >
      <Avatar src={resolveAssetUrl(user?.avatar) || SocialIcon} size={48} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 1,
            width: '100%',
            px: 1.75,
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
              px: 1.5,
              py: 0.875,
              borderRadius: 2.5,
              fontSize: 14,
              fontWeight: 700,
              lineHeight: 1.2,
              color: colors.surface,
              backgroundColor: colors.iconMuted,
              transition: transitions.backgroundAndBorder,
              '&:hover': {
                backgroundColor: colors.accentHover,
              },
              '&.Mui-disabled': {
                color: colors.surface,
                opacity: 0.45,
              },
            }}
          >
            Отправить
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
