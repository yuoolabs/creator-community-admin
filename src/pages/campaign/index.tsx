import { Button, Image, Input, Modal, Select, Space, Tag, message, Switch, Tooltip } from 'antd'
import { QuestionCircleOutlined, ExclamationCircleFilled, SettingOutlined, CloseOutlined, InfoCircleFilled, PlusOutlined, HolderOutlined, EditOutlined } from '@ant-design/icons'
import { useMemo, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { themeColors } from '../../theme/colors'
import type { ColumnsType } from 'antd/es/table'
import DataTableCard from '../../components/common/DataTableCard'
import FilterCard from '../../components/common/FilterCard'
import FilterSplitField from '../../components/common/FilterSplitField'
import { campaignRows, type CampaignRow } from '../../mocks/campaign'

const PAGE_SIZE = 10

export default function CampaignPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [data, setData] = useState<CampaignRow[]>(campaignRows)
  const [keyword, setKeyword] = useState('')
  const [keywordType, setKeywordType] = useState('name')
  const [activityType, setActivityType] = useState('all')
  const [isTypeConfigOpen, setIsTypeConfigOpen] = useState(false)
  const [activityTypeConfigs, setActivityTypeConfigs] = useState([
    { key: '图文征集', label: '图文征集', enabled: true },
    { key: '视频挑战', label: '视频挑战', enabled: true },
    { key: '直播任务', label: '直播任务', enabled: true },
  ])
  const [isEditingType, setIsEditingType] = useState(false)
  const [editingTypeKey, setEditingTypeKey] = useState<string | null>(null)
  const [typeDraft, setTypeDraft] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    // Check if we jumped from another page with a search keyword
    const state = location.state as { search?: string }
    if (state?.search) {
      setKeyword(state.search)
      setPage(1)
      // Clear navigation state so the filter doesn't reappear on reload
      window.history.replaceState({}, document.title)
    }
  }, [location])
  const [modalState, setModalState] = useState<{ type: 'none' | 'invalidate' | 'delete', row: CampaignRow | null }>({ type: 'none', row: null })

  const filteredRows = useMemo(() => {
    return data.filter((row) => {
      const keywordMatched =
        !keyword ||
        (keywordType === 'name' ? row.name.includes(keyword) : row.displayId.includes(keyword))
      const activityTypeMatched = activityType === 'all' || row.type === activityType
      const statusMatched = status === 'all' || row.status === status
      return keywordMatched && activityTypeMatched && statusMatched
    })
  }, [keyword, keywordType, activityType, status, data])

  const visibleActivityTypes = activityTypeConfigs.filter((item) => item.enabled)

  const openCreateType = () => {
    setEditingTypeKey(null)
    setTypeDraft('')
    setIsEditingType(true)
  }

  const openEditType = (key: string, label: string) => {
    setEditingTypeKey(key)
    setTypeDraft(label)
    setIsEditingType(true)
  }

  const saveType = () => {
    const nextLabel = typeDraft.trim()
    if (!nextLabel) {
      message.warning('请输入活动类型名称')
      return
    }
    if (nextLabel.length > 8) {
      message.warning('活动类型名称不能超过8个字')
      return
    }

    setActivityTypeConfigs((prev) => {
      if (editingTypeKey) {
        const nextType = nextLabel as CampaignRow['type']
        setData((items) =>
          items.map((row) =>
            row.type === editingTypeKey ? { ...row, type: nextType } : row,
          ),
        )
        return prev.map((item) =>
          item.key === editingTypeKey ? { ...item, key: nextLabel, label: nextLabel } : item,
        )
      }
      if (prev.length >= 20) {
        message.warning('最多可添加20个类型')
        return prev
      }
      return [...prev, { key: nextLabel, label: nextLabel, enabled: true }]
    })

    if (editingTypeKey && activityType === editingTypeKey) {
      setActivityType(nextLabel)
    }

    setIsEditingType(false)
    message.success(editingTypeKey ? '类型已更新' : '类型已添加')
  }

  const pagedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredRows.slice(start, start + PAGE_SIZE)
  }, [filteredRows, page])

  const handleSearch = () => {
    setPage(1)
  }

  const activityTypeButtonStyle = {
    borderRadius: 8,
    minWidth: 120,
    height: 32,
    fontSize: 14,
    fontWeight: 600,
  } as const

  const handleInvalidate = (row: CampaignRow) => {
    setModalState({ type: 'invalidate', row })
  }

  const handleDelete = (row: CampaignRow) => {
    setModalState({ type: 'delete', row })
  }

  const handleConfirmAction = () => {
    if (!modalState.row) return
    const targetId = modalState.row.id
    if (modalState.type === 'invalidate') {
      setData((prev) =>
        prev.map((item) => (item.id === targetId ? { ...item, status: '已失效' } : item))
      )
      message.success('活动已设为失效')
    } else if (modalState.type === 'delete') {
      setData((prev) => prev.filter((item) => item.id !== targetId))
      message.success('活动已成功删除')
    }
    setModalState({ type: 'none', row: null })
  }


  const columns: ColumnsType<CampaignRow> = [
    {
      title: '活动图片',
      key: 'coverUrl',
      width: 120,
      render: (_, row) => (
        <Image
          src={row.coverUrl}
          width={80}
          height={50}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: '活动名称',
      key: 'name',
      width: 200,
      render: (_, row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontWeight: 500, color: '#334155' }}>{row.name}</span>
          <span style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1 }}>
            活动ID：{row.displayId}
          </span>
        </div>
      ),
    },
    {
      title: <span style={{ whiteSpace: 'nowrap' }}>活动类型</span>,
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (value: string) => (
        <span style={{ color: '#1f2937', fontSize: 16, fontWeight: 400, whiteSpace: 'nowrap' }}>
          {value || '普通'}
        </span>
      ),
    },
    {
      title: '活动时间',
      key: 'timeRange',
      width: 280,
      render: (_, row) => `${row.startAt} ~ ${row.endAt}`,
    },
    {
      title: <span style={{ whiteSpace: 'nowrap' }}>参与人数</span>,
      dataIndex: 'participants',
      key: 'participants',
      width: 120,
      sorter: (a, b) => a.participants - b.participants
    },
    {
      title: <span style={{ whiteSpace: 'nowrap' }}>参与作品数</span>,
      dataIndex: 'worksCount',
      key: 'worksCount',
      width: 130,
      sorter: (a, b) => a.worksCount - b.worksCount
    },
    {
      title: <span style={{ whiteSpace: 'nowrap' }}>活动排序</span>,
      dataIndex: 'activitySort',
      key: 'activitySort',
      width: 110,
      render: (value: number) => value,
      sorter: (a, b) => a.activitySort - b.activitySort,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: (
        <Space size={4} style={{ whiteSpace: 'nowrap' }}>
          显示状态
          <Tooltip title="可配置活动是否在活动列表显示">
            <QuestionCircleOutlined style={{ color: '#94a3b8', cursor: 'help' }} />
          </Tooltip>
        </Space>
      ),
      key: 'isVisible',
      width: 120,
      render: (_, row) => (
        <Switch
          checkedChildren="显示"
          unCheckedChildren="隐藏"
          defaultChecked
          onChange={(checked) => {
            message.success(`活动「${row.name}」已${checked ? '显示' : '隐藏'}`)
          }}
        />
      ),
    },
    {
      title: <span style={{ whiteSpace: 'nowrap' }}>活动状态</span>,
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (value: CampaignRow['status']) => {
        if (value === '进行中') return <Tag color="green">进行中</Tag>
        if (value === '未开始') return <Tag color="blue">未开始</Tag>
        if (value === '已失效') return <Tag color="default">已失效</Tag>
        return <Tag>已结束</Tag>
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_, row) => (
        <Space size={16}>
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => navigate(`/campaign/edit?id=${row.id}`)}
          >
            {row.status === '已结束' || row.status === '已失效' ? '详情' : '编辑'}
          </Button>
          <Button
            type="link"
            style={{ padding: 0 }}
            disabled={row.status === '已结束' || row.status === '已失效'}
            onClick={() => message.info(`正在为您生成「${row.name}」的推广链接/物料`)}
          >
            推广
          </Button>
          <Button
            type="link"
            style={{ padding: 0 }}
            disabled={row.status === '已结束' || row.status === '已失效'}
            onClick={() => handleInvalidate(row)}
          >
            失效
          </Button>
          <Button
            type="link"
            danger
            style={{ padding: 0 }}
            onClick={() => handleDelete(row)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="page-stack">
      <FilterCard>
        <FilterSplitField
          options={[
            { label: '活动名称', value: 'name' },
            { label: '活动 ID', value: 'displayId' },
          ]}
          typeValue={keywordType}
          onTypeChange={setKeywordType}
          inputValue={keyword}
          onInputChange={(value) => {
            setKeyword(value)
            setPage(1)
          }}
          placeholder={keywordType === 'name' ? '搜索活动名称' : '搜索活动 ID'}
          width={420}
        />
        <Select
          className="filter-select"
          style={{ width: 220 }}
          value={status}
          onChange={(value) => {
            setStatus(value)
            setPage(1)
          }}
          options={[
            { label: '全部状态', value: 'all' },
            { label: '进行中', value: '进行中' },
            { label: '未开始', value: '未开始' },
            { label: '已结束', value: '已结束' },
            { label: '已失效', value: '已失效' },
          ]}
        />
        <Button
          type="primary"
          ghost
          onClick={handleSearch}
          style={{ borderColor: themeColors.primary, color: themeColors.primary }}
        >
          查询
        </Button>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
          <Button type="primary" onClick={() => navigate('/campaign/new')}>
            添加活动
          </Button>
          <Button
            onClick={() => message.info('推广活动主页功能建设中')}
          >
            推广活动主页
          </Button>
        </div>
      </FilterCard>

      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <Space size={8} align="center" style={{ flexWrap: 'wrap' }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#334155' }}>活动类型</span>
          <Tooltip title="配置活动类型在前台筛选区的展示项">
            <QuestionCircleOutlined style={{ color: '#94a3b8', cursor: 'help' }} />
          </Tooltip>
          <Space size={8} wrap>
            <Button
              type={activityType === 'all' ? 'primary' : 'default'}
              onClick={() => setActivityType('all')}
              style={activityTypeButtonStyle}
            >
              全部
            </Button>
            {visibleActivityTypes.map((item) => (
              <Button
                key={item.key}
                type={activityType === item.key ? 'primary' : 'default'}
                onClick={() => setActivityType(item.key)}
                style={activityTypeButtonStyle}
              >
                {item.label}
              </Button>
            ))}
          </Space>
        </Space>
        <div style={{ marginLeft: 'auto' }}>
          <Button icon={<SettingOutlined />} onClick={() => setIsTypeConfigOpen(true)}>
            管理类型
          </Button>
        </div>
      </div>

      <DataTableCard
        columns={columns}
        rows={pagedRows}
        currentPage={page}
        pageSize={PAGE_SIZE}
        total={filteredRows.length}
        onPageChange={(nextPage) => setPage(nextPage)}
      />

      <Modal
        title={
          <Space>
            <ExclamationCircleFilled style={{ color: '#faad14' }} />
            {modalState.type === 'delete' ? '确认删除此活动吗？' : '确认使此活动失效吗？'}
          </Space>
        }
        open={modalState.type !== 'none'}
        onOk={handleConfirmAction}
        onCancel={() => setModalState({ type: 'none', row: null })}
        okText={modalState.type === 'delete' ? '确认删除' : '确认失效'}
        cancelText="取消"
        okButtonProps={{ danger: true }}
        centered
      >
        <div style={{ marginLeft: 32, padding: '4px 0', color: '#475569' }}>
          {modalState.type === 'delete'
            ? `活动删除后将无法找回，确认执行此操作吗？`
            : `活动失效后用户将无法参与该活动，确认失效吗？`}
        </div>
      </Modal>

      <Modal
        title="管理分类"
        open={isTypeConfigOpen}
        onCancel={() => setIsTypeConfigOpen(false)}
        footer={null}
        width={820}
        closeIcon={<CloseOutlined style={{ fontSize: 20, color: '#94a3b8' }} />}
        styles={{ body: { paddingTop: 20 } }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div
            style={{
              background: '#eff6ff',
              borderRadius: 6,
              padding: '18px 20px',
              color: '#52525b',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: 16,
            }}
          >
            <InfoCircleFilled style={{ color: '#2f74ff', fontSize: 20 }} />
            <span>最多可添加20个分类，每个分类名称不超过8个字，拖动分类进行排序</span>
          </div>

          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={openCreateType}
            style={{ padding: 0, fontSize: 16, fontWeight: 500, height: 'auto', alignSelf: 'flex-start' }}
          >
            添加分类
          </Button>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20 }}>
            {activityTypeConfigs.map((item) => (
              <div
                key={item.key}
                style={{
                  background: '#f4f4f5',
                  borderRadius: 2,
                  minHeight: 72,
                  padding: '0 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  color: '#52525b',
                }}
              >
                <HolderOutlined style={{ color: '#a1a1aa', fontSize: 20, cursor: 'grab' }} />
                <div style={{ flex: 1, fontSize: 20, fontWeight: 500, color: '#52525b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.label}
                </div>
                <EditOutlined
                  style={{ color: '#8f8f98', fontSize: 18, cursor: 'pointer' }}
                  onClick={() => openEditType(item.key, item.label)}
                />
                <CloseOutlined
                  style={{ color: '#8f8f98', fontSize: 18, cursor: 'pointer' }}
                  onClick={() => {
                    setActivityTypeConfigs((prev) => prev.filter((typeItem) => typeItem.key !== item.key))
                    if (activityType === item.key) {
                      setActivityType('all')
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <Modal
        title={editingTypeKey ? '编辑分类' : '添加分类'}
        open={isEditingType}
        onCancel={() => setIsEditingType(false)}
        onOk={saveType}
        okText="确定"
        cancelText="取消"
        centered
        width={480}
      >
        <div style={{ paddingTop: 12 }}>
          <Input
            value={typeDraft}
            onChange={(e) => setTypeDraft(e.target.value)}
            placeholder="请输入分类名称"
            maxLength={8}
            showCount
          />
        </div>
      </Modal>
    </div>

  )
}
