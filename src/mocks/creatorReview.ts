import type { CreatorReviewRow, StatusStyleMap } from '../types/admin'
import { figmaAssets } from './assets'

export const statusStyles: StatusStyleMap = {
  pending: {
    color: '#b45309',
    bg: '#fffbeb',
    border: '#fde68a',
    text: '待审核',
  },
  approved: {
    color: '#15803d',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    text: '已通过',
  },
  rejected: {
    color: '#b91c1c',
    bg: '#fef2f2',
    border: '#fecaca',
    text: '已驳回',
  },
}

const proofImages = [
  figmaAssets.proof1,
  figmaAssets.proof2,
  figmaAssets.proof3,
  figmaAssets.proof4,
  figmaAssets.proof5,
]

const platforms = ['小红书', '抖音', '哔哩哔哩'] as const

const mockNicknames = [
  '山间清风', '晨曦微露', '极客张', '咖啡瘾君子', '流浪诗人',
  '代码诗人', '风之子', '星空守护者', '深夜食堂', '半夏微蓝',
  '冬日暖阳', '秋水长天', '自在如风', '听海的人', '墨笔生香',
  '指尖温度', '独行侠', '快乐的小白', '灵感捕手', '造梦者',
  '不眠之夜', '静静的思考', '远方的鼓声', '光影漫步', '文字旅者'
]

function buildCreatorRows(
  status: CreatorReviewRow['status'],
  count: number,
  seed: number,
): CreatorReviewRow[] {
  return Array.from({ length: count }, (_, index) => {
    const serial = seed + index + 1
    const hour = 9 + (index % 10)
    const minute = (index * 7) % 60
    const day = 1 + (index % 4)
    const isRejected = status === 'rejected'
    const nickname = mockNicknames[serial % mockNicknames.length]

    return {
      id: `${status}-${serial}`,
      userName: nickname,
      userAvatar: '',
      phone: `13${String(serial % 10).repeat(1)}${String(12345678 + serial)}`.slice(0, 11),
      platform: platforms[index % platforms.length],
      accountId: String(784532109 + serial * 1234),
      accountNickname: `${nickname}的${platforms[index % platforms.length]}`,
      proofImage: proofImages[index % proofImages.length],
      submittedAt: `2026-03-0${day} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      status,
      rejectReason: isRejected ? '资料不完整，请补充手机号实名认证截图后重提。' : undefined,
      actions: status === 'pending' ? ['通过', '拒绝'] : isRejected ? ['查看原因'] : [],
    }
  })
}

export const creatorRows: CreatorReviewRow[] = [
  ...buildCreatorRows('pending', 22, 0),
  ...buildCreatorRows('approved', 22, 100),
  ...buildCreatorRows('rejected', 22, 200),
]

export const platformOptions = [
  { label: '所属平台', value: 'all' },
  { label: '小红书', value: '小红书' },
  { label: '抖音', value: '抖音' },
  { label: '哔哩哔哩', value: '哔哩哔哩' },
]

export const sortOptions = [
  { label: '最新优先', value: 'latest' },
  { label: '最早优先', value: 'earliest' },
]
