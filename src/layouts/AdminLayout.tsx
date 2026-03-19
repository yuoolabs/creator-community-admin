import { Drawer, Grid, Layout, Menu, Typography } from 'antd'
import type { MenuProps } from 'antd'
import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { managementNavItems } from '../mocks/nav'

const { Sider, Content } = Layout
const { useBreakpoint } = Grid

function navToMenuItems(items: typeof managementNavItems): MenuProps['items'] {
  return items.map((item) => ({
    key: item.key,
    label: item.label,
  }))
}

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const screens = useBreakpoint()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isDesktop = Boolean(screens.lg)
  const selectedMenuKey = location.pathname.startsWith('/creator-management')
    ? '/creator-management'
    : location.pathname.startsWith('/campaign')
      ? '/campaign'
      : location.pathname

  const onMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(String(key))
    setMobileMenuOpen(false)
  }

  const menuContent = (
    <>
      <div className="sider-brand-text-only">
        <Typography.Text className="sider-title">创作者中心</Typography.Text>
      </div>

      <div className="menu-group-title-plain">创作者中心</div>
      <Menu
        mode="inline"
        items={navToMenuItems(managementNavItems)}
        selectedKeys={[selectedMenuKey]}
        onClick={onMenuClick}
        style={{ border: 0, background: 'transparent' }}
      />
    </>
  )

  return (
    <Layout style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {isDesktop ? (
        <Sider
          width={240}
          theme="light"
          style={{ borderRight: '1px solid #d1d5db', background: '#f3f4f6' }}
        >
          {menuContent}
        </Sider>
      ) : (
        <Drawer
          width={240}
          placement="left"
          title={null}
          closable
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          styles={{ body: { padding: 0, background: '#f3f4f6' } }}
        >
          <div className="mobile-menu-body">{menuContent}</div>
        </Drawer>
      )}

      <Layout>
        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
