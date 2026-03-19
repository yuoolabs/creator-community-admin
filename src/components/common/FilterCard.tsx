import { Space } from 'antd'
import type { ReactNode } from 'react'

type FilterCardProps = {
  children: ReactNode
}

export default function FilterCard({ children }: FilterCardProps) {
  return (
    <div className="filter-bar-card">
      <Space size={12} wrap style={{ width: '100%' }}>
        {children}
      </Space>
    </div>
  )
}
