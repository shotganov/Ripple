import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@shared/hooks'
import { selectUser } from '@entities/user'
import { routes } from '@shared/config/routes'

type Props = {
  children: ReactNode
}

export const AdminRoute = ({ children }: Props) => {
  const user = useAppSelector(selectUser)

  if (user?.role !== 'ADMIN') {
    return <Navigate to={routes.feed} replace />
  }

  return <>{children}</>
}
