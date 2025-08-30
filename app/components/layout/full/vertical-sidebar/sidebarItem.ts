export interface menu {
  header?: string
  title?: string
  icon?: any
  to?: string
  chip?: string
  BgColor?: string
  chipBgColor?: string
  chipColor?: string
  chipVariant?: string
  chipIcon?: string
  children?: menu[]
  disabled?: boolean
  type?: string
  subCaption?: string
  external?: boolean
}

const sidebarItem: menu[] = [
  { header: 'Home' },
  {
    title: 'Dashboard',
    icon: 'adhesive-plaster-outline',
    to: '/dashboard',
  },
  { header: 'Pages' },
  {
    title: 'Sample Page',
    icon: 'planet-3-line-duotone',
    to: '/sample-page',
  },
  {
    title: 'LiveKit',
    icon: 'planet-3-line-duotone',
    to: '/livekit-dashboard',
  },
  {
    title: 'AI Dashboard',
    icon: 'cpu-line-duotone',
    to: '/ai-dashboard',
  },
  { header: 'auth' },
  {
    title: 'Login',
    icon: 'login-3-line-duotone',
    to: '/auth/login',
  },
  {
    title: 'Register',
    icon: 'user-plus-rounded-line-duotone',
    to: '/auth/register',
  },
]

export default sidebarItem
