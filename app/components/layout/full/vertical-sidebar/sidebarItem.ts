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
    icon: 'cpu-line-duotone',
    to: '/dashboard',
  },
  {
    title: 'Recordings',
    icon: 'planet-3-line-duotone',
    to: '/recordings',
  },
  {
    title: 'Admin',
    icon: 'settings-line-duotone',
    to: '/admin',
    requiresAdmin: true,
  },
  {
    title: 'Admin cust',
    icon: 'settings-line-duotone',
    to: '/admin/customers',
    requiresAdmin: true,
  },
]

export default sidebarItem
