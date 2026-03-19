import type { NavItem } from '../types/admin'

export const managementNavItems: NavItem[] = [
  {
    key: '/work-management',
    label: '作品管理',
    routePath: '/work-management',
  },
  {
    key: '/creator-review',
    label: '创作者审核',
    routePath: '/creator-review',
  },
  {
    key: '/creator-management',
    label: '创作者管理',
    routePath: '/creator-management',
  },
  {
    key: '/creator-level',
    label: '创作者等级',
    routePath: '/creator-level',
  },
  {
    key: '/campaign',
    label: '活动管理',
    routePath: '/campaign',
  },
  {
    key: '/badge-system',
    label: '勋章管理',
    routePath: '/badge-system',
  },
  {
    key: '/settings',
    label: '基础设置',
    routePath: '/settings',
  },
]

export const settingNavItems: NavItem[] = []
