import { Box, ButtonBase, Paper } from '@mui/material'
import { colors, radius, transitions } from '@shared/styles'
import { SearchInput } from '@shared/ui'
import type { SearchMode } from '../model/types'

type Props = {
  query: string
  onQueryChange: (value: string) => void
  mode: SearchMode
  onModeChange: (mode: SearchMode) => void
}

const filters: { label: string; value: SearchMode }[] = [
  { label: 'Посты', value: 'posts' },
  { label: 'Люди', value: 'users' },
]

export const SearchControls = ({ query, onQueryChange, mode, onModeChange }: Props) => {
  return (
    <Paper elevation={0} sx={panelSx}>
      <SearchInput
        value={query}
        onChange={onQueryChange}
        // onSearch={onSearch}
        placeholder={mode === 'users' ? 'Поиск пользователей...' : 'Поиск постов...'}
        px={1.75}
        py={1.25}
      />
      <Box sx={chipsRowSx}>
        {filters.map(filter => {
          const isActive = mode === filter.value
          return (
            <ButtonBase
              key={filter.value}
              onClick={() => onModeChange(filter.value)}
              sx={chipSx(isActive)}
            >
              {filter.label}
            </ButtonBase>
          )
        })}
      </Box>
    </Paper>
  )
}

const panelSx = {
  borderRadius: 0,
  backgroundColor: colors.surface,
}

const chipsRowSx = {
  display: 'flex',
  gap: 1,
  mt: 1.5,
  flexWrap: 'wrap',
}

const chipSx = (isActive: boolean) => ({
  px: 1.5,
  py: 0.9,
  borderRadius: radius.pill,
  border: isActive ? '1px solid transparent' : `1px solid ${colors.inputBorder}`,
  backgroundColor: isActive ? colors.activeBg : colors.surface,
  color: isActive ? colors.accent : colors.textSoft,
  fontSize: 14,
  lineHeight: 1.2,
  transition: transitions.backgroundAndColor,
  '&:hover': {
    backgroundColor: isActive ? colors.activeHoverBg : colors.inputBg,
  },
})
