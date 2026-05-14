import SocialIcon from '@shared/assets/icons/icon-social.svg'
import type { Comment } from './types'

export const commentsMock: Comment[] = [
  {
    id: 1,
    user: {
      id: 2,
      username: 'Alex Smith',
      tag: 'alex.smith',
      avatar: SocialIcon,
      bio: '',
    },
    content: 'Отличный пост! Очень понравилось.',
  },
  {
    id: 2,
    user: {
      id: 3,
      username: 'Maria Doe',
      tag: 'maria.doe',
      avatar: SocialIcon,
      bio: '',
    },
    content: 'Согласна, выглядит очень круто.',
  },
]
