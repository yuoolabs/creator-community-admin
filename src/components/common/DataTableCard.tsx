import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AppPagination from './AppPagination'

type DataTableCardProps<T extends { id: string }> = {
  columns: ColumnsType<T>
  rows: T[]
  currentPage: number
  pageSize: number
  total: number
  onPageChange: (page: number, pageSize: number) => void
}

export default function DataTableCard<T extends { id: string }>({
  columns,
  rows,
  currentPage,
  pageSize,
  total,
  onPageChange,
}: DataTableCardProps<T>) {
  return (
    <div className="table-card">
      <Table<T>
        rowKey="id"
        columns={columns}
        dataSource={rows}
        pagination={false}
        size="middle"
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: '暂无数据' }}
      />

      <div className="table-footer">
        <AppPagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
        />
      </div>
    </div>
  )
}
