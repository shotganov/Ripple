import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { createPortal } from 'react-dom'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { alphaColors } from '../../styles/tokens'
import { zIndex as z } from '../../styles/zIndex'

type ModalPlacement = 'center' | 'top'
type LockVariant = 'plain' | 'dim' | 'fullscreen'

type ModalProps = {
  children: ReactNode
  onClose: () => void
  placement?: ModalPlacement
  zIndex?: number
  lockVariant?: LockVariant
  sx?: SystemStyleObject<Theme>
}

export const Modal = ({
  children,
  onClose,
  placement = 'center',
  zIndex = z.modal,
  lockVariant = 'dim',
  sx,
}: ModalProps) => {
  useLockBodyScroll(true, lockVariant)

  return createPortal(
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex,
        display: 'flex',
        justifyContent: 'center',
        alignItems: placement === 'center' ? 'center' : 'flex-start',
        pt: placement === 'top' ? { xs: 0, sm: 5 } : 0,
        backgroundColor: alphaColors.overlay,
        ...sx,
      }}
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {children}
    </Box>,
    document.body,
  )
}
