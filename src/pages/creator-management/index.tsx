import {
  SettingFilled,
  StarFilled,
  TrophyFilled,
  UpCircleFilled,
} from '@ant-design/icons'
import { Avatar, Button, DatePicker, InputNumber, Modal, Select, Space, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs, { type Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type {
  CreatorBadge,
  CreatorLevel,
  CreatorManagementRow,
} from '../../mocks/creatorManagement'
import { creatorManagementRows } from '../../mocks/creatorManagement'
import FilterSplitField from '../../components/common/FilterSplitField'

const PAGE_SIZE = 10

const levelColors: Record<CreatorLevel, { text: string; bg: string; border: string }> = {
  'L1 新手': { text: '#475569', bg: '#eef2f7', border: '#d7dde5' },
  'L2 活跃': { text: '#2563eb', bg: '#eaf2ff', border: '#c2d7ff' },
  'L3 专业': { text: '#15803d', bg: '#e9f9ef', border: '#b6e5c6' },
  'L4 明星': { text: '#7c3aed', bg: '#f5eeff', border: '#dcc6ff' },
  'L5 传说': { text: '#a16207', bg: '#fff7e6', border: '#f2da9f' },
}

function renderBadgeIcon(badge: CreatorBadge) {
  if (badge === 'trophy') {
    return <TrophyFilled style={{ color: '#c58b05', fontSize: 14 }} />
  }

  if (badge === 'settings') {
    return <SettingFilled style={{ color: '#2563eb', fontSize: 14 }} />
  }

  if (badge === 'up') {
    return <UpCircleFilled style={{ color: '#16a34a', fontSize: 14 }} />
  }

  if (badge === 'star') {
    return <StarFilled style={{ color: '#8b5cf6', fontSize: 14 }} />
  }

  return <StarFilled style={{ color: '#ec4899', fontSize: 14 }} />
}

function badgeBgColor(badge: CreatorBadge) {
  if (badge === 'trophy') return '#fef3c7'
  if (badge === 'settings') return '#dbeafe'
  if (badge === 'up') return '#d1fae5'
  if (badge === 'star') return '#efe1ff'
  return '#ffe4f3'
}

function calculateNextLevel(value: number): CreatorLevel {
  if (value >= 10000) return 'L5 传说'
  if (value >= 5000) return 'L4 明星'
  if (value >= 2000) return 'L3 专业'
  if (value >= 500) return 'L2 活跃'
  return 'L1 新手'
}

export default function CreatorManagementPage() {
  const navigate = useNavigate()
  const [phoneKeyword, setPhoneKeyword] = useState('')
  const [phoneType, setPhoneType] = useState('phone')
  const [level, setLevel] = useState<'all' | CreatorLevel>('all')
  const [platform, setPlatform] = useState<'all' | '抖音' | '哔哩哔哩' | '小红书'>('all')
  const [certificationRange, setCertificationRange] = useState<[Dayjs | null, Dayjs | null] | null>(null)
  const [valueRange, setValueRange] = useState<{ min?: number; max?: number }>({})
  const [searchState, setSearchState] = useState({
    phoneKeyword: '',
    level: 'all' as 'all' | CreatorLevel,
    platform: 'all' as 'all' | '抖音' | '哔哩哔哩' | '小红书',
    certificationRange: null as [Dayjs | null, Dayjs | null] | null,
    valueRange: {} as { min?: number; max?: number },
  })
  const [page, setPage] = useState(1)

  const [isEditValueModalOpen, setIsEditValueModalOpen] = useState(false)
  const [editingRow, setEditingRow] = useState<CreatorManagementRow | null>(null)
  const [tempValue, setTempValue] = useState<number>(0)

  const currentLevelSuggest = useMemo(() => calculateNextLevel(editingRow?.totalValue || 0), [editingRow])
  const nextLevelSuggest = useMemo(() => calculateNextLevel(tempValue), [tempValue])
  const levelChanged = currentLevelSuggest !== nextLevelSuggest
  const isUpgrade = tempValue > (editingRow?.totalValue || 0)


  const filteredRows = useMemo(() => {
    return creatorManagementRows.filter((row) => {
      const phoneMatched = !searchState.phoneKeyword || row.phone.includes(searchState.phoneKeyword)
      const levelMatched = searchState.level === 'all' || row.level === searchState.level
      const platformMatched =
        searchState.platform === 'all' || row.verifiedPlatforms.includes(searchState.platform)
      const certificationMatched =
        !searchState.certificationRange ||
        (!searchState.certificationRange[0] && !searchState.certificationRange[1]) ||
        (() => {
          const certificationDate = dayjs(row.certificationTime)
          const [start, end] = searchState.certificationRange

          if (start && certificationDate.isBefore(start, 'day')) return false
          if (end && certificationDate.isAfter(end, 'day')) return false

          return true
        })()
      const minValueMatched =
        searchState.valueRange.min === undefined || row.totalValue >= searchState.valueRange.min
      const maxValueMatched =
        searchState.valueRange.max === undefined || row.totalValue <= searchState.valueRange.max

      return phoneMatched && levelMatched && platformMatched && certificationMatched && minValueMatched && maxValueMatched
    })
  }, [searchState])

  const pagedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredRows.slice(start, start + PAGE_SIZE)
  }, [filteredRows, page])

  const columns: ColumnsType<CreatorManagementRow> = [
    {
      title: '会员信息',
      key: 'name',
      width: 260,
      render: (_, row) => (
        <div className="creator-cell">
          <Avatar className="creator-avatar" size={44} src={row.avatarUrl}>
            {row.avatarFallback}
          </Avatar>
          <div>
            <div className="creator-name">{row.name}</div>
          </div>
        </div>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 180,
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 130,
      render: (value: CreatorLevel) => (
        <Tag
          bordered
          className="level-tag"
          style={{
            color: levelColors[value].text,
            background: levelColors[value].bg,
            borderColor: levelColors[value].border,
          }}
        >
          {value}
        </Tag>
      ),
    },
    {
      title: '总创作值',
      dataIndex: 'totalValue',
      key: 'totalValue',
      width: 140,
      sorter: (a, b) => a.totalValue - b.totalValue,
      render: (value: number) => value.toLocaleString('zh-CN'),
    },
    {
      title: '作品数',
      dataIndex: 'works',
      key: 'works',
      width: 110,
    },
    {
      title: '勋章',
      key: 'badges',
      width: 180,
      render: (_, row) => {
        if (!row.badges.length) {
          return <span className="creator-empty-badge">无</span>
        }

        return (
          <div className="creator-badge-group">
            {row.badges.map((badge) => (
              <span key={`${row.id}-${badge}`} className="creator-badge-dot" style={{ background: badgeBgColor(badge) }}>
                {renderBadgeIcon(badge)}
              </span>
            ))}
            {row.extraBadgeCount ? (
              <span className="creator-badge-dot creator-badge-extra">+{row.extraBadgeCount}</span>
            ) : null}
          </div>
        )
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 240,
      fixed: 'right',
      render: (_, row) => (
        <Space size={10} className="creator-actions">
          <Button
            type="link"
            className="creator-action-link"
            onClick={() => {
              setEditingRow(row)
              setTempValue(row.totalValue)
              setIsEditValueModalOpen(true)
            }}
          >
            修改创作值
          </Button>

          <span className="creator-action-divider" />
          <Button
            type="link"
            className="creator-action-link creator-action-view"
            onClick={() => navigate(`/creator-management/detail?id=${encodeURIComponent(row.id)}`)}
          >
            查看详情
          </Button>
        </Space>
      ),
    },
  ]

  const handleSearch = () => {
    setSearchState({ phoneKeyword, level, platform, certificationRange, valueRange })
    setPage(1)
  }

  const handleReset = () => {
    setPhoneKeyword('')
    setLevel('all')
    setPlatform('all')
    setCertificationRange(null)
    setValueRange({})
    setSearchState({
      phoneKeyword: '',
      level: 'all',
      platform: 'all',
      certificationRange: null,
      valueRange: {},
    })
    setPage(1)
  }

  const handleUpdateValue = () => {
    if (editingRow) {
      // In a real app, update the row in the database/state
      message.success(`${editingRow.name} 的创作值已更新`)
    }
    setIsEditValueModalOpen(false)
  }


  const start = filteredRows.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const end = Math.min(page * PAGE_SIZE, filteredRows.length)

  return (
    <div className="page-stack">
      <div className="creator-filter-card">
        <div className="creator-filter-grid">
          <div>
            <FilterSplitField
              options={[{ label: '手机号', value: 'phone' }]}
              typeValue={phoneType}
              onTypeChange={setPhoneType}
              inputValue={phoneKeyword}
              onInputChange={setPhoneKeyword}
              placeholder="搜索手机号"
              width="100%"
            />
          </div>

	          <div>
	            <Select
              className="filter-select"
              value={level}
              onChange={(value) => setLevel(value)}
              style={{ width: '100%' }}
              options={[
                { label: '全部等级', value: 'all' },
                { label: 'L1 新手', value: 'L1 新手' },
                { label: 'L2 活跃', value: 'L2 活跃' },
                { label: 'L3 专业', value: 'L3 专业' },
                { label: 'L4 明星', value: 'L4 明星' },
                { label: 'L5 传说', value: 'L5 传说' },
	              ]}
	            />
	          </div>

	          <div>
	            <Select
	              className="filter-select"
	              value={platform}
	              onChange={(value) => setPlatform(value)}
	              style={{ width: '100%' }}
	              options={[
	                { label: '所属平台', value: 'all' },
	                { label: '抖音', value: '抖音' },
	                { label: '哔哩哔哩', value: '哔哩哔哩' },
	                { label: '小红书', value: '小红书' },
	              ]}
	            />
	          </div>

	          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
	            <span style={{ color: '#475569', fontSize: 13, whiteSpace: 'nowrap' }}>认证时间 :</span>
	            <DatePicker.RangePicker
	              value={certificationRange}
	              onChange={(value) => setCertificationRange(value as [Dayjs | null, Dayjs | null] | null)}
	              style={{ width: '100%' }}
	              placeholder={['认证开始时间', '认证结束时间']}
	            />
	          </div>

	          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
	            <span style={{ color: '#475569', fontSize: 13, whiteSpace: 'nowrap' }}>创作值范围 :</span>
	            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
	              <InputNumber
	                style={{ width: '100%' }}
	                value={valueRange.min}
	                onChange={(value) => setValueRange((prev) => ({ ...prev, min: value ?? undefined }))}
	                placeholder="最低创作值"
	                min={0}
	              />
	              <InputNumber
	                style={{ width: '100%' }}
	                value={valueRange.max}
	                onChange={(value) => setValueRange((prev) => ({ ...prev, max: value ?? undefined }))}
	                placeholder="最高创作值"
	                min={0}
	              />
	            </div>
	          </div>

	          <div className="creator-filter-actions">
	            <Button size="large" onClick={handleReset}>
              重置
            </Button>
            <Button type="primary" size="large" onClick={handleSearch}>
              查询
            </Button>
          </div>
        </div>
      </div>

      <div className="table-card creator-management-table-card">
        <Table<CreatorManagementRow>
          rowKey="id"
          columns={columns}
          dataSource={pagedRows}
          pagination={false}
          size="middle"
          scroll={{ x: 'max-content' }}
          locale={{ emptyText: '暂无数据' }}
        />

        <div className="table-footer">
          <Typography.Text style={{ color: '#334155' }}>
            显示第 {start} 到 {end} 条，共 {filteredRows.length} 条结果
          </Typography.Text>

          <div className="creator-pagination">
            <Button
              type="text"
              size="small"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              {'<'}
            </Button>
            <span className="creator-page-active">{page}</span>
            <Button
              type="text"
              size="small"
              disabled={end >= filteredRows.length}
              onClick={() => setPage((prev) => prev + 1)}
            >
              {'>'}
            </Button>
          </div>
        </div>
      </div>

      <Modal
        title="修改创作值"
        open={isEditValueModalOpen}
        onOk={handleUpdateValue}
        onCancel={() => setIsEditValueModalOpen(false)}
        width={320}
        centered
      >
        <div style={{ padding: '16px 0' }}>
          <div style={{ marginBottom: 12, color: '#64748b' }}>
            当前值：{editingRow?.totalValue.toLocaleString()} ({editingRow?.level})
          </div>
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
              修改后将{isUpgrade ? '升级' : '降级'}为 {nextLevelSuggest}
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
