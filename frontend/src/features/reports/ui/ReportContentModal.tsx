import { Box, ButtonBase } from '@mui/material'
import { useState } from 'react'
import XIcon from '@shared/assets/icons/icon-x.svg?react'
import { Modal, ModalContent } from '@shared/ui'
import { alphaColors, colors, radius, transitions } from '@shared/styles'
import { useCreateReport } from '../hooks/useReports'
import {
  reportReasonLabels,
  reportReasons,
  type ReportReason,
  type ReportTarget,
} from '../model/types'

type Props = {
  target: ReportTarget
  onClose: () => void
}

export const ReportContentModal = ({ target, onClose }: Props) => {
  const [selectedReason, setSelectedReason] = useState<ReportReason | ''>('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const createReport = useCreateReport()

  function handleSubmit() {
    if (!selectedReason) return
    setError('')
    createReport.mutate(
      {
        reason: selectedReason,
        postId: target.type === 'post' ? target.id : undefined,
        commentId: target.type === 'comment' ? target.id : undefined,
      },
      {
        onSuccess: () => setDone(true),
        onError: () => setError('Не удалось отправить жалобу. Попробуйте позже.'),
      },
    )
  }

  return (
    <Modal placement="top" onClose={onClose}>
      <ModalContent
        width={560}
        maxWidth={{ xs: '100vw', sm: 'calc(100vw - 32px)' }}
        height={{ xs: '100vh', sm: 'min(570px, calc(100vh - 80px))' }}
        sx={{ borderRadius: { xs: 0, sm: radius.lg } }}
      >
        <Box sx={headerSx}>
          <ButtonBase onClick={onClose} sx={closeBtnSx}>
            <Box component={XIcon} sx={{ width: 22, height: 22 }} />
          </ButtonBase>
          <Box sx={{ fontSize: 22, fontWeight: 700, color: colors.text }}>
            {done ? 'Жалоба отправлена' : 'На что вы жалуетесь?'}
          </Box>
        </Box>

        <Box sx={accentLineSx} />

        {done ? (
          <Box sx={doneBlockSx}>
            <Box sx={{ fontSize: 16, color: colors.textMuted, mb: 3 }}>
              Спасибо. Мы рассмотрим вашу жалобу.
            </Box>
            <ButtonBase onClick={onClose} sx={primaryBtnSx}>
              Закрыть
            </ButtonBase>
          </Box>
        ) : (
          <>
            <Box sx={scrollAreaSx}>
              <Box sx={hintSx}>Выберите категорию, которая лучше всего описывает проблему.</Box>

              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {reportReasons.map(reason => {
                  const active = selectedReason === reason
                  return (
                    <ButtonBase
                      key={reason}
                      onClick={() => setSelectedReason(reason)}
                      sx={itemBtnSx}
                    >
                      <Box sx={{ fontSize: 16, fontWeight: 700 }}>{reportReasonLabels[reason]}</Box>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          border: active
                            ? `7px solid ${colors.accent}`
                            : `2px solid ${colors.iconMuted}`,
                          flexShrink: 0,
                          transition: 'border-color 180ms ease, border-width 180ms ease',
                        }}
                      />
                    </ButtonBase>
                  )
                })}
              </Box>

              {error && (
                <Box sx={{ mt: 2, px: 2, color: colors.error, fontWeight: 700 }}>{error}</Box>
              )}
            </Box>

            <Box sx={footerSx}>
              <ButtonBase
                onClick={handleSubmit}
                disabled={!selectedReason || createReport.isPending}
                sx={{
                  ...primaryBtnSx,
                  backgroundColor: selectedReason ? colors.accent : colors.disabledBg,
                  color: selectedReason ? colors.surface : colors.textSoft,
                  '&:hover': {
                    backgroundColor: selectedReason ? colors.accent : colors.disabledBg,
                    opacity: selectedReason ? 0.9 : 1,
                  },
                }}
              >
                {createReport.isPending ? 'Отправка...' : 'Пожаловаться'}
              </ButtonBase>
            </Box>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

const headerSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  px: 1,
  height: 56,
  flexShrink: 0,
  borderBottom: `1px solid ${colors.border}`,
}

const closeBtnSx = {
  width: 36,
  height: 36,
  borderRadius: '50%',
  color: colors.textSoft,
  transition: transitions.background,
  '&:hover': { backgroundColor: colors.hoverBg },
}

const accentLineSx = {
  height: 3,
  width: '34%',
  flexShrink: 0,
  backgroundColor: colors.accent,
}

const scrollAreaSx = { flex: 1, overflowY: 'auto', py: 2 }

const hintSx = {
  mb: 2,
  px: 2,
  fontSize: 16,
  lineHeight: 1.5,
  color: colors.textMuted,
}

const itemBtnSx = {
  width: '100%',
  minHeight: 58,
  justifyContent: 'space-between',
  gap: 2,
  px: 2,
  textAlign: 'left' as const,
  color: colors.text,
  transition: transitions.background,
  '&:hover': { backgroundColor: colors.hoverBg },
}

const footerSx = {
  display: 'flex',
  p: 2,
  flexShrink: 0,
  justifyContent: 'center',
  borderTop: `1px solid ${colors.border}`,
  boxShadow: alphaColors.bottomBarShadow,
}

const doneBlockSx = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  px: 3,
  textAlign: 'center' as const,
}

const primaryBtnSx = {
  width: '100%',
  maxWidth: 320,
  height: 56,
  borderRadius: radius.pill,
  backgroundColor: colors.accent,
  color: colors.surface,
  fontSize: 16,
  fontWeight: 700,
  transition: transitions.backgroundAndOpacity,
  '&:hover': { backgroundColor: colors.accent, opacity: 0.9 },
  '&.Mui-disabled': { color: colors.textSoft },
}
