import { Button, Checkbox, Form, Select, Space, Switch, Typography, InputNumber, Table, Modal, Input, Popconfirm, message, Radio, Upload } from 'antd'
import { QuestionCircleOutlined, HolderOutlined, CloseCircleFilled, PlusOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { themeColors } from '../../theme/colors'

const { Text, Title, Link } = Typography

// 类目设置组件
function CategorySettings() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [form] = Form.useForm()

  const [categories, setCategories] = useState([
    { id: '1', name: '最新', count: null, status: false, createdAt: null, isSystem: true, isMovable: false },
    { id: '2', name: '精选', count: null, status: false, createdAt: null, isSystem: true, isMovable: false },
    { id: '3', name: '美妆分类', count: 8, status: true, createdAt: '2025-05-13 14:54:40', isSystem: false, isMovable: true },
    { id: '4', name: '户外运动', count: 7, status: true, createdAt: '2025-05-13 14:55:39', isSystem: false, isMovable: true },
    { id: '5', name: '美食Share', count: 4, status: true, createdAt: '2025-05-13 15:17:29', isSystem: false, isMovable: true },
    { id: '6', name: 'PLAZA', count: 1, status: true, createdAt: '2025-05-14 11:32:37', isSystem: false, isMovable: true },
  ])

  const handleToggleStatus = (id: string, checked: boolean) => {
    setCategories(prev => prev.map(item =>
      item.id === id ? { ...item, status: checked } : item
    ))
    message.success(`${checked ? '已开启' : '已隐藏'}显示状态`)
  }

  const handleDelete = (id: string) => {
    setCategories(prev => prev.filter(item => item.id !== id))
    message.success('类目已删除')
  }

  const handleAdd = () => {
    setEditingItem(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (record: any) => {
    setEditingItem(record)
    form.setFieldsValue({ name: record.name })
    setIsModalOpen(true)
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingItem) {
        setCategories(prev => prev.map(item =>
          item.id === editingItem.id ? { ...item, name: values.name } : item
        ))
        message.success('类目已更新')
      } else {
        const newId = String(Date.now())
        setCategories(prev => [...prev, {
          id: newId,
          name: values.name,
          count: 0,
          status: true,
          createdAt: new Date().toISOString().replace('T', ' ').split('.')[0],
          isSystem: false,
          isMovable: true
        }])
        message.success('类目已添加')
      }
      setIsModalOpen(false)
    })
  }

  const columns = [
    {
      title: '类目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          {record.isMovable && <HolderOutlined style={{ color: '#94a3b8', cursor: 'grab' }} />}
          <span style={{ color: record.isSystem ? '#64748b' : '#1e293b', fontWeight: record.isSystem ? 400 : 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: '关联帖子数',
      dataIndex: 'count',
      key: 'count',
      render: (text: any) => (text === null ? '-' : text),
    },
    {
      title: '显示状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean, record: any) => (
        <Switch
          checked={status}
          onChange={(checked) => handleToggleStatus(record.id, checked)}
          checkedChildren="显示"
          unCheckedChildren="隐藏"
          size="small"
        />
      ),
    },
    {
      title: '添加时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: any) => (text === null ? '-' : text),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: any) => {
        if (record.isSystem) return <span style={{ color: '#cbd5e1' }}>-</span>
        return (
          <Space size={16}>
            <Link onClick={() => handleEdit(record)}>编辑</Link>
            <Popconfirm
              title="确定删除该类目吗？"
              description="删除后关联的作品将失去归属。"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
              placement="topRight"
            >
              <Link danger>删除</Link>
            </Popconfirm>
          </Space>
        )
      },
    },
  ]

  return (
    <div style={{ padding: '0 0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
        <Button
          type="primary"
          onClick={handleAdd}
          style={{
            background: themeColors.primary,
            borderRadius: 6,
            height: 36,
            fontSize: 14,
            fontWeight: 500
          }}
        >
          添加类目 ({categories.length}/20)
        </Button>
      </div>
      <div className="table-card">
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          pagination={false}
          size="middle"
          bordered={false}
        />
      </div>

      <Modal
        title={editingItem ? "编辑类目" : "添加类目"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleModalOk}
        okText="确定"
        cancelText="取消"
        centered
        width={480}
        bodyStyle={{ paddingTop: 32, paddingBottom: 64 }}
      >
        <Form form={form} layout="horizontal" colon={false}>
          <Form.Item
            name="name"
            label={<span style={{ color: '#1e293b', fontWeight: 500 }}>类目名称：</span>}
            rules={[{ required: true, message: '请输入类目名称' }]}
            style={{ marginBottom: 0 }}
          >
            <Input
              placeholder="请输入类目名称"
              maxLength={8}
              showCount
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default function SettingsPage() {
  const [activeMenu, setActiveMenu] = useState('基础设置')
  const [publishBtnStyle, setPublishBtnStyle] = useState('custom')
  const [featuredTagStyle, setFeaturedTagStyle] = useState('custom')

  // 图片上传状态
  const [publishBtnImage, setPublishBtnImage] = useState<string | null>(null)
  const [featuredTagImage, setFeaturedTagImage] = useState<string | null>(null)

  // 处理图片模拟上传
  const handleUpload = (type: 'publish' | 'tag', file: any) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (type === 'publish') setPublishBtnImage(e.target?.result as string)
      else setFeaturedTagImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    return false // 阻止自动上传
  }

  const menuItems = [
    '基础设置',
    '类目设置'
  ]

  return (
    <div style={{
      display: 'flex',
      minHeight: 'calc(100vh - 120px)',
      background: '#fff',
      borderRadius: 12,
      border: '1px solid #e2e8f0',
      overflow: 'hidden'
    }}>
      {/* 左侧侧边栏 */}
      <div style={{ width: 180, borderRight: '1px solid #f1f5f9', background: '#f8fafc' }}>
        {menuItems.map(item => (
          <div
            key={item}
            onClick={() => setActiveMenu(item)}
            style={{
              padding: '16px 24px',
              cursor: 'pointer',
              fontSize: 14,
              color: activeMenu === item ? themeColors.primary : '#475569',
              background: activeMenu === item ? '#eff6ff' : 'transparent',
              fontWeight: activeMenu === item ? 600 : 400,
              borderRight: activeMenu === item ? `2px solid ${themeColors.primary}` : 'none'
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* 右侧主内容区 */}
      <div style={{ flex: 1, padding: '24px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: activeMenu === '基础设置' ? 24 : 12 }}>
          <Title level={5} style={{ margin: 0 }}>{activeMenu}</Title>
          {activeMenu === '基础设置' && <Button size="small">推广</Button>}
        </div>

        {activeMenu === '基础设置' && (
          <Form
            layout="horizontal"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            style={{ maxWidth: 1000 }}
            labelAlign="left"
            colon={false}
          >
            {/* 作品审核 */}
            <Form.Item label={<Text strong>作品审核：</Text>}>
              <Space size={16}>
                <Switch defaultChecked />
                <Text type="secondary">用户发布的作品必须审核通过后才会显示出来</Text>
              </Space>
            </Form.Item>

            {/* 创作值奖励 */}
            <Form.Item label={
              <Space size={4}>
                <Text strong>创作值奖励</Text>
                <QuestionCircleOutlined style={{ color: '#94a3b8' }} />
                <Text strong>：</Text>
              </Space>
            }>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* 帖子被加精奖励 */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 4 }}>
                  <Checkbox defaultChecked>
                    <Space>
                      帖子被加精 <QuestionCircleOutlined style={{ color: '#94a3b8', fontSize: 13 }} />
                    </Space>
                  </Checkbox>
                  <div style={{ marginTop: 12, paddingLeft: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Text>可以获得</Text>
                    <InputNumber defaultValue={10} style={{ width: 80 }} />
                    <Text>创作值</Text>
                    <Select
                      defaultValue="daily"
                      style={{ width: 100 }}
                      options={[
                        { label: '活动中', value: 'campaign' },
                        { label: '每日', value: 'daily' },
                        { label: '每周', value: 'weekly' },
                        { label: '每月', value: 'monthly' },
                      ]}
                    />
                    <Text>最多可以获得</Text>
                    <InputNumber defaultValue={19} style={{ width: 80 }} />
                    <Text>次</Text>
                  </div>
                </div>

                {/* 发布作品奖励 */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 4 }}>
                  <Checkbox defaultChecked>
                    <Space>
                      发布作品 <QuestionCircleOutlined style={{ color: '#94a3b8', fontSize: 13 }} />
                    </Space>
                  </Checkbox>
                  <div style={{ marginTop: 12, paddingLeft: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Text>可以获得</Text>
                    <InputNumber defaultValue={2} style={{ width: 80 }} />
                    <Text>创作值</Text>
                    <Select
                      defaultValue="daily"
                      style={{ width: 100 }}
                      options={[
                        { label: '活动中', value: 'campaign' },
                        { label: '每日', value: 'daily' },
                        { label: '每周', value: 'weekly' },
                        { label: '每月', value: 'monthly' },
                      ]}
                    />
                    <Text>最多可以获得</Text>
                    <InputNumber defaultValue={50} style={{ width: 80 }} />
                    <Text>次</Text>
                  </div>
                </div>

                {/* 作品被评优秀 */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 4 }}>
                  <Checkbox defaultChecked>
                    <Space>
                      作品被评优秀 <QuestionCircleOutlined style={{ color: '#94a3b8', fontSize: 13 }} />
                    </Space>
                  </Checkbox>
                  <div style={{ marginTop: 12, paddingLeft: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Text>可以获得</Text>
                    <InputNumber defaultValue={3} style={{ width: 80 }} />
                    <Text>创作值</Text>
                    <Select
                      defaultValue="daily"
                      style={{ width: 100 }}
                      options={[
                        { label: '活动中', value: 'campaign' },
                        { label: '每日', value: 'daily' },
                        { label: '每周', value: 'weekly' },
                        { label: '每月', value: 'monthly' },
                      ]}
                    />
                    <Text>最多可以获得</Text>
                    <InputNumber defaultValue={30} style={{ width: 80 }} />
                    <Text>次</Text>
                  </div>
                </div>
              </div>
            </Form.Item>

            {/* 发布按钮 */}
            <Form.Item label={<Text strong>发布按钮：</Text>}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Radio.Group value={publishBtnStyle} onChange={e => setPublishBtnStyle(e.target.value)}>
                  <Radio value="default">默认样式</Radio>
                  <Radio value="custom">自定义</Radio>
                </Radio.Group>
                {publishBtnStyle === 'custom' && (
                  <div style={{ background: '#f8fafc', padding: '24px', borderRadius: 8, maxWidth: 600 }}>
                    {publishBtnImage ? (
                      <div style={{
                        width: 120,
                        height: 120,
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        marginBottom: 12
                      }}>
                        <img src={publishBtnImage} style={{ width: 80, height: 80, objectFit: 'contain' }} alt="发布按钮" />
                        <CloseCircleFilled
                          style={{ position: 'absolute', top: -8, right: -8, color: '#94a3b8', fontSize: 20, cursor: 'pointer', background: '#fff', borderRadius: '50%' }}
                          onClick={() => setPublishBtnImage(null)}
                        />
                      </div>
                    ) : (
                      <Upload
                        showUploadList={false}
                        beforeUpload={(file) => handleUpload('publish', file)}
                        accept="image/*"
                      >
                        <div style={{
                          width: 120,
                          height: 120,
                          background: '#fff',
                          border: '1px dashed #cbd5e1',
                          borderRadius: 4,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          marginBottom: 12
                        }}>
                          <PlusOutlined style={{ fontSize: 24, color: '#94a3b8', marginBottom: 8 }} />
                          <Text type="secondary" style={{ fontSize: 12 }}>上传图片</Text>
                        </div>
                      </Upload>
                    )}
                    <Text type="secondary" style={{ fontSize: 13 }}>建议宽度120px，高度不限，大小不超过 1 MB</Text>
                  </div>
                )}
              </div>
            </Form.Item>

            {/* 优秀标签 */}
            <Form.Item label={<Text strong>优秀标签：</Text>}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Radio.Group value={featuredTagStyle} onChange={e => setFeaturedTagStyle(e.target.value)}>
                  <Radio value="default">默认样式</Radio>
                  <Radio value="custom">自定义</Radio>
                </Radio.Group>
                {featuredTagStyle === 'custom' && (
                  <div style={{ background: '#f8fafc', padding: '24px', borderRadius: 8, maxWidth: 600 }}>
                    {featuredTagImage ? (
                      <div style={{
                        width: 120,
                        height: 100,
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        marginBottom: 12
                      }}>
                        <img src={featuredTagImage} style={{ height: 40, objectFit: 'contain' }} alt="优秀标签" />
                        <CloseCircleFilled
                          style={{ position: 'absolute', top: -8, right: -8, color: '#94a3b8', fontSize: 20, cursor: 'pointer', background: '#fff', borderRadius: '50%' }}
                          onClick={() => setFeaturedTagImage(null)}
                        />
                      </div>
                    ) : (
                      <Upload
                        showUploadList={false}
                        beforeUpload={(file) => handleUpload('tag', file)}
                        accept="image/*"
                      >
                        <div style={{
                          width: 120,
                          height: 100,
                          background: '#fff',
                          border: '1px dashed #cbd5e1',
                          borderRadius: 4,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          marginBottom: 12
                        }}>
                          <PlusOutlined style={{ fontSize: 24, color: '#94a3b8', marginBottom: 8 }} />
                          <Text type="secondary" style={{ fontSize: 12 }}>上传图片</Text>
                        </div>
                      </Upload>
                    )}
                    <Text type="secondary" style={{ fontSize: 13 }}>建议尺寸 100*40 以内，大小不超过 1 MB</Text>
                  </div>
                )}
              </div>
            </Form.Item>

            {/* 底部按钮 */}
            <Form.Item wrapperCol={{ offset: 0 }}>
              <Space size={24} style={{ marginTop: 24 }}>
                <Button type="primary" size="large" style={{ paddingInline: 40 }}>保 存</Button>
                <Link style={{ fontSize: 14 }}>去装修</Link>
              </Space>
            </Form.Item>
          </Form>
        )}

        {activeMenu === '类目设置' && <CategorySettings />}

        {activeMenu !== '基础设置' && activeMenu !== '类目设置' && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8' }}>
            该模块正在开发中...
          </div>
        )}
      </div>
    </div>
  )
}
