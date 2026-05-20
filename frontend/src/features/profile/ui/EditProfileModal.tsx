import { Box, Paper, InputBase, TextareaAutosize } from '@mui/material'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import CameraIcon from '@shared/assets/icons/icon-camera-new.svg'
import { useAppDispatch, useAppSelector } from '@shared/hooks'
import { selectUser, setUser } from '@entities/user'
import type { User } from '@shared/model'
import { Modal, ModalActionButton, ModalContent } from '@shared/ui'
import { alphaColors, breakpoints, colors, radius, transitions } from '@shared/styles'
import { resolveAssetUrl } from '@shared/config'
import { validateProfile, type ProfileFormErrors } from '../validator'
import type { UpdateProfilePayload } from '../model/types'
import { useUpdateUser } from '../hooks/useProfile'

type Props = {
  onClose: () => void
}

type InputFocused = 'username' | 'bio' | 'tag'
const avatarSize = 114

export const EditProfileModal = ({ onClose }: Props) => {
  const user = useAppSelector(selectUser)
  const currentUser = user as User
  const dispatch = useAppDispatch()
  const updateUser = useUpdateUser()
  const [userData, setUserData] = useState<User>(currentUser)
  const [inputFocused, setInputFocused] = useState<InputFocused | null>(null)
  const [errors, setErrors] = useState<ProfileFormErrors>({})
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const avatarBlobUrlRef = useRef<string | null>(null)
  const coverBlobUrlRef = useRef<string | null>(null)

  const handleFileIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (avatarBlobUrlRef.current) {
      URL.revokeObjectURL(avatarBlobUrlRef.current)
    }
    const url = URL.createObjectURL(file)
    avatarBlobUrlRef.current = url
    setAvatarFile(file)
    setUserData(prev => ({ ...prev, avatar: url }))
  }

  const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (coverBlobUrlRef.current) {
      URL.revokeObjectURL(coverBlobUrlRef.current)
    }
    const url = URL.createObjectURL(file)
    coverBlobUrlRef.current = url
    setCoverFile(file)
    setUserData(prev => ({ ...prev, coverImage: url }))
  }

  const handleUsernameChange = (value: string) => {
    const next = { ...userData, username: value }
    setUserData(next)
    setErrors(validateProfile(next))
  }

  const handleTagChange = (value: string) => {
    const next = { ...userData, tag: value }
    setUserData(next)
    setErrors(validateProfile(next))
  }

  const handleBioChange = (value: string) => {
    const next = { ...userData, bio: value }
    setUserData(next)
    setErrors(validateProfile(next))
  }

  const handleSave = () => {
    if (Object.keys(errors).length > 0) return

    const payload: UpdateProfilePayload = {}
    if (userData.username !== currentUser.username) payload.username = userData.username
    if (userData.tag !== currentUser.tag) payload.tag = userData.tag
    if ((userData.bio ?? '') !== (currentUser.bio ?? '')) payload.bio = userData.bio ?? ''
    if (avatarFile) payload.avatarFile = avatarFile
    if (coverFile) payload.coverFile = coverFile

    updateUser.mutate(payload, {
      onSuccess: saved => {
        dispatch(setUser(saved))
        localStorage.setItem('user', JSON.stringify(saved))
        onClose()
      },
    })
  }

  useEffect(() => {
    return () => {
      if (avatarBlobUrlRef.current) {
        URL.revokeObjectURL(avatarBlobUrlRef.current)
      }
      if (coverBlobUrlRef.current) {
        URL.revokeObjectURL(coverBlobUrlRef.current)
      }
    }
  }, [])

  if (!user) return null

  return (
    <Modal
      onClose={onClose}
      placement="top"
      sx={{
        pt: 5.7,
      }}
    >
      <ModalContent
        width={600}
        maxWidth="calc(100vw - 32px)"
        maxHeight="calc(100vh - 32px)"
        sx={{
          overflowY: 'auto',
          border: 'none',
          p: 2,
          py: 2,
          gap: 1.5,
          [breakpoints.mobile]: {
            maxWidth: '100vw',
            width: '100vw',
            maxHeight: '95vh',
            borderRadius: `${radius.lg} ${radius.lg} 0 0`,
          },
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <ModalActionButton variant="secondary" onClick={onClose}>
            Отменить
          </ModalActionButton>
          <Box
            sx={{
              fontSize: '20px',
              fontWeight: '700',
              [breakpoints.mobile]: {
                display: 'flex',
                textAlign: 'center',
                fontSize: '18px',
              },
            }}
          >
            Редактировать профиль
          </Box>
          <ModalActionButton
            variant="primary"
            disabled={userData.username.trim().length === 0}
            onClick={handleSave}
          >
            Сохранить
          </ModalActionButton>
        </Box>

        <Box
          sx={{
            position: 'relative',
            height: '200px',
            backgroundColor: colors.skyMist,
            ...(userData.coverImage && {
              backgroundImage: `url(${resolveAssetUrl(userData.coverImage)})`,
            }),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            mx: -2,
            width: 'calc(100% + 32px)',
          }}
        >
          <Box>
            <Box component="label" htmlFor="profile-image-upload" sx={cameraOverlaySx}>
              <Box component="img" src={CameraIcon} sx={{ width: 24, height: 24 }} />
            </Box>

            <input
              id="profile-image-upload"
              type="file"
              accept="image/*"
              hidden
              onChange={handleBackgroundImageChange}
            />
          </Box>

          <Box
            sx={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              transform: 'translate(15%, 30%)',
              width: avatarSize,
              height: avatarSize,
              flexShrink: 0,
              border: `2px solid ${colors.border}`,
              borderRadius: '50%',
              overflow: 'hidden',
            }}
          >
            {userData.avatar && (
              <Box
                component="img"
                src={resolveAssetUrl(userData.avatar)}
                alt="Profile preview"
                sx={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}

            <Box component="label" htmlFor="profile-icon-upload" sx={cameraOverlaySx}>
              <Box component="img" src={CameraIcon} sx={{ width: 24, height: 24 }} />
            </Box>

            <input
              id="profile-icon-upload"
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileIconChange}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Paper
            elevation={0}
            sx={{
              ...fieldPaperSx,
              border: () => {
                if (errors.username) return '1px solid red'
                else if (inputFocused === 'username') return `1px solid ${colors.inputBorder}`
                return `1px solid ${colors.border}`
              },
            }}
          >
            <Box
              sx={{
                fontSize: 12,
              }}
            >
              Имя
            </Box>
            <InputBase
              value={userData.username}
              onChange={e => handleUsernameChange(e.target.value)}
              sx={inputBaseSx}
              onFocus={() => setInputFocused('username')}
              onBlur={() => setInputFocused(null)}
            />
          </Paper>
          {errors.username && <Box sx={errorTextSx}>{errors.username}</Box>}
        </Box>

        <Box>
          <Paper
            elevation={0}
            sx={{
              ...fieldPaperSx,
              border: () => {
                if (errors.tag) return '1px solid red'
                else if (inputFocused === 'tag') return `1px solid ${colors.inputBorder}`
                return `1px solid ${colors.border}`
              },
            }}
          >
            <Box sx={{ fontSize: 12 }}>Тег</Box>
            <InputBase
              value={userData.tag}
              onChange={e => handleTagChange(e.target.value)}
              sx={inputBaseSx}
              onFocus={() => setInputFocused('tag')}
              onBlur={() => setInputFocused(null)}
            />
          </Paper>
          {errors.tag && <Box sx={errorTextSx}>{errors.tag}</Box>}
        </Box>

        <Box>
          <Paper
            elevation={0}
            sx={{
              ...fieldPaperSx,
              border: () => {
                if (errors.bio) return '1px solid red'
                else if (inputFocused === 'bio') return `1px solid ${colors.inputBorder}`
                return `1px solid ${colors.border}`
              },
            }}
          >
            <Box
              sx={{
                fontSize: 12,
              }}
            >
              Биография
            </Box>
            <TextareaAutosize
              minRows={3}
              maxRows={3}
              style={{
                ...textAreaSx,
              }}
              value={userData.bio}
              onFocus={() => setInputFocused('bio')}
              onBlur={() => setInputFocused(null)}
              onChange={e => handleBioChange(e.target.value)}
            />
          </Paper>
          {errors.bio && <Box sx={errorTextSx}>{errors.bio}</Box>}
        </Box>
      </ModalContent>
    </Modal>
  )
}

const inputBaseSx = {
  width: '100%',
  fontSize: 15,
  '& input': { padding: 0, paddingTop: '2px' },
}

const textAreaSx: CSSProperties = {
  width: '100%',
  fontSize: 15,
  outline: 'none',
  resize: 'none',
  color: colors.text,
  lineHeight: 1.5,
  paddingTop: '2px',
}

const cameraOverlaySx = {
  position: 'absolute',
  right: '50%',
  bottom: '50%',
  transform: 'translate(50%, 50%)',
  width: 42,
  height: 42,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alphaColors.cameraOverlayBg,
  borderRadius: '50%',
  cursor: 'pointer',
  zIndex: 2,
  transition: 'background-color 220ms ease',
  '&:hover': { backgroundColor: alphaColors.cameraOverlayHoverBg },
}

const fieldPaperSx = {
  display: 'flex',
  flexDirection: 'column',
  p: 0.7,
  px: 1.75,
  borderRadius: radius.md,
  border: `1px solid ${colors.inputBorder}`,
  backgroundColor: colors.inputBg,
  color: colors.textSoft,
  transition: transitions.background,
  '&:focus-within': {
    backgroundColor: colors.inputFocusBg,
  },
}

const errorTextSx = {
  fontSize: 12,
  color: 'red',
  mt: 0.5,
  ml: 2,
}
