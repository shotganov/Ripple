import type { ComponentType, SVGProps } from 'react'
import ChatIcon from '@shared/assets/icons/icon-chat.svg?react'
import ChatFilledIcon from '@shared/assets/icons/icon-chat-filled.svg?react'
import HomeIcon from '@shared/assets/icons/icon-home.svg?react'
import HomeFilledIcon from '@shared/assets/icons/icon-home-filled.svg?react'
import NotificationIcon from '@shared/assets/icons/icon-notification.svg?react'
import NotificationFilledIcon from '@shared/assets/icons/icon-notification-filled.svg?react'
import ProfileIcon from '@shared/assets/icons/icon-profile.svg?react'
import ProfileFilledIcon from '@shared/assets/icons/icon-profile-filled.svg?react'
import SearchIcon from '@shared/assets/icons/icon-search.svg?react'
import SearchFilledIcon from '@shared/assets/icons/icon-search-filled.svg?react'
import ReportIcon from '@shared/assets/icons/icon-report.svg?react'
import StatsIcon from '@shared/assets/icons/icon-stats.svg?react'
import StatsFilledIcon from '@shared/assets/icons/icon-stats-filled.svg?react'
import { routes } from '@shared/config/routes'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

export type SideBarMenuItem = {
  text: string
  icon: IconComponent
  iconActive?: IconComponent
  path: string
  adminOnly?: boolean
  userOnly?: boolean
}

export const menuItems: SideBarMenuItem[] = [
  { text: 'Главная', icon: HomeIcon, iconActive: HomeFilledIcon, path: routes.feed, userOnly: true },
  { text: 'Поиск', icon: SearchIcon, iconActive: SearchFilledIcon, path: routes.search },
  { text: 'Уведомления', icon: NotificationIcon, iconActive: NotificationFilledIcon, path: routes.notifications, userOnly: true },
  { text: 'Чаты', icon: ChatIcon, iconActive: ChatFilledIcon, path: routes.chat, userOnly: true },
  { text: 'Профиль', icon: ProfileIcon, iconActive: ProfileFilledIcon, path: '/profile/:id', userOnly: true },
  { text: 'Жалобы', icon: ReportIcon, path: routes.adminReports, adminOnly: true },
  { text: 'Статистика', icon: StatsIcon, iconActive: StatsFilledIcon, path: routes.adminStats, adminOnly: true },
]
