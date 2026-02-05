'use client'

import { Card, Table, Typography, Select, Space } from 'antd'
import { CarOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '../../store/themeStore'
import { useDataStore } from '../../store/dataStore'
import { StatusTag } from '../../components/common/StatusTag'
import type { ColumnsType } from 'antd/es/table'
import { Box } from '../../types'
import { useState } from 'react'

const { Title } = Typography

export const Boxes = () => {
  const { t } = useTranslation()
  const { theme } = useThemeStore()
  const { boxes, floors, locations } = useDataStore()
  const isDark = theme === 'dark'

  const [filterLocation, setFilterLocation] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const getLocationName = (locationId: string) => {
    const location = locations.find((l) => l.id === locationId)
    return location?.name || 'Unknown'
  }

  const getFloorName = (floorId: string) => {
    const floor = floors.find((f) => f.id === floorId)
    return floor?.name || 'Unknown'
  }

  const filteredBoxes = boxes.filter((box) => {
    if (filterLocation && box.location_id !== filterLocation) return false
    if (filterStatus && box.status !== filterStatus) return false
    return true
  })

  const columns: ColumnsType<Box> = [
    {
      title: t('boxes.code'),
      dataIndex: 'code',
      key: 'code',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: isDark ? 'rgba(82, 196, 26, 0.2)' : 'rgba(82, 196, 26, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CarOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
          </div>
          <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{text}</span>
        </div>
      ),
    },
    {
      title: t('boxes.floor'),
      dataIndex: 'floor_id',
      key: 'floor_id',
      render: (floorId) => getFloorName(floorId),
    },
    {
      title: t('boxes.location'),
      dataIndex: 'location_id',
      key: 'location_id',
      render: (locationId) => getLocationName(locationId),
    },
    {
      title: t('boxes.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusTag status={status} />,
    },
  ]

  // Stats
  const freeCount = boxes.filter((b) => b.status === 'FREE').length
  const busyCount = boxes.filter((b) => b.status === 'BUSY').length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <Title level={2} style={{ margin: 0, color: isDark ? '#fff' : '#1a1a2e' }}>
          {t('nav.boxes')}
        </Title>
        <Space wrap>
          <Select
            placeholder={t('boxes.filter_location')}
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
            placeholder={t('boxes.filter_status')}
            style={{ width: 120 }}
            allowClear
            onChange={(value) => setFilterStatus(value)}
          >
            <Select.Option value="FREE">{t('boxes.free')}</Select.Option>
            <Select.Option value="BUSY">{t('boxes.busy')}</Select.Option>
          </Select>
        </Space>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <Card
          style={{
            borderRadius: '12px',
            background: isDark ? 'rgba(82, 196, 26, 0.1)' : 'rgba(82, 196, 26, 0.05)',
            border: '1px solid rgba(82, 196, 26, 0.3)',
            flex: '1 1 150px',
          }}
          styles={{ body: { padding: '16px', textAlign: 'center' } }}
        >
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#52c41a' }}>{freeCount}</div>
          <div style={{ fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.6)' : '#666' }}>
            {t('boxes.free')}
          </div>
        </Card>
        <Card
          style={{
            borderRadius: '12px',
            background: isDark ? 'rgba(255, 77, 79, 0.1)' : 'rgba(255, 77, 79, 0.05)',
            border: '1px solid rgba(255, 77, 79, 0.3)',
            flex: '1 1 150px',
          }}
          styles={{ body: { padding: '16px', textAlign: 'center' } }}
        >
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#ff4d4f' }}>{busyCount}</div>
          <div style={{ fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.6)' : '#666' }}>
            {t('boxes.busy')}
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
        <Table columns={columns} dataSource={filteredBoxes} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  )
}
