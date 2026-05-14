import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@shared/model'

type UserState = User | null

const initialState: UserState = null

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState as UserState,
  reducers: {
    setUser: (_, action: PayloadAction<User>) => action.payload,
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (!state) return
      Object.assign(state, action.payload)
    },
    clearUser: () => null,
  },
})

export const { setUser, updateUser, clearUser } = userSlice.actions
export default userSlice.reducer
