'use client'

import { useTranslation } from 'react-i18next'
import { Layout, Select, Button, Dropdown, Avatar, Badge, Tag, Drawer } from 'antd'
import {
  SunOutlined,
  MoonOutlined,
  LogoutOutlined,
  UserOutlined,
  BellOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import { useThemeStore } from '../../store/themeStore'
import { useAuthStore } from '../../store/authStore'
import type { MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Sidebar } from './Sidebar'

const { Header } = Layout

interface AppHeaderProps {
  showMobileMenu?: boolean
}

const roleColors: Record<string, string> = {
  SUPER_ADMIN: '#722ed1',
  ADMIN: '#1890ff',
  VALET: '#52c41a',
}

export const AppHeader = ({ showMobileMenu = true }: AppHeaderProps) => {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useThemeStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const languages = [
    { label: '🇺🇸 English', value: 'en' },
    { label: '🇷🇺 Русский', value: 'ru' },
    { label: "🇺🇿 O'zbek", value: 'uz' },
  ]

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value)
    localStorage.setItem('language', value)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div style={{ padding: '8px 0' }}>
          <div style={{ fontWeight: 600, color: theme === 'dark' ? '#fff' : '#333' }}>{user?.name}</div>
          <Tag color={roleColors[user?.role || 'VALET']} style={{ marginTop: '4px' }}>
            {user?.role?.replace('_', ' ')}
          </Tag>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('header.profile'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined style={{ color: '#ff4d4f' }} />,
      label: <span style={{ color: '#ff4d4f' }}>{t('header.logout')}</span>,
      onClick: handleLogout,
    },
  ]

  return (
    <>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background:
            theme === 'dark'
              ? 'linear-gradient(135deg, #0a0b14 0%, #12141f 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '0 16px',
          boxShadow: theme === 'dark' ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 4px 20px rgba(0, 0, 0, 0.15)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          height: '64px',
          borderBottom: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
        }}
      >
        {/* Left Section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {/* Mobile Menu Button */}
          {showMobileMenu && (
            <Button
              type="text"
              icon={<MenuOutlined style={{ color: 'rgba(255,255,255,0.85)', fontSize: '18px' }} />}
              onClick={() => setMobileMenuOpen(true)}
              className="mobile-menu-btn"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                width: '40px',
                height: '40px',
                display: 'none',
              }}
            />
          )}

          {/* Logo & Title */}
          <div
            style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span style={{ fontSize: '20px' }}>🚗</span>
          </div>
          <span
            className="header-title"
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#fff',
              letterSpacing: '-0.5px',
            }}
          >
            {t('app_title')}
          </span>
        </div>

        {/* Right Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Notifications */}
          <Badge count={3} size="small">
            <Button
              type="text"
              icon={<BellOutlined style={{ color: 'rgba(255,255,255,0.85)', fontSize: '18px' }} />}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                width: '40px',
                height: '40px',
              }}
            />
          </Badge>

          {/* Language Selector */}
          <Select
            value={i18n.language?.split('-')[0] || 'en'}
            onChange={handleLanguageChange}
            style={{ width: 120 }}
            options={languages}
            variant="borderless"
            dropdownStyle={{ borderRadius: '12px' }}
            popupClassName="language-dropdown"
            className="header-select"
          />

          {/* Theme Toggle */}
          <Button
            type="text"
            icon={
              theme === 'light' ? (
                <MoonOutlined style={{ color: 'rgba(255,255,255,0.85)', fontSize: '18px' }} />
              ) : (
                <SunOutlined style={{ color: 'rgba(255,255,255,0.85)', fontSize: '18px' }} />
              )
            }
            onClick={toggleTheme}
            title={t('header.theme')}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              width: '40px',
              height: '40px',
            }}
          />

          {/* User Avatar */}
          {user && (
            <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
              <div
                className="user-avatar-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  padding: '6px 12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '25px',
                  transition: 'all 0.3s ease',
                }}
              >
                <Avatar
                  style={{
                    background: `linear-gradient(135deg, ${roleColors[user.role]} 0%, ${roleColors[user.role]}dd 100%)`,
                    fontWeight: 600,
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
                <span
                  className="user-name"
                  style={{
                    color: '#fff',
                    fontWeight: 500,
                    fontSize: '14px',
                  }}
                >
                  {user.name?.split(' ')[0]}
                </span>
              </div>
            </Dropdown>
          )}
        </div>
      </Header>

      {/* Mobile Sidebar Drawer */}
      <Drawer
        placement="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        width={280}
        styles={{
          body: { padding: 0 },
          header: { display: 'none' },
        }}
      >
        <Sidebar onMenuClick={() => setMobileMenuOpen(false)} />
      </Drawer>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex !important;
          }
          .header-title {
            display: none;
          }
          .header-select {
            width: 50px !important;
          }
          .header-select .ant-select-selection-item {
            padding-right: 0 !important;
          }
          .user-name {
            display: none;
          }
          .user-avatar-btn {
            padding: 4px !important;
            border-radius: 50% !important;
          }
        }
      `}</style>
    </>
  )
}
