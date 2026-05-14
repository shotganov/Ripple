import { Box, ButtonBase, ClickAwayListener } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import MoreIcon from '../assets/icons/icon-more.svg?react'
import { alphaColors, colors, radius, transitions } from '../styles'
import { zIndex } from '../styles/zIndex'

type DropdownMenuProps = {
  children: ReactNode | ((close: () => void) => ReactNode)
}

export const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const close = () => setPosition(null)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    if (position) {
      close()
      return
    }
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    setPosition({
      top: rect.bottom + window.scrollY,
      left: rect.right + window.scrollX,
    })
  }

  useEffect(() => {
    if (!position) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    const handleResize = () => close()
    window.addEventListener('keydown', handleKey)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('resize', handleResize)
    }
  }, [position])

  return (
    <>
      <Box sx={triggerSlotSx}>
        <ButtonBase ref={triggerRef} onClick={handleToggle} sx={triggerSx}>
          <Box component={MoreIcon} sx={{ width: 14, height: 14, display: 'block' }} />
        </ButtonBase>
      </Box>

      {position &&
        createPortal(
          <ClickAwayListener onClickAway={close}>
            <Box sx={{ ...menuSx, top: position.top, left: position.left }}>
              {typeof children === 'function' ? children(close) : children}
            </Box>
          </ClickAwayListener>,
          document.body,
        )}
    </>
  )
}

type DropdownMenuItemProps = {
  icon: ElementType
  onClick: () => void
  danger?: boolean
  children: ReactNode
}

export const DropdownMenuItem = ({ icon, onClick, danger, children }: DropdownMenuItemProps) => (
  <ButtonBase sx={danger ? dangerItemSx : itemSx} onClick={onClick}>
    <Box component={icon} sx={iconSx} />
    {children}
  </ButtonBase>
)

const triggerSlotSx: SystemStyleObject<Theme> = {
  position: 'relative',
  width: 14,
  height: 14,
}

const triggerSx: SystemStyleObject<Theme> = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: 28,
  height: 28,
  borderRadius: '50%',
  color: colors.textMuted,
  transition: transitions.background,
  '&:hover': {
    backgroundColor: colors.hoverBg,
    color: colors.text,
  },
}

const menuSx: SystemStyleObject<Theme> = {
  position: 'absolute',
  transform: 'translateX(-100%)',
  minWidth: 200,
  borderRadius: radius.md,
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.surface,
  boxShadow: alphaColors.popoverShadow,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  zIndex: zIndex.dropdown,
}

const itemSx: SystemStyleObject<Theme> = {
  justifyContent: 'flex-start',
  gap: 1.25,
  width: '100%',
  px: 1.5,
  py: 1.25,
  fontSize: 14,
  fontWeight: 500,
  color: colors.text,
  whiteSpace: 'nowrap',
  transition: transitions.background,
  '&:hover': {
    backgroundColor: colors.hoverBg,
  },
}

const dangerItemSx: SystemStyleObject<Theme> = {
  ...itemSx,
  color: colors.like,
}

const iconSx: SystemStyleObject<Theme> = {
  width: 16,
  height: 16,
  display: 'block',
  color: 'inherit',
}
