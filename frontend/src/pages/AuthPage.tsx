import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { AuthForm, selectToken, type AuthMode } from '@features/auth'
import { useAppSelector } from '@shared/hooks'
import { colors } from '@shared/styles'
import { routes } from '@shared/config/routes'

export const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('login')
  const token = useAppSelector(selectToken)
  const navigate = useNavigate()

  const isRegister = mode === 'register'
  const title = isRegister ? 'Регистрация' : 'Войти'
  const subtitle = isRegister ? 'Создайте аккаунт и начните общение' : 'Введите логин и пароль'

  useEffect(() => {
    if (token) navigate(routes.feed, { replace: true })
  }, [navigate, token])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(320px, 0.55fr) 1fr' },
        backgroundColor: colors.surface,
        color: colors.text,
      }}
    >
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
          px: 5,
          pb: 8,
          borderRight: `1px solid ${colors.border}`,
          borderBottom: 'none',
          textAlign: 'right',
        }}
      >
        <Box
          sx={{
            fontSize: { sm: 44, lg: 50 },
            lineHeight: 1,
            fontWeight: 700,
            color: colors.accent,
          }}
        >
          {title}
        </Box>

        <Box
          sx={{
            mt: 1.5,
            fontSize: { xs: 17, md: 19 },
            fontWeight: 700,
            color: colors.text,
          }}
        >
          {subtitle}
        </Box>
      </Box>

      <AuthForm mode={mode} onModeChange={setMode} />
    </Box>
  )
}
