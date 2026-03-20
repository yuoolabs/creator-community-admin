export type PostRow = {
  id: string
  title: string
  coverUrl: string
  authorAvatar: string
  authorName: string
  authorId: string
  status: '待审核' | '已通过' | '已拒绝' | '已删除'
  likes: number
  comments: number
  views: number
  createdAt: string
  activityName?: string
  platform?: string
  platformUrl?: string
  isFeatured?: boolean
  ipCategory?: string
  workAttribute?: string
}

const platformNames = ['抖音', '小红书', '哔哩哔哩']
const ipCategoryNames = ['美妆分类', '户外运动', '美食Share', 'PLAZA']
const workAttributeNames = ['美妆分类', '户外运动', '美食Share', 'PLAZA']

const activityNames = [
  '春季穿搭灵感征集',
  '新品开箱 7 天挑战',
  '品牌直播周任务',
  '街头美食探店打卡',
  '职场人翻包大赏',
  '新手创作者扶持计划'
]

const titles = [
  '2026年春季最全穿搭模板：告别乱穿衣，这3套模版直接照搬',
  '【沉浸式】开箱测评：最近风很大的全能型投影仪到底值不值得入？',
  '成都周边游：这个藏在深山里的日系小森林，居然藏着皮卡丘主题咖啡馆',
  '动物摄影日志：在西双版纳拍到可爱的国家保护动物亚洲黑熊',
  '早起后的独处时间：用一杯特调冰拿铁开启充满活力的一天',
  '去大理看一场最浪漫的海边日落，这组照片刷爆了我所有的朋友圈',
  '2026年武汉大学樱花季赏樱最全攻略：避开人流的最佳拍摄点位分享',
  '我的沉浸式极简生产力桌面 2.0 分享：如何把工作环境打造成自己最喜欢的空间',
  '谁能拒绝一只会撒娇的小猫咪呢？快来领取今日的高清治愈系吸猫能量',
  '极致美学：北欧风格家居设计的核心灵魂在于光影的运用',
  '新手厨娘挑战：用空气炸锅做出外酥里嫩的脆皮五花肉，真的绝了',
  '健身打卡第100天：从体弱多病到拥有马甲线，我只做了这几件事',
  '上海街头摄影：穿梭在弄堂与摩天大楼之间，寻找消失的海派年味',
  '职场成长指南：如何在高压环境下保持心态平稳并高效产出？',
  '深度评测：最新款折叠屏手机使用一个月后，我发现了这些优缺点',
  '露营日记：在阿那亚的海边支起帐篷，听着浪花声入眠的惊喜体验',
  '胶片摄影之美：用 Pentax 67 记录下的那些充满情绪感的日常瞬间',
  '私藏书单：在这个碎片化时代，这5本书值得你花一整天静下心阅读',
  '探店Vlog：这家藏在巷子里的手工披萨店，居然排队要两个小时？',
  '零基础学画画：从结构到色彩，我的21天插画进阶之路全记录',
  '我的理财观：25岁攒下人生第一个10万，我是如何进行资产配置的',
  '科技改变生活：智能家居系统全屋联动后的真实反馈，到底是不是智商税？',
  '深夜食堂：给自己做一碗热腾腾的味噌拉面，治愈所有的工作疲惫',
  '极简主义生活实证：丢掉90%的杂物后，我的生活质量反而提升了',
  '三亚旅行攻略：不住网红酒店，我也能玩出人少景美的地道海岛感',
  '关于AI绘画的深度思考：艺术的边界在哪里？人类画师会被取代吗？',
  '每日穿搭：今日份的法式复古感，全靠这件祖母绿羊绒大衣撑场面',
  '园艺新手必看：如何在家里的阳台打造一个四季常青的秘密花园',
  '冥想初体验：坚持练习7天后，我发现专注力得到了前所未有的提升',
  '咖啡探险：跨越半个城市去喝这杯手冲，风味层次真的惊艳到我了'
]

const names = ['我在，你在', '嗷呜', 'CoffeeLover', '旅行的意义', '樱花雪', 'TechFan', '铲屎官日常', '北欧控', '深夜美食家', '运动型男', '胶片控', '理财达人', '摄影师阿强']
const avatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
]

const covers = [
  'https://images.unsplash.com/photo-1539109132271-34999465d4f1?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1502404689626-64353efd0473?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1534823983341-d4e6e4aa046c?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1493638459223-28c0b5de78d0?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1500622764614-be358d8b87c3?w=600&h=600&fit=crop'
]

function generateRows(count: number, prefix: string, status: PostRow['status']): PostRow[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${prefix}-${i}`,
    title: titles[Math.floor(Math.random() * titles.length)],
    coverUrl: covers[Math.floor(Math.random() * covers.length)],
    authorAvatar: avatars[Math.floor(Math.random() * avatars.length)],
    authorName: names[Math.floor(Math.random() * names.length)],
    authorId: String(340000 + Math.floor(Math.random() * 1000)),
    status,
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
    views: Math.floor(Math.random() * 20000),
    createdAt: `2026-03-${String(Math.floor(Math.random() * 4) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    activityName: activityNames[Math.floor(Math.random() * activityNames.length)],
    platform: platformNames[Math.floor(Math.random() * platformNames.length)],
    platformUrl: 'https://www.xiaohongshu.com',
    isFeatured: status === '已通过' ? i % 3 === 0 : false,
    ipCategory: ipCategoryNames[Math.floor(Math.random() * ipCategoryNames.length)],
    workAttribute: workAttributeNames[Math.floor(Math.random() * workAttributeNames.length)],
  }))
}

const generated = [
  ...generateRows(25, 'pt-wait', '待审核'),
  ...generateRows(25, 'pt-pass', '已通过'),
  ...generateRows(10, 'pt-refuse', '已拒绝'),
  ...generateRows(10, 'pt-del', '已删除'),
]

export const postRows: PostRow[] = generated
