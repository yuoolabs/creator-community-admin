export type CampaignRow = {
  id: string
  displayId: string
  name: string
  coverUrl: string
  type: '图文征集' | '视频挑战' | '直播任务'
  tag: string
  startAt: string
  endAt: string
  participants: number
  worksCount: number
  activitySort: number
  status: '进行中' | '未开始' | '已结束' | '已失效'
}

export const campaignRows: CampaignRow[] = [
  {
    id: 'cp-1',
    displayId: '482731',
    name: '春季穿搭灵感征集',
    coverUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=400&fit=crop',
    type: '图文征集',
    tag: '热门',
    startAt: '2026-03-01',
    endAt: '2026-03-20',
    participants: 928,
    worksCount: 1450,
    activitySort: 1,
    status: '进行中',
  },
  {
    id: 'cp-2',
    displayId: '915204',
    name: '新品开箱 7 天挑战',
    coverUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
    type: '视频挑战',
    tag: '有奖',
    startAt: '2026-03-10',
    endAt: '2026-03-17',
    participants: 342,
    worksCount: 0,
    activitySort: 2,
    status: '未开始',
  },
  {
    id: 'cp-3',
    displayId: '206487',
    name: '品牌直播周任务',
    coverUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&h=400&fit=crop',
    type: '直播任务',
    tag: '官方',
    startAt: '2026-02-18',
    endAt: '2026-02-25',
    participants: 211,
    worksCount: 380,
    activitySort: 3,
    status: '已结束',
  },
  {
    id: 'cp-4',
    displayId: '734159',
    name: '街头美食探店打卡',
    coverUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop',
    type: '视频挑战',
    tag: '热门',
    startAt: '2026-03-05',
    endAt: '2026-03-25',
    participants: 1042,
    worksCount: 2280,
    activitySort: 4,
    status: '进行中',
  },
  {
    id: 'cp-5',
    displayId: '590318',
    name: '职场人翻包大赏',
    coverUrl: 'https://images.unsplash.com/photo-1542451542907-6cf80ff362d6?w=600&h=400&fit=crop',
    type: '图文征集',
    tag: '有奖',
    startAt: '2026-01-10',
    endAt: '2026-01-30',
    participants: 1530,
    worksCount: 1890,
    activitySort: 5,
    status: '已结束',
  },
  {
    id: 'cp-6',
    displayId: '841962',
    name: '新手创作者扶持计划',
    coverUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
    type: '直播任务',
    tag: '限时',
    startAt: '2026-03-15',
    endAt: '2026-04-15',
    participants: 4500,
    worksCount: 0,
    activitySort: 6,
    status: '未开始',
  },
  {
    id: 'cp-7',
    displayId: '673580',
    name: '冬季护肤好物推荐',
    coverUrl: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=600&h=400&fit=crop',
    type: '图文征集',
    tag: '精华',
    startAt: '2025-11-20',
    endAt: '2025-12-20',
    participants: 809,
    worksCount: 1024,
    activitySort: 7,
    status: '已失效',
  },
  {
    id: 'cp-8',
    displayId: '128946',
    name: '全民健身云运动',
    coverUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop',
    type: '视频挑战',
    tag: '热门',
    startAt: '2026-03-02',
    endAt: '2026-04-02',
    participants: 3410,
    worksCount: 5200,
    activitySort: 8,
    status: '进行中',
  },
];
