import { Box } from '@mui/material'

type Props = {
  value: number
  max?: number
  overflowFullScale?: number
}

export const CharacterCounter = ({ value, max = 300, overflowFullScale = 100 }: Props) => {
  const remainingCharacters = max - value
  const overflowCharacters = Math.max(0, value - max)
  const progress = Math.min(value / max, 1)
  const overflowProgress = Math.min(overflowCharacters / overflowFullScale, 1)
  const ringRadius = 10
  const ringCircumference = 2 * Math.PI * ringRadius
  const ringOffset = ringCircumference * (1 - progress)
  const overflowSectorPath = getSectorPath(12, 12, ringRadius - 0.8, overflowProgress)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box
        sx={{
          fontSize: 13,
          fontWeight: 500,
          color: remainingCharacters <= 0 ? '#ef4444' : '#828283',
        }}
      >
        {remainingCharacters}
      </Box>
      <Box
        sx={{
          width: 24,
          height: 24,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r={ringRadius} fill="none" stroke="#dbe4f0" strokeWidth="2" />
          {overflowCharacters > 0 ? (
            <>
              <circle cx="12" cy="12" r={ringRadius} fill="none" stroke="#ef4444" strokeWidth="2" />
              <path d={overflowSectorPath} fill="#dc2626" opacity="0.95" />
            </>
          ) : (
            <circle
              cx="12"
              cy="12"
              r={ringRadius}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringOffset}
              transform="rotate(-90 12 12)"
              style={{ transition: 'stroke-dashoffset 180ms ease' }}
            />
          )}
        </svg>
      </Box>
    </Box>
  )
}

const getSectorPath = (cx: number, cy: number, radius: number, progress: number) => {
  if (progress <= 0) return ''

  const angle = Math.min(progress, 1) * Math.PI * 2
  const startX = cx
  const startY = cy - radius

  if (progress >= 1) {
    return `M ${cx} ${cy} m 0 ${-radius} a ${radius} ${radius} 0 1 1 0 ${
      radius * 2
    } a ${radius} ${radius} 0 1 1 0 ${-radius * 2} Z`
  }

  const endX = cx + radius * Math.sin(angle)
  const endY = cy - radius * Math.cos(angle)
  const largeArcFlag = angle > Math.PI ? 1 : 0

  return `M ${cx} ${cy} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`
}
