import { useMemo, useState, type ReactNode } from 'react'
import { Box } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { Avatar, ImagePreviewModal, UnstyledLink, UserInline } from '@shared/ui'
import { colors } from '@shared/styles'
import { resolveAssetUrl } from '@shared/config'
import type { Post } from '../model/types'
import { PostImages } from './PostImages'
import { routes } from '@shared/config/routes'

type PostComponentProps = {
  post: Post
  actions?: ReactNode
  menu?: ReactNode
}

export const PostComponent = ({ post, actions, menu }: PostComponentProps) => {
    const [previewIndex, setPreviewIndex] = useState<number | null>(null)
    const images = useMemo(() => post.images.map(resolveAssetUrl), [post.images])

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
          p: 1.5,
          pb: 1,
          backgroundColor: colors.surface,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <UnstyledLink to={routes.profile(post.user.id)}>
          <Avatar src={post.user.avatar} size={48} />
        </UnstyledLink>

        <Box sx={postBodySx}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <UserInline
              to={routes.profile(post.user.id)}
              username={post.user.username}
              tag={post.user.tag}
            />
            {menu}
          </Box>

          <Box
            sx={{
              fontSize: 15,
              lineHeight: 1.3,
              wordBreak: 'break-word',
            }}
          >
            {post.content}
          </Box>

          {images.length > 0 && <PostImages images={images} onImageClick={setPreviewIndex} />}

          {actions}
        </Box>

        {previewIndex !== null && (
          <ImagePreviewModal
            images={images}
            index={previewIndex}
            setIndex={setPreviewIndex}
            onClose={() => setPreviewIndex(null)}
          />
        )}
      </Box>
    )
}

const postBodySx: SystemStyleObject<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  minWidth: 0,
  flex: 1,
}
