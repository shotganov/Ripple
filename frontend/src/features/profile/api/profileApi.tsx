import { api } from '@shared/api'
import type { User } from '@shared/model'
import type { UpdateProfilePayload } from '../model/types'

const buildFormData = (payload: UpdateProfilePayload): FormData => {
  const form = new FormData()
  if (payload.username !== undefined) form.append('username', payload.username)
  if (payload.bio !== undefined) form.append('bio', payload.bio)
  if (payload.avatarFile) form.append('avatar', payload.avatarFile)
  if (payload.coverFile) form.append('coverImage', payload.coverFile)
  return form
}

export const patchUserRequest = (payload: UpdateProfilePayload) =>
  api.patch<User>('/users/me', buildFormData(payload)).then(res => res.data)
