export const colors = {
  pageBg: '#ffffff',
  surface: '#ffffff',
  border: '#e2e8f0',
  inputBorder: '#dbe4f0',
  inputFocusBorder: '#c6d2e1',
  inputBg: '#f7f9f9',
  inputFocusBg: '#eef2f7',
  hoverBg: '#e7e7e8',
  hoverBgStrong: '#e0e0e1',
  selectedBg: '#f0f0f1',
  activeBg: '#edf4ff',
  activeHoverBg: '#e4efff',
  disabledBg: '#cbd5e1',
  text: '#0f172a',
  textSoft: '#334765',
  textMuted: '#536471',
  iconMuted: '#8FA1BF',
  iconMutedHover: '#7C92B0',
  accent: '#1d9bf0',
  accentHover: '#272c30',
  like: '#fb2c36',
  comment: '#2b7fff',
  black: '#000000',
  error: '#dc2626',
} as const

export const alphaColors = {
  accentHoverBg: 'rgba(43, 127, 255, 0.12)',
  likeHoverBg: 'rgba(251, 44, 54, 0.12)',
  overlay: 'rgba(15, 23, 42, 0.8)',
  cameraOverlayBg: 'rgba(15, 23, 42, 0.5)',
  cameraOverlayHoverBg: 'rgba(15, 23, 42, 0.45)',
  imageRemoveBg: 'rgba(0, 0, 0, 0.5)',
  imageRemoveHoverBg: 'rgba(0, 0, 0, 0.7)',
  imagePreviewBg: 'rgba(0, 0, 0, 1)',
  imagePreviewButtonBg: 'rgba(0, 0, 0, 0.7)',
  imagePreviewButtonHoverBg: 'rgba(20, 20, 20, 0.7)',
  modalShadow: '0 20px 60px rgba(15, 23, 42, 0.18)',
  popoverShadow: '0 16px 40px rgba(15, 23, 42, 0.14)',
  bottomBarShadow: '0 -8px 24px rgba(15, 23, 42, 0.08)',
} as const

export const radius = {
  sm: 2,
  md: 3,
  lg: 4,
  pill: 999,
} as const

export const transitions = {
  background: 'background-color 180ms ease',
  color: 'color 180ms ease',
  backgroundAndColor: 'background-color 180ms ease, color 180ms ease',
  backgroundAndBorder: 'background-color 180ms ease, border-color 180ms ease',
  backgroundAndOpacity: 'background-color 180ms ease, opacity 180ms ease',
} as const

export const breakpoints = {
  compactSidebar: '@media (max-width: 1350px)',
  tablet: '@media (max-width: 1100px)',
  mobile: '@media (max-width: 800px)',
} as const
