import { DownOutlined } from '@ant-design/icons'
import { Button, Segmented, Select } from 'antd'
import PlatformBadge from './PlatformBadge'
import FilterSplitField from './FilterSplitField'
import type { FilterState } from '../../types/admin'

type CreatorReviewFilterBarProps = {
  filterState: FilterState
  pendingCount: number
  approvedCount: number
  rejectedCount: number
  platformOptions: Array<{ label: string; value: string }>
  onTabChange: (tab: FilterState['tab']) => void
  onKeywordChange: (keyword: string) => void
  onPlatformChange: (platform: string) => void
  onQuery: () => void
}

export default function CreatorReviewFilterBar({
  filterState,
  pendingCount,
  approvedCount,
  rejectedCount,
  platformOptions,
  onTabChange,
  onKeywordChange,
  onPlatformChange,
  onQuery,
}: CreatorReviewFilterBarProps) {
  const tabOptions = [
    {
      label: `待审核 (${pendingCount})`,
      value: 'pending',
    },
    {
      label: `已通过 (${approvedCount})`,
      value: 'approved',
    },
    {
      label: `已拒绝 (${rejectedCount})`,
      value: 'rejected',
    },
  ]

  return (
    <div className="filter-bar-card creator-review-filter-bar">
      <div className="creator-review-filter-main">
        <div className="creator-review-filter-left">
          <Segmented
            options={tabOptions}
            value={filterState.tab}
            onChange={(value) => onTabChange(String(value))}
          />

          <FilterSplitField
            options={[
              { label: '手机号', value: 'phone' },
              { label: '账号ID', value: 'accountId' }
            ]}
            typeValue="phone"
            onTypeChange={() => undefined}
            inputValue={filterState.keyword}
            onInputChange={onKeywordChange}
            placeholder="搜索手机号"
            width={300}
          />


        </div>

        <div className="creator-review-filter-right">
          <Select
            options={platformOptions.map((option) => ({
              value: option.value,
              label:
                option.value === 'all' ? (
                  option.label
                ) : (
                  <PlatformBadge platform={String(option.value)} compact />
                ),
            }))}
            value={filterState.platform}
            onChange={onPlatformChange}
            className="filter-select"
            style={{ width: 220 }}
            suffixIcon={<DownOutlined style={{ fontSize: 12 }} />}
          />
          <Button type="primary" onClick={onQuery}>
            查询
          </Button>
        </div>
      </div>
    </div>
  )
}
