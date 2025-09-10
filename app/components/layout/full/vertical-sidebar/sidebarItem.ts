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
  {
    title: 'Dashboard',
    icon: 'cpu-line-duotone',
    to: '/ai-dashboard',
  },
  {
    title: 'Cold Calling',
    icon: 'phone-calling-rounded-line-duotone',
    to: '/cold-calling',
  },
  {
    title: 'Recordings',
    icon: 'planet-3-line-duotone',
    to: '/livekit-dashboard',
  },
]

export default sidebarItem
