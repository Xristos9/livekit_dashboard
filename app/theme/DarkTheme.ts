import type { ThemeTypes } from '@/types/themeTypes/ThemeType'

const DARK_BLUE_THEME: ThemeTypes = {
  name: 'DARK_BLUE_THEME',
  dark: true,
  variables: {
    'border-color': '#e0e6eb',
    'border-opacity': 1,
  },
  colors: {
    primary: '#635BFF', // keep brand colors same
    secondary: '#14E9E2',
    info: '#46caeb',
    success: '#36c76c',
    warning: '#ffd648',
    error: '#ff6692',
    lightprimary: '#3B36A8', // darker tints for "light" variants
    lightsecondary: '#127E79',
    lightsuccess: '#1F5C3A',
    lighterror: '#99334D',
    lightinfo: '#236C7D',
    lightwarning: '#8C7825',
    textPrimary: '#F4F7FB', // light text on dark bg
    textSecondary: '#AABAC5',
    borderColor: '#29343d', // subtle dark borders
    containerBg: '#1E1E2E', // card/surface backgrounds
    background: '#1f2a3d', // main app background
    hoverColor: '#1F2833', // hover state
    surface: '#1a2537', // panels, modals
    grey100: '#29343d', // flipped roles
    grey200: '#EAEFF4',
    light: '#1C1C26', // alt backgrounds
    muted: '#7b8893', // muted text/labels
  },
}

export { DARK_BLUE_THEME }
