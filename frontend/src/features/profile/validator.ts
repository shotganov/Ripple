const USERNAME_MAX = 50
const BIO_MAX = 160

export type ProfileFormErrors = { username?: string; bio?: string }

export function validateProfile(data: { username: string; bio?: string }): ProfileFormErrors {
  const errors: ProfileFormErrors = {}
  const username = data.username.trim()
  const bio = data.bio ?? ''

  if (!username) errors.username = 'Имя не может быть пустым'
  else if (data.username.length > USERNAME_MAX)
    errors.username = `Имя не может быть длиннее ${USERNAME_MAX} символов`

  if (bio.length > BIO_MAX) errors.bio = `Биография не может быть длиннее ${BIO_MAX} символов`

  return errors
}
