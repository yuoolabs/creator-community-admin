import { useMemo, useState } from 'react'
import CreatorReviewFilterBar from '../../components/common/CreatorReviewFilterBar'
import CreatorReviewTable from '../../components/common/CreatorReviewTable'
import { creatorRows, platformOptions } from '../../mocks/creatorReview'
import type { CreatorReviewRow, FilterState } from '../../types/admin'

const DEFAULT_PAGE_SIZE = 10

function sortRows(rows: CreatorReviewRow[], sort: string): CreatorReviewRow[] {
  const sorted = [...rows]
  sorted.sort((a, b) => {
    const value = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
    return sort === 'earliest' ? value : -value
  })
  return sorted
}

export default function CreatorReviewPage() {
  const [rows, setRows] = useState<CreatorReviewRow[]>(creatorRows)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [filterState, setFilterState] = useState<FilterState>({
    keyword: '',
    platform: 'all',
    sort: 'latest',
    tab: 'pending',
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  })

  const counts = useMemo(() => {
    return {
      pending: rows.filter((item) => item.status === 'pending').length,
      approved: rows.filter((item) => item.status === 'approved').length,
      rejected: rows.filter((item) => item.status === 'rejected').length,
    }
  }, [rows])

  const filteredRows = useMemo(() => {
    let result = [...rows]

    if (filterState.tab !== 'all') {
      result = result.filter((item) => item.status === filterState.tab)
    }

    if (filterState.platform !== 'all') {
      result = result.filter((item) => item.platform === filterState.platform)
    }

    if (filterState.keyword.trim()) {
      const keyword = filterState.keyword.trim().toLowerCase()
      result = result.filter(
        (item) =>
          item.accountId.toLowerCase().includes(keyword) ||
          item.phone.toLowerCase().includes(keyword)
      )
    }

    return sortRows(result, filterState.sort)
  }, [rows, filterState])

  const pageRows = useMemo(() => {
    const start = (filterState.page - 1) * filterState.pageSize
    const end = start + filterState.pageSize
    return filteredRows.slice(start, end)
  }, [filterState.page, filterState.pageSize, filteredRows])

  const updateFilterState = (next: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...next }))
  }

  const updateStatus = (
    rowId: string,
    status: CreatorReviewRow['status'],
    rejectReason?: string,
  ) => {
    setRows((prev) =>
      prev.map((item) =>
        item.id === rowId
          ? {
            ...item,
            status,
            rejectReason: status === 'rejected' ? rejectReason : undefined,
            actions: status === 'pending' ? ['通过', '拒绝'] : status === 'rejected' ? ['查看原因'] : [],
          }
          : item,
      ),
    )
    setSelectedRowKeys((prev) => prev.filter((key) => key !== rowId))
  }

  const updateStatusInBatch = (
    rowIds: string[],
    status: CreatorReviewRow['status'],
    rejectReason?: string,
  ) => {
    if (rowIds.length === 0) {
      return
    }
    const rowIdSet = new Set(rowIds)
    setRows((prev) =>
      prev.map((item) =>
        rowIdSet.has(item.id)
          ? {
            ...item,
            status,
            rejectReason: status === 'rejected' ? rejectReason : undefined,
            actions:
              status === 'pending'
                ? ['通过', '拒绝']
                : status === 'rejected'
                  ? ['查看原因']
                  : [],
          }
          : item,
      ),
    )
    setSelectedRowKeys([])
  }

  return (
    <div className="page-stack">
      <CreatorReviewFilterBar
        filterState={filterState}
        pendingCount={counts.pending}
        approvedCount={counts.approved}
        rejectedCount={counts.rejected}
        platformOptions={platformOptions}
        onTabChange={(tab) => {
          setSelectedRowKeys([])
          updateFilterState({ tab, page: 1 })
        }}
        onKeywordChange={(keyword) => {
          setSelectedRowKeys([])
          updateFilterState({ keyword, page: 1 })
        }}
        onPlatformChange={(platform) => {
          setSelectedRowKeys([])
          updateFilterState({ platform, page: 1 })
        }}
        onQuery={() => {
          setSelectedRowKeys([])
          updateFilterState({ page: 1 })
        }}
      />

      <CreatorReviewTable
        rows={pageRows}
        currentPage={filterState.page}
        pageSize={filterState.pageSize}
        total={filteredRows.length}
        onPageChange={(page, pageSize) => updateFilterState({ page, pageSize })}
        onApprove={(rowId) => updateStatus(rowId, 'approved')}
        onReject={(rowId, reason) => updateStatus(rowId, 'rejected', reason)}
        enableBatchReview={filterState.tab === 'pending'}
        selectedRowKeys={selectedRowKeys}
        onSelectionChange={setSelectedRowKeys}
        onBatchApprove={() => updateStatusInBatch(selectedRowKeys, 'approved')}
        onBatchReject={(reason) =>
          updateStatusInBatch(selectedRowKeys, 'rejected', reason)
        }
      />
    </div>
  )
}
