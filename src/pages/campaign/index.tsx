import { Button, Image, Modal, Select, Space, Tag, message, Switch, Tooltip } from 'antd'
import { QuestionCircleOutlined, ExclamationCircleFilled } from '@ant-design/icons'
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
      const keywordMatched = !keyword || row.name.includes(keyword)
      const statusMatched = status === 'all' || row.status === status
      return keywordMatched && statusMatched
    })
  }, [keyword, status, data])

  const pagedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredRows.slice(start, start + PAGE_SIZE)
  }, [filteredRows, page])

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
        <span style={{ fontWeight: 500, color: '#334155' }}>{row.name}</span>
      ),
    },
    {
      title: <span style={{ whiteSpace: 'nowrap' }}>活动标签</span>,
      dataIndex: 'tag',
      key: 'tag',
      width: 100,
      render: (value: string) => (
        <Tag
          style={{
            margin: 0,
            borderRadius: 4,
            border: 'none',
            background: themeColors.primaryLight,
            color: themeColors.primary,
            fontSize: 12
          }}
        >
          {value || '普通'}
        </Tag>
      )
    },
    {
      title: '活动时间',
      key: 'timeRange',
      width: 320,
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
          options={[{ label: '活动名称', value: 'name' }]}
          typeValue={keywordType}
          onTypeChange={setKeywordType}
          inputValue={keyword}
          onInputChange={(value) => {
            setKeyword(value)
            setPage(1)
          }}
          placeholder="搜索活动名称"
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
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="primary" onClick={() => navigate('/campaign/new')}>
            添加活动
          </Button>
        </div>
      </FilterCard>

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
    </div>

  )
}
