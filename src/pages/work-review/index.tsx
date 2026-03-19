import { Button, Checkbox, Tabs, Row, Col, Select, Input, Space, Avatar, Drawer, Tag, Modal, Form, InputNumber, Switch, message, Dropdown, Image, DatePicker } from 'antd'
import { CopyOutlined, DownOutlined, EyeOutlined, LikeOutlined, LeftOutlined, RightOutlined, CloseOutlined, CheckCircleFilled, UpOutlined, LinkOutlined } from '@ant-design/icons'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { themeColors } from '../../theme/colors'
import AppPagination from '../../components/common/AppPagination'
import { postRows } from '../../mocks/worksReview'
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

  // filter states
  const [keywordType1, setKeywordType1] = useState('keyword')
  const [keyword1, setKeyword1] = useState('')
  const [keywordType2, setKeywordType2] = useState('phone')
  const [keyword2, setKeyword2] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

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
              options={[{ label: '作品关键词', value: 'keyword' }]}
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
              <span style={{ color: '#475569', fontSize: 13, marginRight: 8, whiteSpace: 'nowrap' }}>所属活动 :</span>
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
              <span style={{ color: '#475569', fontSize: 13, marginRight: 8, whiteSpace: 'nowrap' }}>作品类目 :</span>
              <Select
                placeholder="请选择"
                style={{ width: 140 }}
                options={[
                  { label: '生活', value: 'life' },
                  { label: '科技', value: 'tech' },
                  { label: '美食', value: 'food' },
                  { label: '旅行', value: 'travel' },
                  { label: '时尚', value: 'fashion' }
                ]}
              />
            </div>

            {isExpanded && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#475569', fontSize: 13, marginRight: 8, whiteSpace: 'nowrap' }}>发布时间 :</span>
                <DatePicker.RangePicker
                  style={{ width: 280 }}
                  placeholder={['开始日期', '结束日期']}
                />
              </div>
            )}
          </div>

        </div>

        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
          <Button type="primary" ghost style={{ borderColor: themeColors.primary, color: themeColors.primary }}>查询</Button>
          <Button>重置</Button>
          <Button
            type="text"
            style={{ color: '#64748b' }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '收起' : '展开'} {isExpanded ? <UpOutlined style={{ fontSize: 10 }} /> : <DownOutlined style={{ fontSize: 10 }} />}
          </Button>
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
              <Button disabled={selectedKeys.length === 0}>批量拒绝</Button>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 16, fontWeight: 600 }}>作品详情 (ID: {selectedWork?.authorId})</span>
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
              <Button size="large" style={{ width: 100 }}>置 顶</Button>
              <Button size="large" style={{ width: 100 }}>推 广</Button>
              <Dropdown
                menu={{
                  items: [
                    { key: '1', label: '加入小黑屋' },
                    { key: '2', label: '删除作品' },
                    { key: '3', label: '设置作品类目' },
                    { key: '4', label: '隐藏作品' },
                  ]
                }}
              >
                <Button size="large" style={{ width: 140, color: themeColors.primary, borderColor: themeColors.primary }}>
                  更多操作 <DownOutlined />
                </Button>
              </Dropdown>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '12px 24px' }}>
              <Button size="large" style={{ width: 120 }}>审核拒绝</Button>
              <Button size="large" type="primary" style={{ width: 120 }} onClick={() => setApproveModalVisible(true)}>审核通过</Button>
            </div>
          )
        }
      >
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#f8fafc',
          padding: '24px 0',
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
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
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
              </div>
            </div>
          </div>
        </div>

        {/* 表单底部的状态显示 */}
        <div style={{ marginTop: 24, padding: '0 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 24, fontSize: 15 }}>
            <span style={{ color: '#475569', marginRight: 12 }}>帖子状态:</span>
            {selectedWork?.status === '已通过' ? (
              <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                <CheckCircleFilled /> 已通过-显示中
              </span>
            ) : (
              <Tag color="orange" icon={<span style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 4 }}>●</span>} style={{ border: 'none', background: 'none', padding: 0, fontSize: 15, color: '#f59e0b' }}>
                待审核
              </Tag>
            )}
          </div>

          {selectedWork?.status === '已通过' && (
            <div style={{ background: '#f8fafc', padding: '20px 32px', borderRadius: 8, color: '#64748b', fontSize: 14 }}>
              <div style={{ display: 'flex', marginBottom: 12 }}>
                <span style={{ width: 80 }}>审核人 :</span>
                <span style={{ color: '#1e293b' }}>系统</span>
              </div>
              <div style={{ display: 'flex' }}>
                <span style={{ width: 80 }}>审核时间 :</span>
                <span style={{ color: '#1e293b' }}>2026-02-03 16:03:30</span>
              </div>
            </div>
          )}
        </div>
      </Drawer>

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
          审核通过后帖子将会展示在社区，确认审核通过？
        </div>

        <Form
          form={approveForm}
          layout="horizontal"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 18 }}
          initialValues={{ score: 10, isFeatured: false }}
        >
          <Form.Item label="关联类目" name="category" rules={[{ required: true, message: '请选择关联类目' }]}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Select
                placeholder="请选择"
                style={{ flex: 1 }}
                options={[
                  { label: '美妆分类', value: 'beauty' },
                  { label: '户外运动', value: 'outdoor' },
                  { label: '美食Share', value: 'food' },
                  { label: 'PLAZA', value: 'plaza' },
                ]}
              />
              <Button type="link" style={{ padding: 0 }}>类目管理</Button>
            </div>
          </Form.Item>

          <Form.Item label="创作值" name="score">
            <InputNumber min={0} max={100} style={{ width: 120 }} />
          </Form.Item>

          <Form.Item label="优秀作品" name="isFeatured" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
