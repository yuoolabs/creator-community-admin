import { Tag } from 'antd'
import { statusStyles } from '../../mocks/creatorReview'
import type { ReviewStatus } from '../../types/admin'

type StatusTagProps = {
  status: ReviewStatus
}

export default function StatusTag({ status }: StatusTagProps) {
  const style = statusStyles[status]

  return (
    <Tag
      style={{
        marginInlineEnd: 0,
        borderRadius: 999,
        paddingInline: 10,
        lineHeight: '20px',
        color: style.color,
        background: style.bg,
        borderColor: style.border,
      }}
    >
      {style.text}
    </Tag>
  )
}
