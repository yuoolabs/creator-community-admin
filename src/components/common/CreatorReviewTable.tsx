import { Avatar, Button, Image, Input, Modal, Popconfirm, Space, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import type { CreatorReviewRow } from '../../types/admin'
import PlatformBadge from './PlatformBadge'
import StatusTag from './StatusTag'
import AppPagination from './AppPagination'

type CreatorReviewTableProps = {
  rows: CreatorReviewRow[]
  currentPage: number
  pageSize: number
  total: number
  onPageChange: (page: number, pageSize: number) => void
  onApprove: (rowId: string) => void
  onReject: (rowId: string, reason: string) => void
  enableBatchReview?: boolean
  selectedRowKeys?: string[]
  onSelectionChange?: (keys: string[]) => void
  onBatchApprove?: () => void
  onBatchReject?: (reason: string) => void
}

export default function CreatorReviewTable({
  rows,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onApprove,
  onReject,
  enableBatchReview = false,
  selectedRowKeys = [],
  onSelectionChange,
  onBatchApprove,
  onBatchReject,
}: CreatorReviewTableProps) {
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectRowId, setRejectRowId] = useState<string | null>(null)
  const [rejectTargetLabel, setRejectTargetLabel] = useState('')
  const [batchRejectMode, setBatchRejectMode] = useState(false)
  const [viewReasonModalOpen, setViewReasonModalOpen] = useState(false)
  const [viewingReason, setViewingReason] = useState('')
  const [viewingTarget, setViewingTarget] = useState('')


  const confirmRejectDisabled = useMemo(
    () => rejectReason.trim().length === 0,
    [rejectReason],
  )

  const openSingleRejectModal = (row: CreatorReviewRow) => {
    setBatchRejectMode(false)
    setRejectRowId(row.id)
    setRejectTargetLabel(`${row.accountId}（${row.accountNickname}）`)
    setRejectReason('')
    setRejectModalOpen(true)
  }

  const openBatchRejectModal = () => {
    if (selectedRowKeys.length === 0) {
      return
    }
    setBatchRejectMode(true)
    setRejectRowId(null)
    setRejectTargetLabel(`${selectedRowKeys.length} 个账号`)
    setRejectReason('')
    setRejectModalOpen(true)
  }

  const closeRejectModal = () => {
    setRejectModalOpen(false)
    setRejectReason('')
    setRejectRowId(null)
    setRejectTargetLabel('')
    setBatchRejectMode(false)
  }

  const submitReject = () => {
    const finalReason = rejectReason.trim()
    if (!finalReason) {
      return
    }
    if (batchRejectMode) {
      onBatchReject?.(finalReason)
    } else if (rejectRowId) {
      onReject(rejectRowId, finalReason)
    }
    closeRejectModal()
  }

  const columns: ColumnsType<CreatorReviewRow> = [
    {
      title: '会员信息',
      dataIndex: 'userName',
      key: 'userName',
      width: 180,
      render: (value: string, row) => (
        <Space size={10}>
          {row.userAvatar ? (
            <Avatar src={row.userAvatar} size={30} />
          ) : (
            <Avatar shape="square" size={30} style={{ background: '#d9d9d9' }} />
          )}
          <Typography.Text style={{ color: '#475569' }}>{value}</Typography.Text>
        </Space>
      ),
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      width: 140,
      render: (platform: string) => <PlatformBadge platform={platform} compact />,
    },
    {
      title: '账号ID',
      dataIndex: 'accountId',
      key: 'accountId',
      width: 180,
      render: (value: string) => <Typography.Text style={{ color: '#0f172a' }}>{value}</Typography.Text>,
    },
    {
      title: '账号昵称',
      dataIndex: 'accountNickname',
      key: 'accountNickname',
      width: 180,
      render: (value: string) => (
        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
          {value}
        </Typography.Text>
      ),
    },
    {
      title: '个人页截图',
      dataIndex: 'proofImage',
      key: 'proofImage',
      width: 180,
      render: (proofImage: string) => (
        <Space size={8}>
          <Image
            className="proof-image"
            src={proofImage}
            alt="凭证"
            preview={{ mask: '查看大图' }}
            width={64}
            height={40}
            style={{ objectFit: 'cover', borderRadius: 4 }}
          />
        </Space>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      width: 160,
      render: (value: string) => {
        const date = dayjs(value)
        return (
          <div>
            <Typography.Text style={{ color: '#64748b' }}>
              {date.format('YYYY-MM-DD')}
            </Typography.Text>
            <br />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {date.format('HH:mm')}
            </Typography.Text>
          </div>
        )
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (_, row) => <StatusTag status={row.status} />,
    },
    {
      title: '操作',
      dataIndex: 'actions',
      key: 'actions',
      width: 140,
      fixed: 'right',
      render: (_, row) => {
        if (row.status === 'pending') {
          return (
            <Space size={12}>
              <Popconfirm
                title="确认通过该账号审核？"
                description={`将通过账号 ${row.accountId}（${row.accountNickname}）`}
                okText="确认通过"
                cancelText="取消"
                onConfirm={() => onApprove(row.id)}
              >
                <Button type="link" size="small">
                  通过
                </Button>
              </Popconfirm>
              <Button
                type="link"
                size="small"
                danger
                onClick={() => openSingleRejectModal(row)}
              >
                拒绝
              </Button>
            </Space>
          )
        }

        if (row.status === 'rejected') {
          return (
            <Button
              type="link"
              size="small"
              style={{ paddingInline: 0 }}
              onClick={() => {
                setViewingReason(row.rejectReason || '未填写原因')
                setViewingTarget(`${row.accountId}（${row.accountNickname}）`)
                setViewReasonModalOpen(true)
              }}
            >
              查看原因
            </Button>
          )
        }


        return null
      },
    },
  ]


  return (
    <div className="table-card">
      {enableBatchReview ? (
        <div className="batch-review-toolbar">
          <span style={{ color: '#64748b' }}>
            已选择 {selectedRowKeys.length} 条待审核记录
          </span>
          <Space size={8}>
            <Popconfirm
              title="确认批量通过所选账号？"
              description={`将通过 ${selectedRowKeys.length} 个账号`}
              okText="确认通过"
              cancelText="取消"
              disabled={selectedRowKeys.length === 0}
              onConfirm={onBatchApprove}
            >
              <Button type="primary" disabled={selectedRowKeys.length === 0}>
                批量通过
              </Button>
            </Popconfirm>
            <Button
              danger
              disabled={selectedRowKeys.length === 0}
              onClick={openBatchRejectModal}
            >
              批量拒绝
            </Button>
          </Space>
        </div>
      ) : null}

      <Table
        rowKey="id"
        columns={columns}
        dataSource={rows}
        rowSelection={
          enableBatchReview
            ? {
              selectedRowKeys,
              onChange: (keys) => onSelectionChange?.(keys as string[]),
              getCheckboxProps: (record) => ({
                disabled: record.status !== 'pending',
              }),
            }
            : undefined
        }
        pagination={false}
        size="middle"
        bordered={false}
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: '暂无待处理数据' }}
      />

      <div className="table-footer">
        <AppPagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
        />
      </div>

      <Modal
        title="确认拒绝审核"
        open={rejectModalOpen}
        onCancel={closeRejectModal}
        onOk={submitReject}
        okText="确认拒绝"
        cancelText="取消"
        okButtonProps={{ danger: true, disabled: confirmRejectDisabled }}
        styles={{ body: { paddingBottom: 20 } }}
      >
        <Typography.Paragraph style={{ marginBottom: 12 }}>
          将拒绝 <Typography.Text strong>{rejectTargetLabel}</Typography.Text>，请填写拒绝原因。
        </Typography.Paragraph>
        <Input.TextArea
          value={rejectReason}
          onChange={(event) => setRejectReason(event.target.value)}
          placeholder="请输入拒绝原因（必填）"
          rows={4}
          maxLength={200}
          showCount
        />
      </Modal>

      <Modal
        title="查看拒绝原因"
        open={viewReasonModalOpen}
        onCancel={() => setViewReasonModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setViewReasonModalOpen(false)}>
            我知道了
          </Button>,
        ]}
        width={400}
        centered
      >
        <div style={{ padding: '8px 0' }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: '#64748b', fontSize: 13, marginBottom: 4 }}>审核对象</div>
            <div style={{ color: '#0f172a', fontWeight: 600 }}>{viewingTarget}</div>
          </div>
          <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 8, padding: 12 }}>
            <div style={{ color: '#991b1b', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>拒绝原因</div>
            <div style={{ color: '#b91c1c', lineHeight: 1.6 }}>{viewingReason}</div>
          </div>
        </div>
      </Modal>
    </div>

  )
}
