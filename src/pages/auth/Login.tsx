'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Select, Button, Typography, Space } from 'antd'
import { UserOutlined, LoginOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { Role } from '../../types'

const { Title, Text } = Typography

const roleOptions = [
  {
    value: 'SUPER_ADMIN' as Role,
    label: '👑 Super Admin',
    description: 'Full access to all features',
    color: '#722ed1',
  },
  {
    value: 'ADMIN' as Role,
    label: '🛡️ Admin',
    description: 'Sessions, Requests, Payments',
    color: '#1890ff',
  },
  {
    value: 'VALET' as Role,
    label: '🚗 Valet',
    description: 'Sessions and Requests only',
    color: '#52c41a',
  },
]

export const Login = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const [selectedRole, setSelectedRole] = useState<Role>('SUPER_ADMIN')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    login(selectedRole)
    navigate('/dashboard')
  }

  const selectedRoleInfo = roleOptions.find((r) => r.value === selectedRole)

  const languages = [
    { label: '🇺🇸 EN', value: 'en' },
    { label: '🇷🇺 RU', value: 'ru' },
    { label: '🇺🇿 UZ', value: 'uz' },
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          theme === 'dark'
            ? 'linear-gradient(135deg, #0a0b14 0%, #1a1b2e 50%, #0f111a 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        padding: '20px',
        position: 'relative',
      }}
    >
      {/* Language & Theme Toggle */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '8px' }}>
        <Select
          value={i18n.language?.split('-')[0] || 'en'}
          onChange={(value) => {
            i18n.changeLanguage(value)
            localStorage.setItem('language', value)
          }}
          options={languages}
          style={{ width: 80 }}
          size="small"
        />
        <Button
          size="small"
          onClick={toggleTheme}
          icon={theme === 'dark' ? '☀️' : '🌙'}
          style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff' }}
        />
      </div>

      {/* Background decoration */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '50%',
          height: '50%',
          background:
            'radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '50%',
          height: '50%',
          background:
            'radial-gradient(circle, rgba(118, 75, 162, 0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <Card
        style={{
          width: '100%',
          maxWidth: '420px',
          borderRadius: '24px',
          background: theme === 'dark'
            ? 'rgba(15, 17, 26, 0.9)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: theme === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        styles={{
          body: { padding: '40px' },
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
            }}
          >
            <span style={{ fontSize: '40px' }}>🚗</span>
          </div>
          <Title
            level={2}
            style={{
              margin: 0,
              color: theme === 'dark' ? '#fff' : '#1a1a2e',
              fontWeight: 700,
            }}
          >
            {t('app_title')}
          </Title>
          <Text
            style={{
              color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : '#666',
              fontSize: '14px',
            }}
          >
            {t('auth.welcome')}
          </Text>
        </div>

        {/* Role Selection */}
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 500,
                color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : '#333',
              }}
            >
              {t('auth.select_role')}
            </Text>
            <Select
              value={selectedRole}
              onChange={setSelectedRole}
              style={{ width: '100%' }}
              size="large"
              optionLabelProp="label"
            >
              {roleOptions.map((role) => (
                <Select.Option key={role.value} value={role.value} label={role.label}>
                  <div style={{ padding: '4px 0' }}>
                    <div style={{ fontWeight: 600 }}>{role.label}</div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : '#888',
                      }}
                    >
                      {role.description}
                    </div>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* Selected Role Info */}
          {selectedRoleInfo && (
            <div
              style={{
                padding: '16px',
                background: theme === 'dark'
                  ? `${selectedRoleInfo.color}15`
                  : `${selectedRoleInfo.color}10`,
                borderRadius: '12px',
                border: `1px solid ${selectedRoleInfo.color}30`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    background: selectedRoleInfo.color,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <UserOutlined style={{ color: '#fff', fontSize: '18px' }} />
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      color: theme === 'dark' ? '#fff' : '#1a1a2e',
                    }}
                  >
                    {selectedRoleInfo.label}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : '#666',
                    }}
                  >
                    {selectedRoleInfo.description}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Login Button */}
          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            onClick={handleLogin}
            icon={<LoginOutlined />}
            style={{
              height: '50px',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
            }}
          >
            {t('auth.login')}
          </Button>
        </Space>

        {/* Demo Notice */}
        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
            padding: '12px',
            background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            borderRadius: '8px',
          }}
        >
          <Text
            style={{
              fontSize: '12px',
              color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : '#888',
            }}
          >
            🔓 {t('auth.demo_mode')}
          </Text>
        </div>
      </Card>
    </div>
  )
}
