import { Box, ButtonBase } from '@mui/material'
import { alphaColors, colors } from '@shared/styles/tokens'
import CommentIcon from '@shared/assets/icons/icon-comment.svg?react'
import { postActionButtonSx } from './styles'

type Props = {
  onCommentsClick?: () => void
  countComments: number
}

export const ButtonComment = ({ countComments, onCommentsClick }: Props) => {
  return (
    <ButtonBase
      onClick={onCommentsClick}
      sx={{
        ...postActionButtonSx,
        '&:hover': {
          color: colors.comment,
          backgroundColor: alphaColors.accentHoverBg,
        },
      }}
    >
      <Box
        component={CommentIcon}
        sx={{
          width: 24,
          height: 19,
          flexShrink: 0,
          color: 'inherit',
          display: 'block',
        }}
      />
      {countComments}
    </ButtonBase>
  )
}
