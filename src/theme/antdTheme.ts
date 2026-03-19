import type { ThemeConfig } from 'antd'
import { themeColors } from './colors'

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: themeColors.primary,
    colorBgBase: '#f3f4f6',
    colorBorder: '#d1d5db',
    colorText: '#475569',
    colorTextHeading: '#0f172a',
    colorTextSecondary: '#64748b',
    borderRadius: 8,
    boxShadowSecondary: '0 1px 2px rgba(0,0,0,0.05)',
    fontFamily:
      'PingFang SC, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif',
  },
  components: {
    Layout: {
      bodyBg: '#f3f4f6',
      headerBg: '#ffffff',
      siderBg: '#f3f4f6',
      triggerBg: '#f3f4f6',
    },
    Menu: {
      itemHeight: 52,
      itemBorderRadius: 18,
      itemSelectedBg: themeColors.primary,
      itemSelectedColor: '#ffffff',
      itemColor: '#475569',
      itemHoverColor: '#1e293b',
      itemHoverBg: themeColors.primaryHoverBg,
    },
    Table: {
      headerBg: '#f8fafc',
      headerColor: '#64748b',
      borderColor: '#f1f5f9',
      rowHoverBg: '#f8fafc',
    },
    Input: {
      activeBorderColor: themeColors.primary,
      hoverBorderColor: themeColors.primaryHover,
    },
    Select: {
      activeBorderColor: themeColors.primary,
      hoverBorderColor: themeColors.primaryHover,
    },
    Button: {
      primaryShadow: 'none',
      defaultShadow: 'none',
      borderColorDisabled: '#e2e8f0',
    },
  },
}
