import { Button, Checkbox, Tabs, Row, Col, Select, Input, Space, Avatar, Drawer, Tag, Modal, Form, InputNumber, Switch, message, Dropdown, Image, DatePicker } from 'antd'
import { CopyOutlined, DownOutlined, EyeOutlined, LikeOutlined, LeftOutlined, RightOutlined, CloseOutlined, CheckCircleFilled, LinkOutlined } from '@ant-design/icons'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { themeColors } from '../../theme/colors'
import AppPagination from '../../components/common/AppPagination'
import { postRows } from '../../mocks/worksReview'
import { getVisibleXxxxOptions } from '../../mocks/xxxxCategories'
import FilterSplitField from '../../components/common/FilterSplitField'

const PAGE_SIZE = 10

type TabKey = '待审核' | '已通过' | '已拒绝' | '已删除'

export default function WorkReviewPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabKey>('待审核')
  const [page, setPage] = useState(1)
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedWork, setSelectedWork] = useState<any>(null)

  const [approveModalVisible, setApproveModalVisible] = useState(false)
  const [approveForm] = Form.useForm()
  const [attributeModalVisible, setAttributeModalVisible] = useState(false)
  const [attributeForm] = Form.useForm()
  const [ipCategoryModalVisible, setIpCategoryModalVisible] = useState(false)
  const [ipCategoryForm] = Form.useForm()
  const [rejectModalVisible, setRejectModalVisible] = useState(false)
  const [rejectForm] = Form.useForm()
  const [rejectMode, setRejectMode] = useState<'single' | 'batch'>('single')
  const [actionConfirmVisible, setActionConfirmVisible] = useState(false)
  const [actionConfirmConfig, setActionConfirmConfig] = useState<{
    title: string
    content: string
    onConfirm: () => void
  } | null>(null)

  // filter states
  const [keywordType1, setKeywordType1] = useState('keyword')
  const [keyword1, setKeyword1] = useState('')
  const [keywordType2, setKeywordType2] = useState('phone')
  const [keyword2, setKeyword2] = useState('')
  const [selectedXxxx, setSelectedXxxx] = useState<string | undefined>(undefined)

  const xxxxOptions = useMemo(() => getVisibleXxxxOptions(), [])
  const workAttributeOptions = useMemo(() => ([
    { label: '美妆分类', value: 'beauty' },
    { label: '户外运动', value: 'outdoor' },
    { label: '美食Share', value: 'food' },
    { label: 'PLAZA', value: 'plaza' },
  ]), [])

  const filteredRows = useMemo(() => {
    return postRows.filter((row) => row.status === activeTab)
  }, [activeTab])

  const pagedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredRows.slice(start, start + PAGE_SIZE)
  }, [filteredRows, page])

  const openDetail = (work: any) => {
    setSelectedWork(work)
    setDetailVisible(true)
  }

  const openRejectModal = (mode: 'single' | 'batch') => {
    setRejectMode(mode)
    setRejectModalVisible(true)
  }

  const openAttributeModal = () => {
    setAttributeModalVisible(true)
  }

  const openIpCategoryModal = () => {
    setIpCategoryModalVisible(true)
  }

  const openActionConfirm = (title: string, content: string, onConfirm: () => void) => {
    setActionConfirmConfig({ title, content, onConfirm })
    setActionConfirmVisible(true)
  }

  const confirmTop = () => {
    openActionConfirm('确认置顶', '确认置顶该作品？', () => {
        message.success('置顶成功')
    })
  }

  const confirmDelete = () => {
    openActionConfirm('确认删除作品', '确认删除该作品？删除后将不可恢复。', () => {
      message.success('删除成功')
      setDetailVisible(false)
    })
  }

  const toggleFeatured = () => {
    const nextFeatured = !selectedWork?.isFeatured

    openActionConfirm(
      nextFeatured ? '确认标记优秀' : '确认取消优秀',
      nextFeatured ? '确认将该作品标记为优秀？' : '确认取消该作品的优秀标记？',
      () => {
        setSelectedWork((prev: any) => {
          if (!prev) return prev

          message.success(nextFeatured ? '已标记为优秀作品' : '已取消优秀作品')

          return {
            ...prev,
            isFeatured: nextFeatured,
          }
        })
      },
    )
  }

  const handleSelectAll = (e: any) => {
    if (e.target.checked) {
      setSelectedKeys(pagedRows.map(r => r.id))
    } else {
      setSelectedKeys([])
    }
  }

  const counts = useMemo(() => {
    const c = { '待审核': 0, '已通过': 0, '已拒绝': 0, '已删除': 0 }
    postRows.forEach(row => {
      c[row.status]++
    })
    return c
  }, [])

  const statusDisplayMap: Record<TabKey, { text: string; color: string; dot: string }> = {
    待审核: { text: '待审核', color: '#f59e0b', dot: '●' },
    已通过: { text: '已通过', color: '#059669', dot: '●' },
    已拒绝: { text: '已拒绝', color: '#ef4444', dot: '●' },
    已删除: { text: '已删除', color: '#94a3b8', dot: '●' },
  }
  const currentStatus = (selectedWork?.status ?? '待审核') as TabKey
  const showAuditMeta = currentStatus === '已拒绝' || currentStatus === '已删除'

  const handleActivityClick = (activityName: string) => {
    // Navigate to campaign page with search filter (simulated)
    navigate('/campaign', { state: { search: activityName } })
  }

  const items = [
    { key: '待审核', label: `待审核(${counts['待审核']})` },
    { key: '已通过', label: `已通过(${counts['已通过']})` },
    { key: '已拒绝', label: `已拒绝(${counts['已拒绝']})` },
    { key: '已删除', label: `已删除(${counts['已删除']})` },
  ]

  return (
    <div className="page-stack" style={{ gap: 16 }}>
      {/* 搜索过滤区 */}
      <div style={{ background: '#fff', padding: '20px 24px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 24px', flex: 1, paddingRight: 32 }}>
	            <FilterSplitField
	              options={[
	                { label: '作品关键词', value: 'keyword' },
	                { label: '作品 ID', value: 'workId' },
	              ]}
	              typeValue={keywordType1}
	              onTypeChange={setKeywordType1}
	              inputValue={keyword1}
              onInputChange={setKeyword1}
              placeholder="请输入"
              width={260}
            />
            <FilterSplitField
              options={[{ label: '用户手机号', value: 'phone' }]}
              typeValue={keywordType2}
              onTypeChange={setKeywordType2}
              inputValue={keyword2}
              onInputChange={setKeyword2}
              placeholder="请输入"
              width={260}
            />

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#475569', fontSize: 13, marginRight: 8, whiteSpace: 'nowrap' }}>活动ID :</span>
              <Input placeholder="请输入" style={{ width: 140 }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#475569', fontSize: 13, marginRight: 8, whiteSpace: 'nowrap' }}>优秀作品 :</span>
              <Select
                placeholder="请选择"
                style={{ width: 140 }}
                options={[
                  { label: '优秀作品', value: 'yes' },
                  { label: '非优秀作品', value: 'no' }
                ]}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#475569', fontSize: 13, marginRight: 8, whiteSpace: 'nowrap' }}>置顶状态 :</span>
              <Select
                placeholder="请选择"
                style={{ width: 140 }}
                options={[
                  { label: '置顶', value: 'top' },
                  { label: '未置顶', value: 'normal' }
                ]}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#475569', fontSize: 13, marginRight: 8, whiteSpace: 'nowrap' }}>IP/品类 :</span>
              <Select
                placeholder="请选择"
                value={selectedXxxx}
                onChange={setSelectedXxxx}
                style={{ width: 160 }}
                options={xxxxOptions}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#475569', fontSize: 13, marginRight: 8, whiteSpace: 'nowrap' }}>作品属性 :</span>
              <Select
                placeholder="请选择"
                style={{ width: 140 }}
                options={workAttributeOptions}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#475569', fontSize: 13, marginRight: 8, whiteSpace: 'nowrap' }}>所属平台 :</span>
              <Select
                placeholder="请选择"
                style={{ width: 160 }}
                options={[
                  { label: '抖音', value: 'douyin' },
                  { label: '哔哩哔哩', value: 'bilibili' },
                  { label: '小红书', value: 'xiaohongshu' }
                ]}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#475569', fontSize: 13, marginRight: 8, whiteSpace: 'nowrap' }}>发布时间 :</span>
              <DatePicker.RangePicker
                style={{ width: 280 }}
                placeholder={['开始日期', '结束日期']}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Button type="primary" ghost style={{ borderColor: themeColors.primary, color: themeColors.primary }}>
                查询
              </Button>
              <Button>重置</Button>
            </div>
          </div>

        </div>
      </div>

      {/* 列表区 */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', minHeight: 500, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tabs
            type="card"
            activeKey={activeTab}
            onChange={(k) => { setActiveTab(k as TabKey); setPage(1); setSelectedKeys([]) }}
            items={items}
            style={{ marginBottom: -16, marginTop: 16 }}
          />
          <Space size={24} style={{ color: '#94a3b8', fontSize: 12 }}>
            <span style={{ cursor: 'pointer' }}>点赞量排序 ↕</span>
            <span style={{ cursor: 'pointer' }}>浏览量排序 ↕</span>
          </Space>
        </div>

        <div style={{ padding: 24, flex: 1 }}>
          <Row gutter={[24, 24]}>
            {pagedRows.map((row) => (
              <Col xs={24} sm={12} md={12} lg={8} xl={6} key={row.id}>
                <div
                  onClick={() => openDetail(row)}
                  style={{
                    border: '1px solid #f1f5f9',
                    borderRadius: 12,
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  className="work-card-hover"
                >
                  {/* 复选框 */}
                  {activeTab === '待审核' && (
                    <Checkbox
                      style={{ position: 'absolute', top: 12, left: 12, zIndex: 1, transform: 'scale(1.1)' }}
                      checked={selectedKeys.includes(row.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedKeys(p => [...p, row.id])
                        else setSelectedKeys(p => p.filter(k => k !== row.id))
                      }}
                    />
                  )}

                  {/* 封面图 */}
                  <div style={{ height: 220, background: '#f8fafc', overflow: 'hidden', position: 'relative' }}>
                    <Image
                      src={row.coverUrl}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      alt="cover"
                      preview={false}
                      fallback="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&h=400&fit=crop"
                    />
                    {activeTab === '已通过' && row.isFeatured && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          padding: '4px 10px',
                          borderRadius: 999,
                          background: 'rgba(37, 99, 235, 0.92)',
                          color: '#fff',
                          fontSize: 12,
                          fontWeight: 600,
                          lineHeight: 1,
                          zIndex: 1,
                          boxShadow: '0 6px 16px rgba(37, 99, 235, 0.28)',
                        }}
                      >
                        优秀
                      </div>
                    )}
                  </div>

                  {/* 卡片内容信息 */}
                  <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                        <Avatar src={row.authorAvatar} size={24} />
                        <span style={{ fontSize: 13, color: '#475569', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 100 }}>
                          {row.authorName}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                        ID: {row.authorId}
                        <CopyOutlined style={{ cursor: 'pointer' }} />
                      </div>
                    </div>

                    <div style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#1e293b',
                      marginTop: 4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: '40px', // Ensure consistent height for 2 lines
                      lineHeight: '20px'
                    }}>
                      {row.title}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* 底部操作与分页 */}
        <div style={{
          borderTop: '1px solid #e2e8f0',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fafafa',
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12
        }}>
          {activeTab === '待审核' ? (
            <Space size={16}>
              <Checkbox
                checked={pagedRows.length > 0 && selectedKeys.length === pagedRows.length}
                indeterminate={selectedKeys.length > 0 && selectedKeys.length < pagedRows.length}
                onChange={handleSelectAll}
              />
              <Button disabled={selectedKeys.length === 0} onClick={() => setApproveModalVisible(true)}>批量通过</Button>
              <Button disabled={selectedKeys.length === 0} onClick={() => openRejectModal('batch')}>批量拒绝</Button>
            </Space>
          ) : <div />}

          <div style={{ width: '400px' }}>
            <AppPagination
              current={page}
              pageSize={PAGE_SIZE}
              total={filteredRows.length}
              onChange={(p) => setPage(p)}
            />
          </div>
        </div>
      </div>

	      <Drawer
	        title={
	          <div style={{ display: 'flex', alignItems: 'center', minHeight: 40, paddingRight: 56 }}>
	            <span style={{ fontSize: 16, fontWeight: 600, flex: 1, minWidth: 0 }}>作品详情 (ID: {selectedWork?.authorId})</span>
	            <div
	              style={{
	                display: 'flex',
	                alignItems: 'center',
	                gap: 6,
	                flexShrink: 0,
	                margin: '0 auto',
	              }}
	            >
	              <div
	                style={{
	                  display: 'flex',
	                  alignItems: 'center',
	                  gap: 6,
	                  background: '#fff',
	                  border: '1px solid #e2e8f0',
	                  borderRadius: 16,
	                  padding: '2px 10px',
	                  fontSize: 12,
	                  color: '#475569'
	                }}
	              >
	                {selectedWork?.platform === '抖音' && (
	                  <img src="https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico" style={{ width: 14, height: 14 }} alt="douyin" />
	                )}
	                {selectedWork?.platform === '小红书' && (
	                  <img src="https://www.xiaohongshu.com/favicon.ico" style={{ width: 14, height: 14 }} alt="xhs" />
	                )}
	                {selectedWork?.platform === '哔哩哔哩' && (
	                  <img src="https://www.bilibili.com/favicon.ico" style={{ width: 14, height: 14 }} alt="bilibili" />
	                )}
	                {selectedWork?.platform || '抖音'}
	              </div>
	              <LinkOutlined
	                style={{ fontSize: 14, color: themeColors.primary, cursor: 'pointer' }}
	                onClick={() => selectedWork?.platformUrl && window.open(selectedWork.platformUrl)}
	              />
	            </div>
	            <div style={{ width: 56, flexShrink: 0 }} />
	          </div>
	        }
        placement="right"
        width={480}
        onClose={() => setDetailVisible(false)}
        open={detailVisible}
        styles={{ body: { padding: 0 } }}
        extra={
          <Button type="text" icon={<CloseOutlined />} onClick={() => setDetailVisible(false)} />
        }
        closable={false}
		        footer={
		          selectedWork?.status === '已通过' ? (
		            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '12px 24px' }}>
		              <Button size="large" style={{ width: 100 }} onClick={confirmTop}>置 顶</Button>
		              <Button size="large" style={{ width: 100 }}>推 广</Button>
		              <Button size="large" style={{ width: 120 }} onClick={toggleFeatured}>
		                {selectedWork?.isFeatured ? '取消优秀' : '标记优秀'}
		              </Button>
		              <Dropdown
		                menu={{
		                  items: [
		                    { key: '2', label: '删除作品' },
		                    { key: '3', label: '设置作品属性' },
		                    { key: '4', label: '关联IP/品类' },
		                  ],
		                  onClick: ({ key }) => {
		                    if (key === '2') {
		                      confirmDelete()
		                    }
		                    if (key === '3') {
		                      openAttributeModal()
		                    }
		                    if (key === '4') {
		                      openIpCategoryModal()
		                    }
		                  },
		                }}
		              >
		                <Button size="large" style={{ width: 140, color: themeColors.primary, borderColor: themeColors.primary }}>
		                  更多操作 <DownOutlined />
		                </Button>
		              </Dropdown>
		            </div>
		          ) : selectedWork?.status === '已拒绝' ? (
		            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '12px 24px' }}>
		              <Button size="large" type="primary" style={{ width: 120 }} onClick={() => setApproveModalVisible(true)}>审核通过</Button>
		            </div>
		          ) : selectedWork?.status === '已删除' ? null : (
		            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '12px 24px' }}>
		              <Button size="large" style={{ width: 120 }} onClick={() => openRejectModal('single')}>审核拒绝</Button>
		              <Button size="large" type="primary" style={{ width: 120 }} onClick={() => setApproveModalVisible(true)}>审核通过</Button>
		            </div>
		          )
		        }
	      >
	        <div style={{
	          display: 'flex',
	          flexDirection: 'column',
	          justifyContent: 'flex-start',
	          alignItems: 'center',
	          background: '#f8fafc',
	          padding: '10px 0',
	          minHeight: 'calc(100vh - 160px)',
	          position: 'relative'
	        }}>
          {/* 左切换按钮 */}
          <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)' }}>
            <Button shape="circle" icon={<LeftOutlined />} size="middle" />
          </div>

          {/* 右切换按钮 */}
          <div style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)' }}>
            <Button shape="circle" icon={<RightOutlined />} size="middle" />
          </div>

	          {/* 手机模拟器外壳 */}
	          <div style={{
	            width: 320,
	            height: 640,
            background: '#fff',
            borderRadius: 40,
            border: '12px solid #f1f5f9',
            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            {/* 状态栏模拟 */}
	            <div style={{ height: 44, padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
	              <span>9:41</span>
	              <div style={{ display: 'flex', gap: 4 }}>
	                📶 🔋
	              </div>
	            </div>

		            <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 24px' }}>

		              {/* 顶部标题栏 */}
		              <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
	                <LeftOutlined style={{ position: 'absolute', left: 0 }} />
	                <span style={{ fontWeight: 600 }}>作品详情</span>
	              </div>

              {/* 作品大图 */}
	              <div style={{ borderRadius: 8, overflow: 'hidden', marginBottom: 16, position: 'relative', background: '#f8fafc' }}>
	                <Image
	                  src={selectedWork?.coverUrl}
	                  style={{ width: '100%', height: 400, objectFit: 'cover' }}
	                  fallback="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=600&h=600&fit=crop"
	                />
	                {selectedWork?.isFeatured && (
	                  <div
	                    style={{
	                      position: 'absolute',
	                      top: 12,
	                      left: 12,
	                      padding: '4px 10px',
	                      borderRadius: 999,
	                      background: '#2563eb',
	                      color: '#fff',
	                      fontSize: 12,
	                      fontWeight: 600,
	                      lineHeight: 1,
	                      zIndex: 1,
	                    }}
	                  >
	                    优秀
	                  </div>
	                )}
	                <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '2px 8px', borderRadius: 10, fontSize: 12, zIndex: 1 }}>
	                  1/1
	                </div>
	              </div>

              {/* 作者信息 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Avatar src={selectedWork?.authorAvatar} size={32} />
                <span style={{ fontWeight: 500 }}>{selectedWork?.authorName}</span>
              </div>

              {/* 标题 */}
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ flex: 1 }}>{selectedWork?.title}</span>
              </div>

              {/* 时间 */}
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>{selectedWork?.createdAt}</div>

              {/* 活动信息 */}
              {selectedWork?.activityName && (
                <div style={{ marginBottom: 20 }}>
                  <Tag
                    color="processing"
                    style={{
                      borderRadius: 4,
                      cursor: 'pointer',
                      border: 'none',
                      background: themeColors.primaryLight,
                      color: themeColors.primary,
                      fontSize: 12,
                      padding: '2px 10px'
                    }}
                    onClick={() => handleActivityClick(selectedWork.activityName)}
                  >
                    #{selectedWork.activityName}
                  </Tag>
                </div>
              )}

	              <div style={{ display: 'flex', alignItems: 'center', color: '#64748b', fontSize: 14 }}>
	                <div style={{ display: 'flex', gap: 20 }}>
	                  <Space size={4}><LikeOutlined /> {selectedWork?.likes || 0}</Space>
	                  <Space size={4}><EyeOutlined /> {selectedWork?.views || 0}</Space>
	                </div>
	              </div>
	            </div>
	          </div>

	          <div
	            style={{
	              width: '100%',
	              maxWidth: 320,
	              margin: '10px auto 0',
	              display: 'flex',
	              alignItems: 'center',
	              justifyContent: 'space-between',
	              gap: 16,
	              color: '#64748b',
	              fontSize: 13,
	            }}
	          >
	            <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
	              <span style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>IP品类 :</span>
	              <span style={{ color: '#1e293b', fontWeight: 500, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
	                {selectedWork?.ipCategory || '-'}
	              </span>
	            </div>
	            <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1, justifyContent: 'flex-end' }}>
	              <span style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>作品属性 :</span>
	              <span style={{ color: '#1e293b', fontWeight: 500, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
	                {selectedWork?.workAttribute || '-'}
	              </span>
	            </div>
	          </div>
	        </div>

			        {/* 表单底部的状态显示 */}
				        <div
				          style={{
				            width: '100%',
				            maxWidth: 320,
				            margin: '10px auto 0',
				            display: 'flex',
				            flexDirection: 'column',
				            gap: 16,
				          }}
				        >
					          <div style={{ background: '#f8fafc', borderRadius: 8, color: '#64748b', fontSize: 14, padding: '18px 20px' }}>
					            <div style={{ display: 'flex', alignItems: 'center', marginBottom: showAuditMeta ? 12 : 0 }}>
					              <span style={{ width: 96, flexShrink: 0, whiteSpace: 'nowrap' }}>作品状态 :</span>
					              <span style={{ color: statusDisplayMap[currentStatus].color, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
	                {currentStatus === '已通过' ? <CheckCircleFilled /> : <span style={{ fontSize: 14 }}>{statusDisplayMap[currentStatus].dot}</span>}
	                {statusDisplayMap[currentStatus].text}
	              </span>
				            </div>

					            {showAuditMeta && (
				              <>
				                <div style={{ display: 'flex', marginBottom: 12 }}>
				                  <span style={{ width: 96, flexShrink: 0, whiteSpace: 'nowrap' }}>审核人 :</span>
				                  <span style={{ color: '#1e293b' }}>张三</span>
				                </div>
			                <div style={{ display: 'flex' }}>
			                  <span style={{ width: 96, flexShrink: 0, whiteSpace: 'nowrap' }}>审核时间 :</span>
			                  <span style={{ color: '#1e293b' }}>2026-02-03 16:03:30</span>
			                </div>
			              </>
			            )}
				        </div>
	        </div>
      </Drawer>

      <Modal
        title={actionConfirmConfig?.title}
        open={actionConfirmVisible}
        onCancel={() => {
          setActionConfirmVisible(false)
          setActionConfirmConfig(null)
        }}
        onOk={() => {
          actionConfirmConfig?.onConfirm()
          setActionConfirmVisible(false)
          setActionConfirmConfig(null)
        }}
        okText="确定"
        cancelText="取消"
        centered
      >
        <div style={{ color: '#475569', paddingTop: 8 }}>
          {actionConfirmConfig?.content}
        </div>
      </Modal>

      <Modal
        title="帖子审核"
        open={approveModalVisible}
        onCancel={() => setApproveModalVisible(false)}
        onOk={() => {
          approveForm.validateFields().then(values => {
            console.log('Approve values:', values)
            message.success('操作成功')
            setApproveModalVisible(false)
            setDetailVisible(false)
            approveForm.resetFields()
          })
        }}
        okText="确定"
        cancelText="取消"
        width={520}
        centered
      >
        <div style={{ marginBottom: 24, color: '#475569' }}>
          审核通过后作品将会展示在首页，确认审核通过？
        </div>

        <Form
          form={approveForm}
          layout="horizontal"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 18 }}
          initialValues={{ score: 10, isFeatured: false }}
        >
          <Form.Item
            label="关联 IP/品类"
            name="ipCategory"
            rules={[{ required: true, message: '请选择关联 IP/品类' }]}
	          >
	            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
	              <Select placeholder="请选择" style={{ width: 300 }} options={xxxxOptions} />
	              <Button type="link" style={{ padding: 0 }}>IP/品类管理</Button>
	            </div>
	          </Form.Item>

          <Form.Item label="关联作品属性" name="category" rules={[{ required: true, message: '请选择关联作品属性' }]}>
	            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
	              <Select
	                placeholder="请选择"
	                style={{ width: 300 }}
	                options={workAttributeOptions}
	              />
	              <Button type="link" style={{ padding: 0 }}>属性管理</Button>
            </div>
          </Form.Item>

          <Form.Item label="创作值" style={{ marginBottom: 24 }}>
            <Form.Item name="score" hidden>
              <InputNumber />
            </Form.Item>
            <Form.Item noStyle shouldUpdate>
              {({ getFieldValue }) => (
                <span
                  style={{
                    display: 'inline-block',
                    minWidth: 40,
                    color: '#475569',
                    fontSize: 16,
                    lineHeight: '32px',
                    fontWeight: 500,
                  }}
                >
                  {getFieldValue('score')}
                </span>
              )}
            </Form.Item>
          </Form.Item>

          <Form.Item label="优秀作品" name="isFeatured" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="设置作品属性"
        open={attributeModalVisible}
        onCancel={() => {
          setAttributeModalVisible(false)
          attributeForm.resetFields()
        }}
        onOk={() => {
          attributeForm.validateFields().then((values) => {
            console.log('Attribute values:', values)
            message.success('作品属性设置成功')
            setAttributeModalVisible(false)
            attributeForm.resetFields()
          })
        }}
        okText="确定"
        cancelText="取消"
        width={700}
        centered
      >
        <Form
          form={attributeForm}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="关联作品属性"
            name="category"
            rules={[{ required: true, message: '请选择关联作品属性' }]}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Select
                placeholder="请选择"
                style={{ width: 360 }}
                options={workAttributeOptions}
              />
              <Button type="link" style={{ padding: 0, height: 'auto' }}>属性管理</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="关联IP/品类"
        open={ipCategoryModalVisible}
        onCancel={() => {
          setIpCategoryModalVisible(false)
          ipCategoryForm.resetFields()
        }}
        onOk={() => {
          ipCategoryForm.validateFields().then((values) => {
            console.log('IP category values:', values)
            message.success('IP/品类设置成功')
            setIpCategoryModalVisible(false)
            ipCategoryForm.resetFields()
          })
        }}
        okText="确定"
        cancelText="取消"
        width={700}
        centered
      >
        <Form
          form={ipCategoryForm}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="关联IP/品类"
            name="ipCategory"
            rules={[{ required: true, message: '请选择关联IP/品类' }]}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Select
                placeholder="请选择"
                style={{ width: 360 }}
                options={xxxxOptions}
              />
              <Button type="link" style={{ padding: 0, height: 'auto' }}>IP/品类管理</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="审核拒绝"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onOk={() => {
          rejectForm.validateFields().then((values) => {
            console.log('Reject values:', values)
            message.success(rejectMode === 'batch' ? '批量拒绝成功' : '审核拒绝成功')
            setRejectModalVisible(false)
            setDetailVisible(false)
            rejectForm.resetFields()
          })
        }}
        okText="确定"
        cancelText="取消"
        width={680}
        centered
      >
        <Form
          form={rejectForm}
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 19 }}
          style={{ marginTop: 20 }}
          initialValues={{ rejectType: 'other', rejectReason: '' }}
        >
          <Form.Item
            label="拒绝类型"
            name="rejectType"
            rules={[{ required: true, message: '请选择拒绝类型' }]}
          >
            <Select
              placeholder="请选择拒绝类型"
              options={[
                { label: '内容违规', value: 'violation' },
                { label: '广告推广', value: 'advertisement' },
                { label: '与社区风格不符', value: 'style-mismatch' },
                { label: '违反社区指南', value: 'guideline' },
                { label: '重复发帖', value: 'duplicate' },
                { label: '其他原因', value: 'other' },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="拒绝原因"
            name="rejectReason"
            rules={[{ required: true, message: '请输入拒绝原因' }]}
          >
            <Input.TextArea
              rows={6}
              maxLength={120}
              showCount
              placeholder="请输入拒绝原因"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
