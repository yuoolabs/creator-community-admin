import {
  CalendarOutlined,
  EyeOutlined,
  HeartOutlined,
  TrophyFilled,
  SoundOutlined,
  StarFilled,
  LeftOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Card, Col, Empty, Pagination, Row, Space, Table, Tabs, Tag, Typography, Modal, Checkbox, message, InputNumber } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PlatformBadge from '../../components/common/PlatformBadge'
import { creatorManagementRows } from '../../mocks/creatorManagement'
import { postRows } from '../../mocks/worksReview'

const { Text, Title } = Typography

type WorkStatus = 'published' | 'reviewing' | 'rejected'

type WorkItem = {
  id: string
  title: string
  platform: '小红书' | '抖音' | '哔哩哔哩'
  date: string
  views: string
  likes: string
  cover: string
  status: WorkStatus
  actionText: string
  warnText?: string
}

type ActivityParticipationItem = {
  key: string
  activityName: string
  activityId: string
  publishTime: string
  workId: string
}

const workCoverRows = postRows.slice(0, 6)

const works: WorkItem[] = [
  {
    id: '482731',
    title: '如何使用新款咖啡机制作拉花？新手必看教程 #生活美学',
    platform: '小红书',
    date: '2023-10-24',
    views: '12.5k',
    likes: '892',
    cover: workCoverRows[0]?.coverUrl ?? '',
    status: 'published',
    actionText: '查看',
  },
  {
    id: '915204',
    title: '秋季穿搭分享 Vol.03 | 职场人的温柔力量',
    platform: '抖音',
    date: '2023-10-22',
    views: '16.2k',
    likes: '1.2k',
    cover: workCoverRows[1]?.coverUrl ?? '',
    status: 'reviewing',
    actionText: '详情',
  },
  {
    id: '206487',
    title: '如何使用新款咖啡机制作拉花？新手必看教程 #生活美学',
    platform: '小红书',
    date: '2023-10-24',
    views: '12.5k',
    likes: '892',
    cover: workCoverRows[2]?.coverUrl ?? '',
    status: 'published',
    actionText: '查看',
  },
  {
    id: '734512',
    title: '探店日记：藏在弄堂里的法式浪漫 bistro',
    platform: '小红书',
    date: '2023-10-15',
    views: '45.2k',
    likes: '3.4k',
    cover: workCoverRows[3]?.coverUrl ?? '',
    status: 'published',
    actionText: '查看',
  },
  {
    id: '641908',
    title: '【VLOG】周末去哪儿？大学生特种兵一日游',
    platform: '小红书',
    date: '2023-10-01',
    views: '8.8k',
    likes: '516',
    cover: workCoverRows[4]?.coverUrl ?? '',
    status: 'rejected',
    actionText: '查看原因',
    warnText: '内容包含违禁词',
  },
  {
    id: '558320',
    title: '如何使用新款咖啡机制作拉花？新手必看教程 #生活美学',
    platform: '小红书',
    date: '2023-10-24',
    views: '12.5k',
    likes: '892',
    cover: workCoverRows[5]?.coverUrl ?? '',
    status: 'published',
    actionText: '查看',
  },
]

const activityParticipationRows: ActivityParticipationItem[] = works.map((work, index) => ({
  key: `${work.id}-${index}`,
  activityName: postRows[index]?.activityName ?? `活动 ${index + 1}`,
  activityId: String(480000 + index * 137),
  publishTime: work.date,
  workId: work.id,
}))

const availableBadges = [
  { id: 'b1', label: '百大创作者', icon: <TrophyFilled />, color: 'gold' },
  { id: 'b2', label: '传播大使', icon: <SoundOutlined />, color: 'blue' },
  { id: 'b3', label: '创意之星', icon: <StarFilled />, color: 'purple' },
  { id: 'b4', label: '人气王', icon: <HeartOutlined />, color: 'red' },
  { id: 'b5', label: '新晋翘楚', icon: <StarFilled />, color: 'green' },
]

function calculateNextLevel(value: number): string {
  if (value >= 10000) return 'L5 明星+'
  if (value >= 5000) return 'L4 明星'
  if (value >= 2000) return 'L3 资深'
  if (value >= 500) return 'L2 进阶'
  return 'L1 新人'
}

function statusMeta(status: WorkStatus) {

  if (status === 'published') return { text: '已发布', className: 'status-published' }
  if (status === 'reviewing') return { text: '审核中', className: 'status-reviewing' }
  return { text: '被驳回', className: 'status-rejected' }
}

