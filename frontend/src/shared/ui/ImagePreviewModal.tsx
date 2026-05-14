import { useCallback, useEffect } from 'react'
import { Box, IconButton } from '@mui/material'
import XIcon from '@shared/assets/icons/icon-x.svg?react'
import ChevronLeftIcon from '@shared/assets/icons/icon-chevron-left.svg?react'
import { Modal } from './modal'
import { alphaColors, colors, transitions } from '../styles/tokens'

type ImagePreviewModalProps = {
  images: string[]
  index: number
  setIndex: React.Dispatch<React.SetStateAction<number | null>>
  onClose: () => void
}

export const ImagePreviewModal = ({ images, index, setIndex, onClose }: ImagePreviewModalProps) => {
  const isFirstImage = index === 0
  const isLastImage = index === images.length - 1

  const showPrev = useCallback(() => {
    setIndex(currentIndex => {
      if (currentIndex === null) return 0
      return Math.max(currentIndex - 1, 0)
    })
  }, [setIndex])

  const showNext = useCallback(() => {
    setIndex(currentIndex => {
      if (currentIndex === null) return 0
      return Math.min(currentIndex + 1, images.length - 1)
    })
  }, [images.length, setIndex])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && !isFirstImage) {
        showPrev()
      }

      if (event.key === 'ArrowRight' && !isLastImage) {
        showNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFirstImage, isLastImage, onClose, showNext, showPrev])

  return (
    <Modal
      onClose={onClose}
      lockVariant="fullscreen"
      sx={{
        backgroundColor: colors.black,
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          ...previewButtonSx,
          position: 'absolute',
          right: 18,
          top: '5%',
          transform: 'translateY(-50%)',
        }}
      >
        <XIcon width={22} height={22} />
      </IconButton>

      {images.length > 1 && !isFirstImage && (
        <IconButton
          onClick={showPrev}
          sx={{
            ...previewButtonSx,
            position: 'absolute',
            left: 18,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <ChevronLeftIcon width={20} height={20} />
        </IconButton>
      )}

      <Box
        onMouseDown={onClose}
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <Box
          component="img"
          src={images[index]}
          alt=""
          sx={{
            width: '100vw',
            height: '100vh',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            display: 'block',
            cursor: 'pointer',
          }}
        />
      </Box>

      {images.length > 1 && !isLastImage && (
        <IconButton
          onClick={showNext}
          sx={{
            ...previewButtonSx,
            position: 'absolute',
            right: 18,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <ChevronLeftIcon width={20} height={20} style={{ transform: 'rotate(180deg)' }} />
        </IconButton>
      )}
    </Modal>
  )
}

const previewButtonSx = {
  width: 44,
  height: 44,
  zIndex: 1,
  color: '#ffffff',
  backgroundColor: alphaColors.imagePreviewButtonBg,
  transition: transitions.background,
  '&:hover': {
    backgroundColor: alphaColors.imagePreviewButtonHoverBg,
  },
}
