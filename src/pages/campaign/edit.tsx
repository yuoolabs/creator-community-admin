import { LeftOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, Input, Radio, Upload, message } from 'antd'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

const { RangePicker } = DatePicker

export default function CampaignEditPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const id = searchParams.get('id')

    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState<string>()
    const [isDetail, setIsDetail] = useState(false)

    const isEdit = !!id

    useEffect(() => {
        if (isEdit) {
            // Mock fetching detail
            const mockCover = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=400&fit=crop'
            setImageUrl(mockCover)

            // In a real app, status would come from API. 
            // Mock: if id is cp-3 or cp-7 (from campaign.ts), it's end/invalid
            const mockStatus: '进行中' | '已结束' | '已失效' = (id === 'cp-3' || id === 'cp-5') ? '已结束' : (id === 'cp-7' ? '已失效' : '进行中')
            setIsDetail(mockStatus === '已结束' || mockStatus === '已失效')

            form.setFieldsValue({
                name: '春季穿搭灵感征集',
                coverUrl: mockCover,
                status: mockStatus,
                type: '图文征集',
                rule: '1. 参与者需发布原创合规内容...\n2. 内容需包含指定标签...',
            })
        }
    }, [isEdit, id, form])

    const onFinish = async () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            message.success(isEdit ? '活动保存成功' : '活动添加成功')
            navigate(-1)
        }, 500)
    }

    return (
        <div style={{ padding: '24px', background: '#fff', minHeight: '100%', borderRadius: 8 }}>
            <div
                style={{
                    fontSize: 20,
                    fontWeight: 600,
                    marginBottom: 24,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    color: '#1f2937'
                }}
                onClick={() => navigate('/campaign')}
            >
                <LeftOutlined style={{ fontSize: 18 }} />
                {isDetail ? '活动详情' : (isEdit ? '编辑活动' : '添加活动')}
            </div>

            <div style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937', marginBottom: 16 }}>基础设置</div>
            <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 24 }} />

            <Form
                form={form}
                layout="horizontal"
                labelCol={{ flex: '120px' }}
                wrapperCol={{ flex: '1' }}
                labelAlign="left"
                colon={true}
                onFinish={onFinish}
                style={{ maxWidth: 800 }}
                disabled={isDetail}
            >
                <Form.Item
                    label="活动类型"
                    name="type"
                    rules={[{ required: true, message: '请选择活动类型' }]}
                >
                    <Radio.Group>
                        <Radio value="图文征集">图文征集</Radio>
                        <Radio value="视频挑战">视频挑战</Radio>
                        <Radio value="直播任务">直播任务</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label="活动时间"
                    name="timeRange"
                    rules={[{ required: true, message: '请选择活动时间' }]}
                >
                    <RangePicker style={{ width: 350 }} placeholder={['开始日期', '结束日期']} />
                </Form.Item>

                <Form.Item
                    label="活动名称"
                    name="name"
                    rules={[{ required: true, message: '请输入活动名称' }]}
                >
                    <Input placeholder="请输入活动名称" maxLength={30} showCount />
                </Form.Item>

                <Form.Item
                    label="活动规则"
                    name="rule"
                >
                    <Input.TextArea
                        placeholder="请输入活动规则说明，例如：参与条件、评选标准、奖励发放等..."
                        maxLength={500}
                        showCount
                        rows={4}
                    />
                </Form.Item>

                <Form.Item
                    label="活动封面"
                    name="coverUrl"
                    rules={[{ required: true, message: '请上传活动封面' }]}
                    valuePropName="file"
                    extra={
                        <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>
                            建议尺寸 600×400，支持 JPG、PNG 格式，大小不超过 3MB。
                        </div>
                    }
                >
                    <Upload
                        name="file"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={(file) => {
                            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
                            if (!isJpgOrPng) {
                                message.error('只允许上传 JPG 或 PNG 格式图片!')
                            }
                            const isLt2M = file.size / 1024 / 1024 < 3
                            if (!isLt2M) {
                                message.error('封面大小必须小于 3MB!')
                            }

                            if (isJpgOrPng && isLt2M) {
                                const reader = new FileReader()
                                reader.readAsDataURL(file)
                                reader.onload = () => {
                                    setImageUrl(reader.result as string)
                                    form.setFieldValue('coverUrl', reader.result)
                                }
                            }
                            return false
                        }}
                    >
                        {imageUrl ? (
                            <img src={imageUrl} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>上传图片</div>
                            </div>
                        )}
                    </Upload>
                </Form.Item>

                {!isDetail && (
                    <Form.Item>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {isEdit ? '保存修改' : '保 存'}
                            </Button>
                            <Button onClick={() => navigate(-1)}>
                                取消
                            </Button>
                        </div>
                    </Form.Item>
                )}
            </Form>
        </div>

    )
}
