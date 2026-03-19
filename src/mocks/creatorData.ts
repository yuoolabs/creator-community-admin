export type CreatorLevelRow = {
  id: string
  level: string
  levelName: string
  levelIcon?: string
  requiredScore: number
  creatorCount: number
  status: '已启用' | '已禁用'
}

export const creatorLevelRows: CreatorLevelRow[] = [
  {
    id: '1',
    level: 'L1',
    levelName: '等级一',
    levelIcon: 'https://cdn-icons-png.flaticon.com/128/2583/2583344.png',
    requiredScore: 0,
    creatorCount: 23,
    status: '已启用',
  },
  {
    id: '2',
    level: 'L2',
    levelName: '等级二',
    levelIcon: 'https://cdn-icons-png.flaticon.com/128/2583/2583319.png',
    requiredScore: 500,
    creatorCount: 12,
    status: '已启用',
  },
  {
    id: '3',
    level: 'L3',
    levelName: '等级三',
    levelIcon: 'https://cdn-icons-png.flaticon.com/128/2583/2583434.png',
    requiredScore: 800,
    creatorCount: 21,
    status: '已启用',
  },
  {
    id: '4',
    level: 'L4',
    levelName: '等级四',
    levelIcon: 'https://cdn-icons-png.flaticon.com/128/2583/2583448.png',
    requiredScore: 1200,
    creatorCount: 21,
    status: '已禁用',
  },
]
