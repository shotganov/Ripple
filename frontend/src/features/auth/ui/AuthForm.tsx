import { Box, ButtonBase, InputBase, Paper } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { useState, type CSSProperties, type FormEvent } from 'react'
import { enqueueSnackbar } from 'notistack'
import AtIcon from '@shared/assets/icons/icon-at.svg?react'
import LockIcon from '@shared/assets/icons/icon-lock.svg?react'
import { colors, transitions } from '@shared/styles/tokens'
import { useLogin, useRegister } from '../hooks/useAuth'
import type { Auth } from '../model/Auth'

export type AuthMode = 'login' | 'register'

type Props = {
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
}

export const AuthForm = ({ mode, onModeChange }: Props) => {
  const [form, setForm] = useState({
    tag: '',
    password: '',
    confirmPassword: '',
  })
  const loginMutation = useLogin()
  const registerMutation = useRegister()

  const isRegister = mode === 'register'
  const activeMutation = isRegister ? registerMutation : loginMutation
  const isPending = loginMutation.isPending || registerMutation.isPending
  const submitText = isRegister ? 'Зарегистрироваться' : 'Войти'
  const title = isRegister ? 'Регистрация' : 'Войти'
  const subtitle = isRegister ? 'Создайте аккаунт и начните общение' : 'Введите логин и пароль'

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!form.tag.trim() || !form.password) {
      enqueueSnackbar('Введите логин и пароль', { variant: 'warning' })
      return
    }

    if (form.tag.trim().length < 3) {
      enqueueSnackbar('Логин должен быть не короче 3 символов', { variant: 'warning' })
      return
    }

    if (form.password.length < 6) {
      enqueueSnackbar('Пароль должен быть не короче 6 символов', { variant: 'warning' })
      return
    }

    if (isRegister && form.password !== form.confirmPassword) {
      enqueueSnackbar('Пароли не совпадают', { variant: 'warning' })
      return
    }

    const auth: Auth = {
      tag: form.tag.trim(),
      password: form.password,
    }

    activeMutation.mutate(auth)
  }

  function handleChangeMode() {
    loginMutation.reset()
    registerMutation.reset()
    onModeChange(isRegister ? 'login' : 'register')
    setForm({
      tag: '',
      password: '',
      confirmPassword: '',
    })
  }

  return (
    <Box
      sx={{
        minHeight: { xs: 'auto', md: '100vh' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: { xs: 'center', md: 'flex-start' },
        px: { xs: 2, sm: 5 },
      }}
    >
      <Paper
        component="form"
        elevation={0}
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 600,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 0,
          border: 'none',
          borderRadius: 0,
          backgroundColor: 'transparent',
        }}
      >
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            textAlign: 'center',
            flexDirection: 'column',
            gap: 1.5,
            mb: 2,
          }}
        >
          <Box
            sx={{
              fontSize: 40,
              lineHeight: 1,
              fontWeight: 700,
              color: colors.accent,
            }}
          >
            {title}
          </Box>
          <Box
            sx={{
              fontSize: 17,
              fontWeight: 700,
              color: colors.textSoft,
            }}
          >
            {subtitle}
          </Box>
        </Box>

        <Box>
          <Box sx={labelSx}>Учетная запись</Box>
          <InputBase
            type="text"
            placeholder="Логин"
            value={form.tag}
            disabled={isPending}
            onChange={e => setForm({ ...form, tag: e.target.value })}
            startAdornment={<AtIcon style={inputIconStyle} />}
            sx={inputSx}
          />
        </Box>

        <Box>
          <InputBase
            type="password"
            placeholder="Пароль"
            value={form.password}
            disabled={isPending}
            onChange={e => setForm({ ...form, password: e.target.value })}
            startAdornment={<LockIcon style={inputIconStyle} />}
            sx={inputSx}
          />
        </Box>

        {isRegister && (
          <Box>
            <InputBase
              type="password"
              placeholder="Пароль еще раз"
              value={form.confirmPassword}
              disabled={isPending}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              startAdornment={<LockIcon style={inputIconStyle} />}
              sx={inputSx}
            />
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <ButtonBase
            type="button"
            disabled={isPending}
            onClick={handleChangeMode}
            sx={secondaryButtonSx}
          >
            {isRegister ? 'Войти' : 'Регистрация'}
          </ButtonBase>

          <ButtonBase type="submit" disabled={isPending} sx={submitButtonSx}>
            {isPending ? 'Подождите...' : submitText}
          </ButtonBase>
        </Box>
      </Paper>
    </Box>
  )
}

const labelSx: SystemStyleObject<Theme> = {
  mb: 0.75,
  fontSize: 15,
  fontWeight: 700,
  color: colors.textMuted,
}

const inputSx: SystemStyleObject<Theme> = {
  width: '100%',
  minHeight: 48,
  px: 1.25,
  gap: 1,
  borderRadius: 3,
  border: '1px solid transparent',
  backgroundColor: colors.inputBg,
  color: colors.text,
  fontSize: 16,
  transition: transitions.background,
  '& input': {
    p: 0,
    '&::placeholder': {
      color: colors.textMuted,
      opacity: 1,
    },
  },
  '&:focus-within': {
    backgroundColor: colors.inputFocusBg,
  },
  '&.Mui-disabled': {
    opacity: 0.65,
  },
}

const inputIconStyle: CSSProperties = {
  width: 22,
  height: 22,
  flexShrink: 0,
}

const submitButtonSx: SystemStyleObject<Theme> = {
  minHeight: 48,
  px: 3,
  borderRadius: 999,
  backgroundColor: colors.accent,
  color: colors.surface,
  fontSize: 16,
  fontWeight: 700,
  transition: transitions.backgroundAndOpacity,
  '&:hover': {
    opacity: 0.9,
  },
  '&.Mui-disabled': {
    opacity: 0.65,
    color: colors.surface,
  },
}

const secondaryButtonSx: SystemStyleObject<Theme> = {
  minHeight: 48,
  px: 3,
  borderRadius: 999,
  backgroundColor: colors.inputBg,
  color: colors.textSoft,
  fontSize: 16,
  fontWeight: 700,
  transition: transitions.backgroundAndOpacity,
  '&:hover': {
    backgroundColor: colors.inputFocusBg,
  },
  '&.Mui-disabled': {
    opacity: 0.65,
    color: colors.textMuted,
  },
}
