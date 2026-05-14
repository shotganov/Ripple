import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@features/auth/model/authSlice'
import userReducer from '@entities/user/model/userSlice'
import type { User } from '@shared/model'

const token = localStorage.getItem('token')
const userString = localStorage.getItem('user')

const preloadedUser: User | null = userString ? JSON.parse(userString) : null
const preloadedToken: string | null = token ? token : null

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
  preloadedState: {
    auth: {
      token: preloadedToken,
    },
    user: preloadedUser,
  },
})

