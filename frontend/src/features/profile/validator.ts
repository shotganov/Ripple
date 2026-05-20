const USERNAME_MAX = 50
const BIO_MAX = 160
const TAG_MIN = 3
const TAG_MAX = 30
const TAG_PATTERN = /^[a-zA-Z0-9_]+$/

export type ProfileFormErrors = { username?: string; bio?: string; tag?: string }

export function validateProfile(data: {
  username: string
  bio?: string
  tag?: string
}): ProfileFormErrors {
  const errors: ProfileFormErrors = {}
  const username = data.username.trim()
  const bio = data.bio ?? ''

  if (!username) errors.username = 'Имя не может быть пустым'
  else if (username.length > USERNAME_MAX)
    errors.username = `Имя не может быть длиннее ${USERNAME_MAX} символов`

  if (bio.length > BIO_MAX) errors.bio = `Биография не может быть длиннее ${BIO_MAX} символов`

  if (data.tag !== undefined) {
    const tag = data.tag.trim()
    if (!tag) errors.tag = 'Тег не может быть пустым'
    else if (tag.length < TAG_MIN) errors.tag = `Тег должен быть не короче ${TAG_MIN} символов`
    else if (tag.length > TAG_MAX) errors.tag = `Тег должен быть не длиннее ${TAG_MAX} символов`
    else if (!TAG_PATTERN.test(tag)) errors.tag = 'Тег может содержать только буквы, цифры и _'
  }

  return errors
}
