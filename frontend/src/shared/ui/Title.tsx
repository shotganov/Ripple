import { Box } from '@mui/material'
import { colors } from '../styles/tokens'

type Props = {
  text: string
  fontSize: number
}

export const Title = ({ text, fontSize }: Props) => {
  return (
    <Box
      sx={{
        fontSize: fontSize,
        fontWeight: '700',
        color: colors.text,
      }}
    >
      {text}
    </Box>
  )
}
