import { Box, ButtonBase } from '@mui/material'
import { alphaColors, colors } from '@shared/styles/tokens'
import HeartIcon from '@shared/assets/icons/icon-like.svg?react'
import HeartFilledIcon from '@shared/assets/icons/icon-like-filled.svg?react'
import { postActionButtonSx } from './styles'

type Props = {
  countLikes: number
  isLiked?: boolean
  disabled?: boolean
  onLikeClick?: () => void
}

export const ButtonLike = ({ countLikes, isLiked = false, disabled, onLikeClick }: Props) => {
  return (
    <ButtonBase
      onClick={onLikeClick}
      disabled={disabled}
      sx={{
        ...postActionButtonSx,
        ...(isLiked && {
          color: colors.like,
        }),
        '&:hover': {
          color: colors.like,
          backgroundColor: alphaColors.likeHoverBg,
        },
      }}
    >
      <Box
        component={isLiked ? HeartFilledIcon : HeartIcon}
        sx={{
          width: 24,
          height: 18,
          flexShrink: 0,
          color: 'inherit',
          display: 'block',
        }}
      />
      {countLikes}
    </ButtonBase>
  )
}
