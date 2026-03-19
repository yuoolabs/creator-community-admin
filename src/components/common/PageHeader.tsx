import { MenuOutlined } from '@ant-design/icons'
import { Badge, Button, Input, Space } from 'antd'
import { figmaAssets } from '../../mocks/assets'
import AssetIcon from './AssetIcon'

type PageHeaderProps = {
  mobile?: boolean
  onOpenMenu?: () => void
}

export default function PageHeader({ mobile = false, onOpenMenu }: PageHeaderProps) {
  return (
    <div className="page-header">
      <Space size={12}>
        {mobile ? (
          <Button
            type="text"
            icon={<MenuOutlined />}
            aria-label="打开导航菜单"
            onClick={onOpenMenu}
          />
        ) : null}
      </Space>

      <Space size={12} className="header-search-group">
        <Input
          placeholder="搜索用户ID或账号..."
          prefix={<AssetIcon src={figmaAssets.searchIcon} alt="搜索" size={14} />}
          style={{ width: mobile ? 180 : 256 }}
          allowClear
        />
        <Badge dot color="#ef4444" offset={[-2, 5]}>
          <div className="icon-circle-button" aria-label="消息通知">
            <AssetIcon src={figmaAssets.noticeIcon} alt="通知" size={16} />
          </div>
        </Badge>
      </Space>
    </div>
  )
}
