import { Button, Space, Tag, Avatar, Popconfirm, message, Modal, Form, Input, Upload, Image } from 'antd'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { useMemo, useState } from 'react'
import type { ColumnsType } from 'antd/es/table'
import DataTableCard from '../../components/common/DataTableCard'
import { badgeRows, type BadgeRow } from '../../mocks/badgeSystem'

const PAGE_SIZE = 10

export default function BadgeSystemPage() {
  const [data, setData] = useState<BadgeRow[]>(badgeRows)
  const [page, setPage] = useState(1)

  // Modal states
  const [modalVisible, setModalVisible] = useState(false)
  const [editingRow, setEditingRow] = useState<BadgeRow | null>(null)
  const [form] = Form.useForm()

  const pagedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return data.slice(start, start + PAGE_SIZE)
  }, [data, page])

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id))
    message.success('勋章已删除')
  }

  const handleToggleStatus = (id: string) => {
    setData(prev => prev.map(item => {
      if (item.id === id) {
        const newStatus = item.status === '启用' ? '停用' : '启用'
        return { ...item, status: newStatus }
      }
      return item
    }))
    message.success('操作成功')
  }

  const handleOpenModal = (record?: BadgeRow) => {
    if (record) {
      setEditingRow(record)
      form.setFieldsValue(record)
    } else {
      setEditingRow(null)
      form.resetFields()
    }
    setModalVisible(true)
  }

  const handleModalFinish = (values: any) => {
    if (editingRow) {
      // Edit
      setData(prev => prev.map(item =>
        item.id === editingRow.id ? { ...item, ...values, updatedAt: new Date().toISOString().replace('T', ' ').split('.')[0] } : item
      ))
      message.success('勋章已更新')
    } else {
      // Add
      const newBadge: BadgeRow = {
        id: `bd-${Date.now()}`,
        badgeName: values.badgeName,
        iconUrl: values.iconUrl || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=100&h=100&fit=crop',
        owners: 0,
        status: '启用',
        updatedAt: new Date().toISOString().replace('T', ' ').split('.')[0]
      }
      setData(prev => [newBadge, ...prev])
      message.success('新增成功')
    }
    setModalVisible(false)
  }

  const columns: ColumnsType<BadgeRow> = [
    {
      title: <span style={{ whiteSpace: 'nowrap' }}>勋章图标</span>,
      dataIndex: 'iconUrl',
      key: 'iconUrl',
      width: 100,
      render: (url) => (
        <Image
          src={url}
          width={48}
          height={48}
          style={{ borderRadius: 8, border: '1px solid #f1f5f9', objectFit: 'cover' }}
          preview={{ mask: '查看' }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
        />
      )
    },
    {
      title: <span style={{ whiteSpace: 'nowrap' }}>勋章名称</span>,
      dataIndex: 'badgeName',
      key: 'badgeName',
      width: 160
    },
    {
      title: <span style={{ whiteSpace: 'nowrap' }}>勋章说明</span>,
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 260
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
      width: 180
    },
    {
      title: <span style={{ whiteSpace: 'nowrap' }}>获得人数</span>,
      dataIndex: 'owners',
      key: 'owners',
      width: 120,
      sorter: (a, b) => a.owners - b.owners
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value: BadgeRow['status']) =>
        value === '启用' ? <Tag color="green">启用</Tag> : <Tag color="error">停用</Tag>,
    },
    {
      title: <span style={{ whiteSpace: 'nowrap' }}>更新时间</span>,
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleOpenModal(record)} style={{ padding: 0 }}>编辑</Button>

          <Popconfirm
            title={`确定要${record.status === '启用' ? '禁用' : '启用'}这个勋章吗？`}
            description={record.status === '启用' ? '禁用后用户将无法在个人中心展示此勋章' : '启用后勋章将恢复正常获取与展示'}
            onConfirm={() => handleToggleStatus(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              style={{ padding: 0, color: record.status === '启用' ? '#faad14' : '#52c41a' }}
            >
              {record.status === '启用' ? '禁用' : '启用'}
            </Button>
          </Popconfirm>

          <Popconfirm
            title="确定要彻底删除这个勋章吗？"
            description="删除后已获得勋章的用户也将失去此勋章，请谨慎操作"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            okButtonProps={{ danger: true }}
            cancelText="取消"
          >
            <Button type="link" danger style={{ padding: 0 }}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="page-stack">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
          style={{ height: 38, borderRadius: 8, display: 'flex', alignItems: 'center' }}
        >
          新增勋章
        </Button>
      </div>

      <DataTableCard
        columns={columns}
        rows={pagedRows}
        currentPage={page}
        pageSize={PAGE_SIZE}
        total={data.length}
        onPageChange={(nextPage) => setPage(nextPage)}
      />

      <Modal
        title={editingRow ? '编辑勋章' : '新增勋章'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={480}
        centered
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 20 }}
          onFinish={handleModalFinish}
          initialValues={{ status: '启用' }}
        >
          <Form.Item
            label="勋章名称"
            name="badgeName"
            rules={[{ required: true, message: '请输入勋章名称' }]}
          >
            <Input placeholder="例如：创作达人" maxLength={15} showCount />
          </Form.Item>

          <Form.Item
            label="勋章图标"
            name="iconUrl"
            rules={[{ required: true, message: '请上传勋章图标' }]}
          >
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <Avatar shape="square" size={64} icon={<UploadOutlined />} src={form.getFieldValue('iconUrl')} style={{ borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc' }} />
              <div>
                <Upload showUploadList={false} maxCount={1}>
                  <Button icon={<UploadOutlined />}>点击上传</Button>
                </Upload>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>
                  建议尺寸：100x100，支持 png、jpg 格式
                </div>
              </div>
            </div>
          </Form.Item>

          <Form.Item label="勋章说明" name="description">
            <Input.TextArea placeholder="请输入勋章获取条件或背景说明" rows={3} maxLength={100} showCount />
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <Input placeholder="内部备注信息" maxLength={30} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
