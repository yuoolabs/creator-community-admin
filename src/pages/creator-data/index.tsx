import { PlusOutlined, CloseCircleFilled } from '@ant-design/icons'
import { Avatar, Button, Card, Form, Input, InputNumber, Modal, Radio, Space, Table, message, Upload, Image, Typography } from 'antd'

const { Text } = Typography
import { useState } from 'react'
import type { ColumnsType } from 'antd/es/table'
import { creatorLevelRows, type CreatorLevelRow } from '../../mocks/creatorData'

export default function CreatorLevelPage() {
  const [data, setData] = useState(creatorLevelRows)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingRow, setEditingRow] = useState<CreatorLevelRow | null>(null)
  const [form] = Form.useForm()

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [statusActionRow, setStatusActionRow] = useState<CreatorLevelRow | null>(null)
  const [levelIconUrl, setLevelIconUrl] = useState<string | null>(null)
  const [avatarFrameUrl, setAvatarFrameUrl] = useState<string | null>(null)
  const [levelDowngradeRule, setLevelDowngradeRule] = useState<'none' | 'degrade'>('degrade')

  const lastEnabledId = [...data].reverse().find(r => r.status === '已启用')?.id

  const handleStatusToggleClick = (row: CreatorLevelRow) => {
    setStatusActionRow(row)
    setIsStatusModalOpen(true)
  }

  const confirmStatusToggle = () => {
    if (!statusActionRow) return
    const action = statusActionRow.status === '已启用' ? '禁用' : '启用'
    setData(prev => prev.map(item =>
      item.id === statusActionRow.id ? { ...item, status: action === '禁用' ? '已禁用' : '已启用' } : item
    ))
    message.success(`已${action} ${statusActionRow.level}`)
    setIsStatusModalOpen(false)
    setStatusActionRow(null)
  }

  const handleEdit = (row: CreatorLevelRow) => {
    setEditingRow(row)
    setLevelIconUrl(row.levelIcon || null)
    setAvatarFrameUrl(row.avatarFrame || null)
    form.setFieldsValue({
      levelName: row.levelName,
      requiredScore: row.requiredScore,
    })
    setIsEditModalOpen(true)
  }

  const handleAddNew = () => {
    if (data.length >= 10) {
      message.warning('最多只可添加 10 个等级')
      return
    }
    setEditingRow(null)
    setLevelIconUrl(null)
    setAvatarFrameUrl(null)
    form.resetFields()
    setIsEditModalOpen(true)
  }

  const handleUpload = (file: File, setter: (value: string) => void) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setter(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    return false // Prevent automatic upload
  }

  const handleSaveLevel = async () => {
    try {
      const values = await form.validateFields()
      if (!levelIconUrl) {
        message.warning('请上传等级图片')
        return
      }
      if (!avatarFrameUrl) {
        message.warning('请上传头像框')
        return
      }
      const levelData = {
        ...values,
        levelIcon: levelIconUrl,
        avatarFrame: avatarFrameUrl,
      }

      if (editingRow) {
        setData(prev => prev.map(item =>
          item.id === editingRow.id ? { ...item, ...levelData } : item
        ))
        message.success(`等级 ${editingRow.level} 已更新`)
      } else {
        const newLevel: CreatorLevelRow = {
          id: String(Date.now()),
          level: `L${data.length + 1}`,
          levelName: values.levelName,
          levelIcon: levelIconUrl || undefined,
          avatarFrame: avatarFrameUrl || undefined,
          requiredScore: values.requiredScore,
          creatorCount: 0,
          status: '已启用',
        }
        setData(prev => [...prev, newLevel])
        message.success('新等级添加成功')
      }
      setIsEditModalOpen(false)
    } catch (err) {
      // Form validation failed
    }
  }

  const renderAvatarFramePreview = (frameUrl?: string) => (
    <div style={{ position: 'relative', width: 64, height: 64 }}>
      <Avatar
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces"
        size={48}
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          border: '2px solid #fff',
          boxShadow: '0 4px 10px rgba(15, 23, 42, 0.12)',
        }}
      />
      {frameUrl ? (
        <img
          src={frameUrl}
          alt="头像框"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 20,
            border: '2px dashed #cbd5e1',
          }}
        />
      )}
    </div>
  )


  const columns: ColumnsType<CreatorLevelRow> = [
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 100,
    },
    {
      title: '等级名称',
      dataIndex: 'levelName',
      key: 'levelName',
      width: 180,
    },
    {
      title: <span style={{ whiteSpace: 'nowrap' }}>等级图片</span>,
      dataIndex: 'levelIcon',
      key: 'levelIcon',
      width: 100,
      render: (url: string) => (
        <Image
          src={url}
          width={40}
          height={40}
          style={{ objectFit: 'contain' }}
          preview={false}
          fallback="https://cdn-icons-png.flaticon.com/128/2583/2583344.png"
        />
      ),
    },
    {
      title: <span style={{ whiteSpace: 'nowrap' }}>头像框</span>,
      dataIndex: 'avatarFrame',
      key: 'avatarFrame',
      width: 120,
      render: (url?: string) => renderAvatarFramePreview(url),
    },
    {
      title: '所需创作值',
      dataIndex: 'requiredScore',
      key: 'requiredScore',
      width: 180,
    },
    {
      title: '创作者数量',
      dataIndex: 'creatorCount',
      key: 'creatorCount',
      width: 150,
    },
    {
      title: '等级状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: string) => (
        <span style={{ color: status === '已启用' ? '#475569' : '#94a3b8' }}>
          {status}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, row) => (
        <Space size={16}>
          <Button type="link" style={{ padding: 0 }} onClick={() => handleEdit(row)}>
            编辑
          </Button>
          {row.status === '已启用' ? (
            row.id === lastEnabledId && (
              <Button
                type="link"
                danger
                onClick={() => handleStatusToggleClick(row)}
                style={{ padding: 0 }}
              >
                禁用
              </Button>
            )
          ) : (
            <Button
              type="link"
              onClick={() => handleStatusToggleClick(row)}
              style={{ padding: 0 }}
            >
              启用
            </Button>
          )}
        </Space>
      )
    },
  ]

  return (
    <div className="page-stack">
      <Card className="table-card" bordered={false}>
        <Table<CreatorLevelRow>
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={false}
          size="middle"
        />
        <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9' }}>
          <Button
            type="link"
            icon={<PlusOutlined />}
            style={{ padding: 0, fontSize: 16 }}
            onClick={handleAddNew}
          >
            添加等级
          </Button>
        </div>
      </Card>

      <Card className="table-card" bordered={false}>
        <div style={{ padding: '8px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 48, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 180, paddingTop: 8, color: '#1f2937', fontSize: 16, fontWeight: 600 }}>
              降级规则：
            </div>
            <Radio.Group
              value={levelDowngradeRule}
              onChange={(e) => setLevelDowngradeRule(e.target.value)}
              style={{ display: 'flex', flexDirection: 'column', gap: 34 }}
            >
              <Radio value="none" style={{ fontSize: 16, color: '#4b5563' }}>
                不降级
              </Radio>
              <Radio value="degrade" style={{ fontSize: 16, color: '#4b5563' }}>
                <Space size={8} align="center" wrap>
                  <span>获得等级1年后，若最近1年的创作值未达到保级条件则降一级</span>
                </Space>
              </Radio>
            </Radio.Group>
          </div>
        </div>
      </Card>


      <Modal
        title={editingRow ? `编辑等级 - ${editingRow.level}` : '添加新等级'}
        open={isEditModalOpen}
        onOk={handleSaveLevel}
        onCancel={() => setIsEditModalOpen(false)}
        okText="保存"
        cancelText="取消"
        centered
        width={400}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="等级名称"
            name="levelName"
            rules={[{ required: true, message: '请输入等级名称' }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            label="所需创作值"
            name="requiredScore"
            rules={[{ required: true, message: '请输入所需创作值' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入创作值"
            />
          </Form.Item>
          <Form.Item
            label="等级图片"
            required
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {levelIconUrl ? (
                <div style={{
                  width: 80,
                  height: 80,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <img src={levelIconUrl} style={{ width: '80%', height: '80%', objectFit: 'contain' }} alt="Level Icon" />
                  <CloseCircleFilled
                    style={{ position: 'absolute', top: -8, right: -8, color: '#94a3b8', fontSize: 20, cursor: 'pointer', background: '#fff', borderRadius: '50%' }}
                    onClick={() => setLevelIconUrl(null)}
                  />
                </div>
              ) : (
                <Upload
                  showUploadList={false}
                  beforeUpload={(file) => handleUpload(file, (value) => setLevelIconUrl(value))}
                  accept="image/*"
                >
                  <div style={{
                    width: 80,
                    height: 80,
                    background: '#f8fafc',
                    border: '1px dashed #cbd5e1',
                    borderRadius: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}>
                    <PlusOutlined style={{ fontSize: 20, color: '#94a3b8', marginBottom: 4 }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>上传图片</Text>
                  </div>
                </Upload>
              )}
              <Text type="secondary" style={{ fontSize: 12 }}>建议尺寸 80x80 px，大小不超过 500KB</Text>
            </div>
          </Form.Item>
          <Form.Item
            label="头像框"
            required
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {avatarFrameUrl ? (
                <div style={{
                  width: 96,
                  height: 96,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  {renderAvatarFramePreview(avatarFrameUrl)}
                  <CloseCircleFilled
                    style={{ position: 'absolute', top: -8, right: -8, color: '#94a3b8', fontSize: 20, cursor: 'pointer', background: '#fff', borderRadius: '50%' }}
                    onClick={() => setAvatarFrameUrl(null)}
                  />
                </div>
              ) : (
                <Upload
                  showUploadList={false}
                  beforeUpload={(file) => handleUpload(file, (value) => setAvatarFrameUrl(value))}
                  accept="image/*"
                >
                  <div style={{
                    width: 96,
                    height: 96,
                    background: '#f8fafc',
                    border: '1px dashed #cbd5e1',
                    borderRadius: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}>
                    <PlusOutlined style={{ fontSize: 20, color: '#94a3b8', marginBottom: 4 }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>上传头像框</Text>
                  </div>
                </Upload>
              )}
              <Text type="secondary" style={{ fontSize: 12 }}>建议上传透明 PNG，尺寸 96x96 px，便于叠加在社区头像四周。</Text>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`确认${statusActionRow?.status === '已启用' ? '禁用' : '启用'}该等级？`}
        open={isStatusModalOpen}
        onOk={confirmStatusToggle}
        onCancel={() => setIsStatusModalOpen(false)}
        okText={`确认${statusActionRow?.status === '已启用' ? '禁用' : '启用'}`}
        cancelText="取消"
        okButtonProps={{ danger: statusActionRow?.status === '已启用' }}
        centered
        width={400}
      >
        <p style={{ marginTop: 16 }}>
          确定要{statusActionRow?.status === '已启用' ? '禁用' : '启用'} {statusActionRow?.level} ({statusActionRow?.levelName}) 吗？
        </p>
      </Modal>
    </div>
  )
}
