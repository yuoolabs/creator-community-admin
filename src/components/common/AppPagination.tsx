import { Pagination } from 'antd'

interface AppPaginationProps {
    current: number
    pageSize: number
    total: number
    onChange: (page: number, pageSize: number) => void
}

export default function AppPagination({
    current,
    pageSize,
    total,
    onChange,
}: AppPaginationProps) {
    return (
        <Pagination
            current={current}
            pageSize={pageSize}
            total={total}
            onChange={onChange}
            showSizeChanger
            showTotal={(total) => `共 ${total} 条`}
            className="app-pagination"
        />
    )
}
