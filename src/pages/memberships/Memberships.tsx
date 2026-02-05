'use client'

import { Card, Table, Typography, Tag, Select } from 'antd'
import { TeamOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '../../store/themeStore'
import { useDataStore } from '../../store/dataStore'
import type { ColumnsType } from 'antd/es/table'
import { Membership } from '../../types'
import { useState } from 'react'

const { Title } = Typography

const roleColors: Record<string, string> = {
  ADMIN: '#1890ff',
  VALET: '#52c41a',
}

export const Memberships = () => {
  const { t } = useTranslation()
  const { theme } = useThemeStore()
  const { memberships, locations } = useDataStore()
  const isDark = theme === 'dark'

  const [filterLocation, setFilterLocation] = useState<string | null>(null)
  const [filterRole, setFilterRole] = useState<string | null>(null)

  const getLocationName = (locationId: string) => {
    const location = locations.find((l) => l.id === locationId)
    return location?.name || 'Unknown'
  }

  const filteredMemberships = memberships.filter((m) => {
    if (filterLocation && m.location_id !== filterLocation) return false
    if (filterRole && m.role !== filterRole) return false
    return true
  })

  const columns: ColumnsType<Membership> = [
    {
      title: t('memberships.user_name'),
      dataIndex: 'user_name',
      key: 'user_name',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: isDark ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              color: '#667eea',
            }}
          >
            {text.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontWeight: 500 }}>{text}</span>
        </div>
      ),
    },
    {
      title: t('memberships.location'),
      dataIndex: 'location_id',
      key: 'location_id',
      render: (locationId) => getLocationName(locationId),
    },
    {
      title: t('memberships.role'),
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={roleColors[role]} style={{ borderRadius: '6px', fontWeight: 500 }}>
          {role}
        </Tag>
      ),
    },
  ]

  // Stats
  const adminCount = memberships.filter((m) => m.role === 'ADMIN').length
  const valetCount = memberships.filter((m) => m.role === 'VALET').length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <Title level={2} style={{ margin: 0, color: isDark ? '#fff' : '#1a1a2e' }}>
          {t('nav.memberships')}
        </Title>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Select
            placeholder={t('memberships.filter_location')}
            style={{ width: 180 }}
            allowClear
            onChange={(value) => setFilterLocation(value)}
          >
            {locations.map((loc) => (
              <Select.Option key={loc.id} value={loc.id}>
                {loc.name}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder={t('memberships.filter_role')}
            style={{ width: 120 }}
            allowClear
            onChange={(value) => setFilterRole(value)}
          >
            <Select.Option value="ADMIN">Admin</Select.Option>
            <Select.Option value="VALET">Valet</Select.Option>
          </Select>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <Card
          style={{
            borderRadius: '12px',
            background: isDark ? 'rgba(24, 144, 255, 0.1)' : 'rgba(24, 144, 255, 0.05)',
            border: '1px solid rgba(24, 144, 255, 0.3)',
            flex: '1 1 150px',
          }}
          styles={{ body: { padding: '16px', textAlign: 'center' } }}
        >
          <TeamOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#1890ff' }}>{adminCount}</div>
          <div style={{ fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.6)' : '#666' }}>
            {t('memberships.admins')}
          </div>
        </Card>
        <Card
          style={{
            borderRadius: '12px',
            background: isDark ? 'rgba(82, 196, 26, 0.1)' : 'rgba(82, 196, 26, 0.05)',
            border: '1px solid rgba(82, 196, 26, 0.3)',
            flex: '1 1 150px',
          }}
          styles={{ body: { padding: '16px', textAlign: 'center' } }}
        >
          <TeamOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#52c41a' }}>{valetCount}</div>
          <div style={{ fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.6)' : '#666' }}>
            {t('memberships.valets')}
          </div>
        </Card>
      </div>

      <Card
        style={{
          borderRadius: '16px',
          background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f0f0f0',
        }}
        styles={{ body: { padding: 0 } }}
      >
        <Table columns={columns} dataSource={filteredMemberships} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  )
}
