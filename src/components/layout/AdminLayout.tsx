'use client'

import { Layout } from 'antd'
import { ReactNode } from 'react'
import { AppHeader } from './Header'
import { Sidebar } from './Sidebar'
import { useThemeStore } from '../../store/themeStore'

const { Content } = Layout

interface AdminLayoutProps {
  children: ReactNode
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { theme } = useThemeStore()
  const collapsed = false

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Layout>
        {/* Desktop Sidebar - hidden on mobile */}
        <div className="desktop-sidebar">
          <Sidebar collapsed={collapsed} />
        </div>

        {/* Main Content */}
        <Content
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(180deg, #0a0b14 0%, #0f111a 100%)'
              : 'linear-gradient(180deg, #f5f7fa 0%, #eef2f7 100%)',
            padding: '24px',
            minHeight: 'calc(100vh - 64px)',
            overflow: 'auto',
          }}
        >
          <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
            {children}
          </div>
        </Content>
      </Layout>

      <style>{`
        .desktop-sidebar {
          display: block;
          height: calc(100vh - 64px);
          position: sticky;
          top: 64px;
        }

        @media (max-width: 768px) {
          .desktop-sidebar {
            display: none;
          }
        }

        @media (max-width: 576px) {
          .ant-layout-content {
            padding: 16px !important;
          }
        }
      `}</style>
    </Layout>
  )
}
