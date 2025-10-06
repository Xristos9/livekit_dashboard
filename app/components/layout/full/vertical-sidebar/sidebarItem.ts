export interface menu {
  header?: string
  title?: string
  icon?: any
  to?: string
  requiresAdmin?: boolean
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
    icon: 'chart-2-line-duotone',
    to: '/dashboard',
  },
  {
    title: 'Recordings',
    icon: 'video-frame-play-vertical-line-duotone',
    to: '/recordings',
  },
  {
    title: 'Admin Overview',
    icon: 'chart-line-duotone',
    to: '/admin',
    requiresAdmin: true,
  },
  {
    title: 'Manage Customers',
    icon: 'user-plus-rounded-line-duotone',
    to: '/admin/customers',
    requiresAdmin: true,
  },
]

export default sidebarItem
