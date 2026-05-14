import type { ReactNode } from 'react'
import { ButtonBase } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { colors, radius, transitions } from '../../styles/tokens'

type ModalActionButtonVariant = 'primary' | 'secondary'

type ModalActionButtonProps = {
  children: ReactNode
  variant: ModalActionButtonVariant
  disabled?: boolean
  onClick?: () => void
  sx?: SystemStyleObject<Theme>
}

export const ModalActionButton = ({
  children,
  variant,
  disabled,
  onClick,
  sx,
}: ModalActionButtonProps) => (
  <ButtonBase
    disabled={disabled}
    onClick={onClick}
    sx={{
      fontSize: '14px',
      height: 35,
      px: 1.5,
      borderRadius: radius.md,
      transition: transitions.backgroundAndBorder,
      ...(variant === 'primary'
        ? {
            border: '1px solid transparent',
            backgroundColor: colors.iconMuted,
            color: colors.surface,
            '&:hover': { backgroundColor: colors.textMuted },
            '&.Mui-disabled': {
              opacity: 0.8,
              cursor: 'not-allowed',
            },
          }
        : {
            border: `1px solid ${colors.inputBorder}`,
            backgroundColor: colors.inputBg,
            color: colors.textSoft,
            '&:hover': { backgroundColor: colors.inputFocusBg },
          }),
      ...sx,
    }}
  >
    {children}
  </ButtonBase>
)
