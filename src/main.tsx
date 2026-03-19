import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { antdTheme } from './theme/antdTheme'
import './index.css'

dayjs.locale('zh-cn')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={zhCN} theme={antdTheme}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </StrictMode>,
)
