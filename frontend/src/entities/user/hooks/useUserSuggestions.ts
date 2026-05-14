import { useQuery } from '@tanstack/react-query'
import { getUserSuggestionsRequest } from '../api/getUserApi'

export const useUserSuggestions = () =>
  useQuery({
    queryKey: ['user-suggestions'] as const,
    queryFn: getUserSuggestionsRequest,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
