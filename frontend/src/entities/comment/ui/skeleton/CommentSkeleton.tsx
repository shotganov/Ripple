import { MediaSkeleton } from '@shared/ui'

export const CommentSkeleton = () => (
  <MediaSkeleton
    avatarSize={44}
    lines={['40%', '100%', '100%', '70%']}
    bordered
  />
)
