export type CreatorLevel = 'L1 新手' | 'L2 活跃' | 'L3 专业' | 'L4 明星' | 'L5 传说'

export type CreatorBadge = 'trophy' | 'settings' | 'up' | 'star' | 'diamond'

export type CreatorManagementRow = {
  id: string
  name: string
  handle?: string
  avatarUrl?: string
  avatarFallback: string
  phone: string
  level: CreatorLevel
  totalValue: number
  works: number
  badges: CreatorBadge[]
  extraBadgeCount?: number
  verifiedPlatforms: string[]
  certificationTime: string
}


export const creatorManagementRows: CreatorManagementRow[] = [
  {
    id: 'cm-1',
    name: '张莎拉',
    avatarFallback: 'ZS',
    phone: '13812341234',
    level: 'L4 明星',
    totalValue: 4890,
    works: 42,
    badges: ['trophy', 'settings'],
    verifiedPlatforms: ['小红书', '抖音'],
    certificationTime: '2025-12-18',
  },
  {
    id: 'cm-2',
    name: '王强',
    avatarFallback: 'WQ',
    phone: '13956785678',
    level: 'L2 活跃',
    totalValue: 850,
    works: 12,
    badges: ['up'],
    verifiedPlatforms: ['抖音'],
    certificationTime: '2026-01-06',
  },
  {
    id: 'cm-3',
    name: '李琳',
    avatarFallback: 'LL',
    phone: '13699889988',
    level: 'L5 传说',
    totalValue: 12400,
    works: 156,
    badges: ['star', 'diamond'],
    extraBadgeCount: 2,
    verifiedPlatforms: ['小红书', '抖音', '哔哩哔哩'],
    certificationTime: '2025-08-22',
  },
  {
    id: 'cm-4',
    name: '赵汤姆',
    handle: '@cook.tom',
    avatarFallback: 'ZT',
    phone: '13544334433',
    level: 'L3 专业',
    totalValue: 1230,
    works: 28,
    badges: [],
    verifiedPlatforms: ['哔哩哔哩'],
    certificationTime: '2026-02-10',
  },
  {
    id: 'cm-5',
    name: '珍妮',
    avatarFallback: 'JW',
    phone: '15090909090',
    level: 'L1 新手',
    totalValue: 50,
    works: 1,
    badges: [],
    verifiedPlatforms: [],
    certificationTime: '2026-03-01',
  },
]
