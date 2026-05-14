import { Box } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { radius } from '@shared/styles'

type PostImagesProps = {
  images: string[]
  onImageClick: (index: number) => void
}

export const PostImages = ({ images, onImageClick }: PostImagesProps) => {
  const imageCount = images.length

  if (imageCount === 1) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={images[0]}
          alt=""
          loading="lazy"
          decoding="async"
          onClick={() => onImageClick(0)}
          sx={{
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
            maxHeight: 510,
            '@media (max-width: 800px)': {
              maxHeight: 'none',
            },
            borderRadius: radius.md,
            objectFit: 'contain',
            cursor: 'pointer',
          }}
        />
      </Box>
    )
  }

  const imageGridSx = {
    2: {
      aspectRatio: '2 / 1',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr',
    },
    3: {
      aspectRatio: '1.6 / 1',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
    },
    4: {
      aspectRatio: '1 / 0.7',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
    },
  }[imageCount]

  return (
    <Box
      sx={{
        ...postImageGridBaseSx,
        ...imageGridSx,
      }}
    >
      {images.map((image, index) => (
        <Box
          key={`${image}-${index}`}
          component="img"
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          onClick={() => onImageClick(index)}
          sx={{
            ...postGridImageSx,
            gridRow: imageCount === 3 && index === 0 ? 'span 2' : 'auto',
          }}
        />
      ))}
    </Box>
  )
}

const postImageGridBaseSx = {
  display: 'grid',
  gap: 0.5,
  width: '100%',
  overflow: 'hidden',
  borderRadius: radius.md,
}

const postGridImageSx: SystemStyleObject<Theme> = {
  width: '100%',
  height: '100%',
  minHeight: 0,
  objectFit: 'cover',
  display: 'block',
  cursor: 'pointer',
}
