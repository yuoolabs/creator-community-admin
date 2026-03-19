export type BadgeRow = {
  id: string
  badgeName: string
  iconUrl: string
  description?: string
  remark?: string
  owners: number
  status: '启用' | '停用'
  updatedAt: string
}

export const badgeRows: BadgeRow[] = [
  {
    id: 'bd-1',
    badgeName: '创作大师',
    iconUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=200&h=200&fit=crop',
    description: '授予在社区发表超过50篇优质作品的创作者',
    remark: '系统自动核算发放',
    owners: 86,
    status: '启用',
    updatedAt: '2026-03-02 09:30',
  },
  {
    id: 'bd-2',
    badgeName: '活跃先锋',
    iconUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=200&h=200&fit=crop',
    description: '连续30天登录并产生互动的用户可获得',
    remark: '年度活跃度评估使用',
    owners: 1208,
    status: '启用',
    updatedAt: '2026-02-28 14:10',
  },
  {
    id: 'bd-3',
    badgeName: '元老勋章',
    iconUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=200&h=200&fit=crop',
    description: '社区内测阶段加入的第一批核心用户',
    remark: '已停止发放',
    owners: 5302,
    status: '停用',
    updatedAt: '2026-02-12 18:40',
  },
  {
    id: 'bd-4',
    badgeName: '独到见解',
    iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop',
    description: '评论被选为精华累计达到100次',
    owners: 245,
    status: '启用',
    updatedAt: '2026-03-01 15:20',
  },
  {
    id: 'bd-5',
    badgeName: '意见领袖',
    iconUrl: 'https://images.unsplash.com/photo-1560015534-cee980ba7e13?w=200&h=200&fit=crop',
    description: '粉丝数突破1万且内容质量评分持续S级',
    remark: '人工审核发放',
    owners: 42,
    status: '启用',
    updatedAt: '2026-03-03 11:05',
  },
  {
    id: 'bd-6',
    badgeName: '人气推荐',
    iconUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=200&h=200&fit=crop',
    description: '单篇作品点赞量突破10万的特别荣誉',
    owners: 890,
    status: '启用',
    updatedAt: '2026-02-25 10:30',
  }
]
