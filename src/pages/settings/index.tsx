import { Button, Checkbox, Form, Space, Switch, Typography, InputNumber, Table, Modal, Input, Popconfirm, message, Radio, Upload, Image } from 'antd'
import { QuestionCircleOutlined, HolderOutlined, CloseCircleFilled, PlusOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { themeColors } from '../../theme/colors'
import { loadXxxxCategories, saveXxxxCategories, type XxxxCategoryItem } from '../../mocks/xxxxCategories'

const { Text, Title, Link } = Typography
const CATEGORY_IMAGE_PLACEHOLDER = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=240&h=240&fit=crop'

// 类目设置组件
function CategorySettings() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [form] = Form.useForm()

  const [categories, setCategories] = useState([
    { id: '1', name: '最新', count: null, status: false, createdAt: null, isSystem: true, isMovable: false },
    { id: '2', name: '优秀', count: null, status: false, createdAt: null, isSystem: true, isMovable: false },
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
      title: '属性名称',
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
      title: '关联作品数',
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
              title="确定删除该属性吗？"
              description="删除后关联的作品将失去归属。"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
              placement="topRight"
            >
              <Link style={{ color: '#ef4444' }}>删除</Link>
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
          添加属性 ({categories.length}/20)
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
        title={editingItem ? "编辑属性" : "添加属性"}
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
            label={<span style={{ color: '#1e293b', fontWeight: 500 }}>属性名称：</span>}
            rules={[{ required: true, message: '请输入属性名称' }]}
            style={{ marginBottom: 0 }}
          >
            <Input
              placeholder="请输入属性名称"
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

// XX设置组件
function XxCategorySettings() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [form] = Form.useForm()
  const [categoryImageUrl, setCategoryImageUrl] = useState<string | null>(null)

  const [categories, setCategories] = useState<XxxxCategoryItem[]>(() => loadXxxxCategories())

  const updateCategories = (updater: (prev: XxxxCategoryItem[]) => XxxxCategoryItem[]) => {
    setCategories((prev) => {
      const next = updater(prev)
      saveXxxxCategories(next)
      return next
    })
  }

  const handleToggleStatus = (id: string, checked: boolean) => {
    updateCategories(prev => prev.map(item =>
      item.id === id ? { ...item, status: checked } : item
    ))
    message.success(`${checked ? '已开启' : '已隐藏'}显示状态`)
  }

  const handleDelete = (id: string) => {
    updateCategories(prev => prev.filter(item => item.id !== id))
    message.success('类目已删除')
  }

  const handleAdd = () => {
    setEditingItem(null)
    form.resetFields()
    setCategoryImageUrl(null)
    setIsModalOpen(true)
  }

  const handleEdit = (record: any) => {
    setEditingItem(record)
    setCategoryImageUrl(record.imageUrl ?? null)
    form.setFieldsValue({ name: record.name, imageUrl: record.imageUrl ?? null })
    setIsModalOpen(true)
  }

  const handleCategoryImageUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('只允许上传 JPG 或 PNG 格式图片!')
      return false
    }

    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('品类图片大小必须小于 2MB!')
      return false
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const value = e.target?.result as string
      setCategoryImageUrl(value)
      form.setFieldValue('imageUrl', value)
    }
    reader.readAsDataURL(file)
    return false
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const imageUrl = values.imageUrl || categoryImageUrl || CATEGORY_IMAGE_PLACEHOLDER

      if (editingItem) {
        updateCategories(prev => prev.map(item =>
          item.id === editingItem.id ? { ...item, name: values.name, imageUrl } : item
        ))
        message.success('类目已更新')
      } else {
        const newId = String(Date.now())
        updateCategories(prev => [...prev, {
          id: newId,
          name: values.name,
          count: 0,
          status: true,
          createdAt: new Date().toISOString().replace('T', ' ').split('.')[0],
          isMovable: true,
          imageUrl,
        }])
        message.success('类目已添加')
      }
      setIsModalOpen(false)
    })
  }

  const columns = [
    {
      title: '品类名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          {record.isMovable && <HolderOutlined style={{ color: '#94a3b8', cursor: 'grab' }} />}
          <span style={{ color: '#1e293b', fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: '品类图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 112,
      render: (imageUrl: string, record: any) => (
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            background: '#f8fafc',
            flexShrink: 0,
          }}
        >
          <Image
            src={imageUrl || CATEGORY_IMAGE_PLACEHOLDER}
            alt={record.name}
            preview={false}
            width={56}
            height={56}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ),
    },
    {
      title: '关联作品数',
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
      render: (_: any, record: any) => (
        <Space size={16}>
          <Link onClick={() => handleEdit(record)}>编辑</Link>
          <Popconfirm
            title="确定删除该IP/品类吗？"
            description="删除后关联的作品将失去归属。"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
            placement="topRight"
          >
            <Link style={{ color: '#ef4444' }}>删除</Link>
          </Popconfirm>
        </Space>
      ),
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
          添加品类 ({categories.length}/20)
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
        title={editingItem ? "编辑品类" : "添加品类"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          setCategoryImageUrl(null)
        }}
        onOk={handleModalOk}
        okText="确定"
        cancelText="取消"
        centered
        width={560}
        bodyStyle={{ paddingTop: 32, paddingBottom: 64 }}
      >
        <Form form={form} layout="horizontal" colon={false}>
          <Form.Item name="imageUrl" hidden rules={[{ required: true, message: '请上传品类图片' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label={<span style={{ color: '#1e293b', fontWeight: 500 }}>品类名称：</span>}
            rules={[{ required: true, message: '请输入品类名称' }]}
            style={{ marginBottom: 20 }}
          >
            <Input
              placeholder="请输入品类名称"
              maxLength={8}
              showCount
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: '#1e293b', fontWeight: 500 }}>品类图片：</span>}
            required
            style={{ marginBottom: 0 }}
          >
            <div>
              <Upload
                showUploadList={false}
                beforeUpload={handleCategoryImageUpload}
                accept="image/jpeg,image/png"
              >
                <div
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 12,
                    border: '1px dashed #cbd5e1',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  {categoryImageUrl ? (
                    <img
                      src={categoryImageUrl}
                      alt="品类图片"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <PlusOutlined style={{ color: '#94a3b8', fontSize: 22 }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>上传图片</Text>
                    </div>
                  )}
                </div>
              </Upload>
              <Text type="secondary" style={{ display: 'block', marginTop: 10, fontSize: 12 }}>
                建议上传 1:1 图片，支持 JPG、PNG，大小不超过 2MB
              </Text>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default function SettingsPage() {
  const [activeMenu, setActiveMenu] = useState('基础设置')
  const [featuredTagStyle, setFeaturedTagStyle] = useState('custom')

  // 图片上传状态
  const [featuredTagImage, setFeaturedTagImage] = useState<string | null>(null)

  // 处理图片模拟上传
  const handleUpload = (file: any) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setFeaturedTagImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    return false // 阻止自动上传
  }

  const menuItems = [
    '基础设置',
    'IP/品类',
    '作品属性'
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
          {activeMenu === '基础设置' && <Button size="small">推广创作者首页</Button>}
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
                  </div>
                </div>
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
                        beforeUpload={handleUpload}
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

        {activeMenu === '作品属性' && <CategorySettings />}
        {activeMenu === 'IP/品类' && <XxCategorySettings />}

        {activeMenu !== '基础设置' && activeMenu !== '作品属性' && activeMenu !== 'IP/品类' && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8' }}>
            该模块正在开发中...
          </div>
        )}
      </div>
    </div>
  )
}
