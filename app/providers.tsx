'use client'

import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider locale={zhCN}>
      {children}
    </ConfigProvider>
  )
}
