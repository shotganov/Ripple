import { useState } from 'react'
import { Box, ButtonBase, Paper, Stack } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import SearchIcon from '@shared/assets/icons/icon-search.svg?react'
import { alphaColors, breakpoints, colors, radius } from '@shared/styles'
import { SearchInput } from '@shared/ui'
import { UserCard, useUserSuggestions } from '@entities/user'
import { UserFollowRow } from '@features/follows'
import { routes } from '@shared/config/routes'
import { useSearchUsers } from '@features/search'
import { useDebouncedValue } from '@shared/lib'

type Props = {
  isSearchPage: boolean
}

export const SearchPanel = ({ isSearchPage }: Props) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const debouncedQuery = useDebouncedValue(query)
  const queryUsers = useSearchUsers(debouncedQuery)
  const suggestions = useUserSuggestions()
  const navigate = useNavigate()

  const normalizedQuery = query.trim().toLowerCase()
  const isSearching = normalizedQuery.length > 0
  const suggestedUsers = suggestions.data ?? []

  const handleSearch = () => {
    const nextQuery = query.trim()
    if (!nextQuery) return

    setIsFocused(false)
    setQuery('')

    navigate({
      pathname: routes.search,
      search: `?q=${encodeURIComponent(nextQuery)}`,
    })
  }

  return (
    <Box sx={wrapSx}>
      <Stack spacing={2} sx={{ position: 'sticky', top: 8 }}>
        {!isSearchPage && (
          <Box sx={{ position: 'relative' }}>
            <SearchInput
              value={query}
              onChange={setQuery}
              onFocus={() => setIsFocused(true)}
              placeholder="Поиск..."
            />

            {isSearching && isFocused && (
              <Paper elevation={0} sx={dropdownSx}>
                <ButtonBase
                  onClick={() => handleSearch()}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '100%',
                    gap: 2,
                    py: 1.5,
                    pl: 2,
                    borderRadius: '16px 16px 0 0',
                    fontSize: 15,
                    color: colors.iconMuted,
                    '&:hover': {
                      backgroundColor: colors.hoverBg,
                    },
                  }}
                >
                  <SearchIcon />
                  <Box sx={{ color: colors.text }}>{query}</Box>
                </ButtonBase>

                <Stack>
                  {queryUsers.data?.pages
                    .flatMap(p => p.items)
                    .slice(0, 5)
                    .map(user => <UserCard key={user.id} user={user} px={1} maxTextWidth={155} />)}
                </Stack>
              </Paper>
            )}
          </Box>
        )}

        {suggestedUsers.length > 0 && (
          <Paper elevation={0} sx={cardSx}>
            <Box sx={cardTitleSx}>Для вас</Box>

            <Stack>
              {suggestedUsers.map(user => (
                <UserFollowRow key={user.id} user={user} />
              ))}
            </Stack>
          </Paper>
        )}
      </Stack>
    </Box>
  )
}

const wrapSx: SystemStyleObject<Theme> = {
  width: 350,
  flexShrink: 0,
  [breakpoints.tablet]: {
    display: 'none',
  },
}

const dropdownSx: SystemStyleObject<Theme> = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 'calc(100% + 8px)',
  zIndex: 20,
  borderRadius: radius.lg,
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.surface,
  boxShadow: alphaColors.popoverShadow,
  overflow: 'hidden',
}

const cardSx: SystemStyleObject<Theme> = {
  borderRadius: radius.lg,
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.surface,
  overflow: 'hidden',
}

const cardTitleSx: SystemStyleObject<Theme> = {
  px: 2,
  pt: 1.5,
  pb: 1,
  fontSize: 20,
  fontWeight: 800,
  color: colors.text,
}