function formatJoinDate(id: string) {
  const suffix = id.replace(/\D/g, '').slice(-2) || '15'
  return `2023-01-${suffix.padStart(2, '0')}`
}

export default function CreatorDetailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const creatorId = searchParams.get('id') ?? ''

  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false)
  const [selectedBadgeIds, setSelectedBadgeIds] = useState<string[]>(['b1', 'b2', 'b3'])
  const [creatorValue, setCreatorValue] = useState<number>(0)
  const [isEditValueModalOpen, setIsEditValueModalOpen] = useState(false)
  const [tempValue, setTempValue] = useState<number>(0)

  const currentLevel = useMemo(() => calculateNextLevel(creatorValue), [creatorValue])
  const nextLevel = useMemo(() => calculateNextLevel(tempValue), [tempValue])
  const levelChanged = currentLevel !== nextLevel
  const isUpgrade = tempValue > creatorValue


  const creator = useMemo(
    () => creatorManagementRows.find((item) => item.id === creatorId),
    [creatorId],
  )

  useEffect(() => {
    if (creator) {
      setCreatorValue(creator.totalValue)
      setTempValue(creator.totalValue)
    }
  }, [creator])

  const currentBadges = useMemo(
    () => availableBadges.filter(b => selectedBadgeIds.includes(b.id)),
    [selectedBadgeIds]
  )

  const activityColumns: ColumnsType<ActivityParticipationItem> = [
    {
      title: '活动名称',
      dataIndex: 'activityName',
      key: 'activityName',
    },
    {
      title: '活动 ID',
      dataIndex: 'activityId',
      key: 'activityId',
      width: 140,
    },
    {
      title: '作品发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      width: 180,
    },
    {
      title: '作品 ID',
      dataIndex: 'workId',
      key: 'workId',
      width: 120,
    },
  ]

  const handleUpdateBadges = () => {
    setIsBadgeModalOpen(false)
    message.success('勋章更新成功')
  }

  const handleUpdateValue = () => {
    setCreatorValue(tempValue)
    setIsEditValueModalOpen(false)
    message.success('创作值已更新')
  }

  if (!creator) {


    return (
      <div className="page-stack">
        <Card className="table-card" styles={{ body: { padding: 28 } }}>
          <Empty description="未找到创作者信息" />
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Button onClick={() => navigate('/creator-management')}>返回创作者管理</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="creator-detail-page">
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          color: '#1f2937'
        }}
        onClick={() => navigate('/creator-management')}
      >
        <LeftOutlined style={{ fontSize: 18 }} />
        创作者详情
      </div>


      <Row gutter={[16, 16]} align="stretch">
        <Col xs={24} xl={17} className="creator-top-col">
          <Card className="creator-overview-card" bordered={false}>
            <div className="creator-overview-inner">
              <Avatar size={96} className="creator-avatar" src={creator.avatarUrl}>
                {creator.avatarFallback}
              </Avatar>
              <div className="creator-overview-main">
                <Space size={12} align="center">
                  <Title level={2} style={{ margin: 0 }}>
                    {creator.name}
                  </Title>
                  <Tag color="purple" bordered={false}>
                    {creator.level}
                  </Tag>
                  <div className="creator-score-wrap">
                    <span className="creator-score-text">
                      创作值 {creatorValue.toLocaleString('zh-CN')}
                    </span>
                    <span className="edit-score-btn" onClick={() => setIsEditValueModalOpen(true)}>
                      <EditOutlined /> 修改
                    </span>
                  </div>
                </Space>

                <Text className="creator-detail-phone">手机号：{creator.phone}</Text>
                <Text className="join-time">
                  <CalendarOutlined /> 加入创作者时间: {formatJoinDate(creator.id)}
                </Text>
                <Space size={12} className="platform-badges">
                  <PlatformBadge
                    platform="小红书"
                    compact
                    verified={creator.verifiedPlatforms.includes('小红书')}
                  />
                  <PlatformBadge
                    platform="抖音"
                    compact
                    verified={creator.verifiedPlatforms.includes('抖音')}
                  />
                  <PlatformBadge
                    platform="哔哩哔哩"
                    compact
                    verified={creator.verifiedPlatforms.includes('哔哩哔哩')}
                  />
                </Space>

              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} xl={7} className="creator-top-col">
          <Card
            className="creator-badges-card"
            bordered={false}
            title="获得勋章"
            extra={<a onClick={() => setIsBadgeModalOpen(true)}>添加</a>}
          >
            <div className="badge-list">
              {currentBadges.map(badge => (
                <div className="badge-item" key={badge.id}>
                  <span className={`badge-icon ${badge.color}`}>
                    {badge.icon}
                  </span>
                  <span>{badge.label}</span>
                </div>
              ))}
              {currentBadges.length === 0 && (
                <Text type="secondary" style={{ padding: '8px 0' }}>暂无勋章</Text>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Modal
        title="管理创作者勋章"
        open={isBadgeModalOpen}
        onOk={handleUpdateBadges}
        onCancel={() => setIsBadgeModalOpen(false)}
        width={520}
      >
        <div style={{ padding: '12px 0' }}>
          <Checkbox.Group
            style={{ width: '100%' }}
            value={selectedBadgeIds}
            onChange={(checkedValues) => setSelectedBadgeIds(checkedValues as string[])}
          >
            <Row gutter={[16, 24]} justify="start">
              {availableBadges.map(badge => (
                <Col span={8} key={badge.id} style={{ display: 'flex', justifyContent: 'center' }}>
                  <Checkbox value={badge.id} className="badge-checkbox-group">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <span className={`badge-icon-sm ${badge.color}`} style={{ width: 36, height: 36, fontSize: 18 }}>
                        {badge.icon}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: '#334155' }}>{badge.label}</span>
                    </div>
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </div>
      </Modal>


      <Modal
        title="修改创作值"
        open={isEditValueModalOpen}
        onOk={handleUpdateValue}
        onCancel={() => setIsEditValueModalOpen(false)}
        width={320}
        centered
      >
        <div style={{ padding: '16px 0' }}>
          <div style={{ marginBottom: 12, color: '#64748b' }}>当前值：{creatorValue.toLocaleString()} ({currentLevel})</div>
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            size="large"
            value={tempValue}
            onChange={(val) => setTempValue(val || 0)}
            placeholder="请输入新的创作值"
          />
          {levelChanged && (
            <div style={{ marginTop: 12, color: isUpgrade ? '#10b981' : '#f43f5e', fontSize: 13, fontWeight: 500 }}>
              修改后将{isUpgrade ? '升级' : '降级'}为 {nextLevel}
            </div>
          )}
        </div>

      </Modal>

      <Card className="creator-works-wrap" bordered={false} style={{ marginTop: 16 }}>
        <Tabs
          defaultActiveKey="works"
          items={[
            {
              key: 'works',
              label: '作品详情',
              children: (
                <>
                  <div className="creator-stats-list">
                    <div className="creator-stat-item">
                      <span className="creator-stat-label">累计发布作品数：</span>
                      <span className="creator-stat-value">232</span>
                    </div>
                    <div className="creator-stat-item">
                      <span className="creator-stat-label">优秀作品数：</span>
                      <span className="creator-stat-value">123</span>
                    </div>
                    <div className="creator-stat-item">
                      <span className="creator-stat-label">累计获赞数：</span>
                      <span className="creator-stat-value">23423</span>
                    </div>
                  </div>

                  <div className="creator-works-divider" />

                  <Row gutter={[16, 16]}>
                    {works.map((work) => {
                      const status = statusMeta(work.status)
                      return (
                        <Col key={work.id} xs={24} md={12} xl={8}>
                          <div className="work-card">
                            <div className="work-cover-wrap">
                              <img src={work.cover} alt={work.title} className="work-cover" />
                              <span className={`work-status ${status.className}`}>{status.text}</span>
                            </div>
                            <div className="work-body">
                              <div className="work-meta">
                                <PlatformBadge platform={work.platform} compact />
                                <Text type="secondary">{work.date}</Text>
                              </div>
                              <div className="work-title">{work.title}</div>
                              <div className="work-footer">
                                <div>
                                  <Text type="secondary">
                                    <EyeOutlined /> {work.views}
                                  </Text>
                                  <Text type="secondary" style={{ marginLeft: 12 }}>
                                    <HeartOutlined /> {work.likes}
                                  </Text>
                                </div>
                                <a>{work.actionText}</a>
                              </div>
                              {work.warnText && work.status !== 'rejected' ? (
                                <div className="work-warn">△ {work.warnText}</div>
                              ) : null}
                            </div>
                          </div>
                        </Col>
                      )
                    })}
                  </Row>

                  <div className="creator-detail-pagination">
                    <Pagination current={1} total={30} pageSize={6} showSizeChanger={false} />
                  </div>
                </>
              ),
            },
            {
              key: 'activities',
              label: '参与活动',
              children: (
                <div className="table-card">
                  <Table<ActivityParticipationItem>
                    rowKey="key"
                    columns={activityColumns}
                    dataSource={activityParticipationRows}
                    pagination={false}
                    size="middle"
                    className="creator-activity-table"
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>

    </div>
  )
}
