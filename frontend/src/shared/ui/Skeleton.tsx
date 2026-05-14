import { Box } from '@mui/material'
import { colors, radius } from '@shared/styles'

type Props = {
  width?: number | string
  height?: number | string
  circle?: boolean
}

export const Skeleton = ({ width = '100%', height = 14, circle = false }: Props) => (
  <Box
    sx={{
      width,
      height,
      borderRadius: circle ? '50%' : radius.sm,
      backgroundColor: colors.border,
    }}
  />
)
