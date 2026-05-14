import { Box } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import type { ReactNode } from 'react'
import { Skeleton } from './Skeleton'
import { colors } from '@shared/styles'

type Props = {
  avatarSize?: number
  /** Ширины «строк» содержимого. Первая считается заголовком. */
  lines?: (number | string)[]
  /** Узел под телом (например, иконки действий). */
  footer?: ReactNode
  /** Рисовать ли свою рамку-обёртку. */
  bordered?: boolean
}

const defaultLines = ['40%', '100%', '100%', '60%']

export const MediaSkeleton = ({
  avatarSize = 44,
  lines = defaultLines,
  footer,
  bordered = false,
}: Props) => (
  <Box sx={wrapSx(bordered)}>
    <Skeleton width={avatarSize} height={avatarSize} circle />
    <Box sx={bodySx}>
      {lines.map((width, i) => (
        <Skeleton key={i} width={width} height={i === 0 ? 8 : 7} />
      ))}
      {footer}
    </Box>
  </Box>
)

const wrapSx = (bordered: boolean) =>
  ({
    display: 'flex',
    gap: 2,
    p: 2,
    backgroundColor: colors.surface,
    ...(bordered && {
      borderBottom: `1px solid ${colors.border}`,
    }),
  }) as const

const bodySx: SystemStyleObject<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  flex: 1,
  minWidth: 0,
}
