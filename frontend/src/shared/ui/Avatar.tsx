import { Box } from '@mui/material'
import { resolveAssetUrl } from '@shared/config'

type Props = {
  src: string
  size: number
}

export const Avatar = ({ src, size }: Props) => {
  return (
    <Box
      component="img"
      src={resolveAssetUrl(src)}
      alt="avatar"
      sx={{ flexShrink: 0, width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}
    />
  )
}
