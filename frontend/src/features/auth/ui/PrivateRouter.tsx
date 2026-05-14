import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@shared/hooks'
import { selectToken } from '../model/selectors'
import { routes } from '@shared/config/routes'

type Props = {
  children: ReactNode
}

export const PrivateRouter = ({ children }: Props) => {
  const token = useAppSelector(selectToken)

  if (!token) {
    return <Navigate to={routes.auth} replace />
  }

  return <>{children}</>
}
