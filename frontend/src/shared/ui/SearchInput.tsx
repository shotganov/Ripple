import { InputBase, Paper } from '@mui/material'
import SearchIcon from '@shared/assets/icons/icon-search.svg?react'
import { colors, radius, transitions } from '../styles/tokens'

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
  placeholder?: string
  disabled?: boolean
  px?: number
  py?: number
}

export const SearchInput = ({
  value,
  onChange,
  onFocus,
  placeholder = 'Поиск...',
  disabled = false,
  px = 1.5,
  py = 1,
}: SearchInputProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px,
        py,
        borderRadius: radius.md,
        border: `1px solid ${colors.inputBorder}`,
        backgroundColor: colors.inputBg,
        color: colors.iconMuted,
        transition: transitions.backgroundAndBorder,
        '&:focus-within': {
          backgroundColor: colors.inputFocusBg,
        },
      }}
    >
      <SearchIcon />

      <InputBase
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        sx={{
          width: '100%',
          fontSize: 15,
          color: colors.text,
        }}
        onFocus={onFocus}
      />
    </Paper>
  )
}
