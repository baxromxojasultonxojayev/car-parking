'use client'

import { Layout, Menu, Button } from 'antd'
import {
  DashboardOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  CarOutlined,
  TagsOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  PullRequestOutlined,
  DollarOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import type { MenuProps } from 'antd'
import { useThemeStore } from '../../store/themeStore'
import { useAuthStore } from '../../store/authStore'
import { ROLE_PERMISSIONS } from '../../types'

const { Sider } = Layout

interface SidebarProps {
  collapsed?: boolean
  onMenuClick?: () => void
}

export const Sidebar = ({ collapsed = false, onMenuClick }: SidebarProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useThemeStore()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleMenuClick = (key: string) => {
    navigate(key)
    onMenuClick?.()
  }

  // Get allowed paths for current user role
  const allowedPaths = user ? ROLE_PERMISSIONS[user.role] : []

  const allMenuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined style={{ fontSize: '18px' }} />,
      label: t('nav.dashboard'),
    },
    {
      key: '/locations',
      icon: <EnvironmentOutlined style={{ fontSize: '18px' }} />,
      label: t('nav.locations'),
    },
    {
      key: '/floors',
      icon: <AppstoreOutlined style={{ fontSize: '18px' }} />,
      label: t('nav.floors'),
    },
    {
      key: '/boxes',
      icon: <CarOutlined style={{ fontSize: '18px' }} />,
      label: t('nav.boxes'),
    },
    {
      key: '/tickets',
      icon: <TagsOutlined style={{ fontSize: '18px' }} />,
      label: t('nav.tickets'),
    },
    {
      key: '/memberships',
      icon: <TeamOutlined style={{ fontSize: '18px' }} />,
      label: t('nav.memberships'),
    },
    {
      key: '/sessions',
      icon: <ClockCircleOutlined style={{ fontSize: '18px' }} />,
      label: t('nav.sessions'),
    },
    {
      key: '/requests',
      icon: <PullRequestOutlined style={{ fontSize: '18px' }} />,
      label: t('nav.requests'),
    },
    {
      key: '/payments',
      icon: <DollarOutlined style={{ fontSize: '18px' }} />,
      label: t('nav.payments'),
    },
  ]

  // Filter menu items based on role permissions
  const menuItems = allMenuItems.filter((item) => item && allowedPaths.includes(item.key as string))

  return (
    <Sider
      theme={theme === 'dark' ? 'dark' : 'light'}
      width={260}
      collapsed={collapsed}
      collapsedWidth={80}
      style={{
        background: theme === 'dark' ? '#0a0b14' : '#ffffff',
        borderRight: theme === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f0f0f0',
        boxShadow: theme === 'dark' ? 'none' : '4px 0 15px rgba(0, 0, 0, 0.05)',
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* User Role Stats */}
        {!collapsed && (
          <div
            style={{
              padding: '20px',
              borderBottom: theme === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f0f0f0',
            }}
          >
            <div
              style={{
                background:
                  theme === 'dark'
                    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)'
                    : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : '#888',
                  marginBottom: '4px',
                }}
              >
                {t('nav.current_role')}
              </div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: theme === 'dark' ? '#fff' : '#667eea',
                }}
              >
                {user?.role?.replace('_', ' ')}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : '#999',
                  marginTop: '4px',
                }}
              >
                {user?.name}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={(e) => handleMenuClick(e.key)}
            style={{
              background: 'transparent',
              border: 'none',
            }}
          />
        </div>

        {/* Logout Section */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: theme === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f0f0f0',
          }}
        >
          <Button
            type="text"
            icon={<LogoutOutlined style={{ color: '#ff4d4f' }} />}
            onClick={handleLogout}
            block
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#ff4d4f',
              height: '44px',
              borderRadius: '8px',
              textAlign: 'left',
              paddingLeft: collapsed ? '20px' : '12px',
              fontWeight: 500,
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}
          >
            {!collapsed && t('nav.logout')}
          </Button>
        </div>

        {/* Footer */}
        {!collapsed && (
          <div
            style={{
              padding: '16px 20px',
              background: theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : '#999',
                textAlign: 'center',
              }}
            >
              {t('nav.copyright')}
            </div>
          </div>
        )}
      </div>
    </Sider>
  )
}
