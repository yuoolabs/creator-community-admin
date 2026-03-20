export type CreatorLevelRow = {
  id: string
  level: string
  levelName: string
  levelIcon?: string
  avatarFrame?: string
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
    avatarFrame: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 88 88'><defs><linearGradient id='g1' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23fde68a'/><stop offset='100%' stop-color='%23f59e0b'/></linearGradient></defs><rect x='5' y='5' width='78' height='78' rx='26' fill='none' stroke='url(%23g1)' stroke-width='8'/><circle cx='69' cy='19' r='7' fill='%23fff7d6' stroke='%23f59e0b' stroke-width='3'/></svg>",
    requiredScore: 0,
    creatorCount: 23,
    status: '已启用',
  },
  {
    id: '2',
    level: 'L2',
    levelName: '等级二',
    levelIcon: 'https://cdn-icons-png.flaticon.com/128/2583/2583319.png',
    avatarFrame: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 88 88'><defs><linearGradient id='g2' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%2393c5fd'/><stop offset='100%' stop-color='%232565eb'/></linearGradient></defs><rect x='5' y='5' width='78' height='78' rx='26' fill='none' stroke='url(%23g2)' stroke-width='8'/><path d='M16 66c12-7 44-7 56 0' fill='none' stroke='%23bfdbfe' stroke-width='4' stroke-linecap='round'/></svg>",
    requiredScore: 500,
    creatorCount: 12,
    status: '已启用',
  },
  {
    id: '3',
    level: 'L3',
    levelName: '等级三',
    levelIcon: 'https://cdn-icons-png.flaticon.com/128/2583/2583434.png',
    avatarFrame: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 88 88'><defs><linearGradient id='g3' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23c4b5fd'/><stop offset='100%' stop-color='%237c3aed'/></linearGradient></defs><rect x='5' y='5' width='78' height='78' rx='26' fill='none' stroke='url(%23g3)' stroke-width='8'/><circle cx='22' cy='22' r='6' fill='%23ede9fe'/><circle cx='66' cy='66' r='6' fill='%23ddd6fe'/></svg>",
    requiredScore: 800,
    creatorCount: 21,
    status: '已启用',
  },
  {
    id: '4',
    level: 'L4',
    levelName: '等级四',
    levelIcon: 'https://cdn-icons-png.flaticon.com/128/2583/2583448.png',
    avatarFrame: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 88 88'><defs><linearGradient id='g4' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23fda4af'/><stop offset='100%' stop-color='%23e11d48'/></linearGradient></defs><rect x='5' y='5' width='78' height='78' rx='26' fill='none' stroke='url(%23g4)' stroke-width='8'/><path d='M23 21l6 6M59 61l6 6M59 27l6-6M23 67l6-6' stroke='%23fecdd3' stroke-width='4' stroke-linecap='round'/></svg>",
    requiredScore: 1200,
    creatorCount: 21,
    status: '已禁用',
  },
]
