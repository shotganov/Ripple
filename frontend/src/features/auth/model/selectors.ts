import type { RootState } from '@shared/hooks'

export const selectToken = (state: RootState) => state.auth.token
