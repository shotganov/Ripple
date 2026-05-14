import { ButtonComment, ButtonLike } from '@entities/post'
import { Box } from '@mui/material'
import { colors } from '@shared/styles'
import { useToggleLike } from '../hooks/usePosts'

type PostActionsProps = {
  postId: number
  likes: number
  comments: number
  isLiked: boolean
  onCommentsClick?: () => void
}

export const PostActions = ({
  postId,
  likes,
  comments,
  isLiked,
  onCommentsClick,
}: PostActionsProps) => {
  const toggleLike = useToggleLike(postId)

  const handleLikeClick = () => {
    if (toggleLike.isPending) return
    toggleLike.mutate(isLiked)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        color: colors.textSoft,
        mt: -0.5,
        ml: -0.8,
      }}
    >
      <ButtonLike
        countLikes={likes}
        isLiked={isLiked}
        disabled={toggleLike.isPending}
        onLikeClick={handleLikeClick}
      />
      <ButtonComment countComments={comments} onCommentsClick={onCommentsClick} />
    </Box>
  )
}
