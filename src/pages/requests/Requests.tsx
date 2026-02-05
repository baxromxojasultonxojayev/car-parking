'use client'

import { Card, Table, Button, Space, Typography, message, Tag } from 'antd'
import {
  UserAddOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  CheckOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '../../store/themeStore'
import { useDataStore } from '../../store/dataStore'
import { useAuthStore } from '../../store/authStore'
import { StatusTag } from '../../components/common/StatusTag'
import type { ColumnsType } from 'antd/es/table'
import { Request } from '../../types'
import dayjs from 'dayjs'

const { Title } = Typography

export const Requests = () => {
  const { t } = useTranslation()
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { requests, updateRequestStatus, claimRequest } = useDataStore()
  const isDark = theme === 'dark'

  const handleClaim = (request: Request) => {
    claimRequest(request.id, user?.id || '', user?.name || '')
    message.success(t('requests.claimed'))
  }

  const handleStart = (request: Request) => {
    updateRequestStatus(request.id, 'IN_PROGRESS')
    message.success(t('requests.started'))
  }

  const handleReady = (request: Request) => {
    updateRequestStatus(request.id, 'READY')
    message.success(t('requests.ready'))
  }

  const handleDone = (request: Request) => {
    updateRequestStatus(request.id, 'DONE')
    message.success(t('requests.done'))
  }

  const columns: ColumnsType<Request> = [
    {
      title: t('requests.session_plate'),
      dataIndex: 'session_plate',
      key: 'session_plate',
      render: (text) => (
        <span
          style={{
            background: isDark ? 'rgba(255,255,255,0.1)' : '#f0f0f0',
            padding: '4px 10px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontWeight: 600,
            fontSize: '13px',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: t('requests.requested_for'),
      dataIndex: 'requested_for',
      key: 'requested_for',
      render: (date) => dayjs(date).format('DD.MM.YYYY HH:mm'),
    },
    {
      title: t('requests.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusTag status={status} />,
    },
    {
      title: t('requests.payment_status'),
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (status) => (
        <Tag
          color={status === 'PAID' ? 'green' : status === 'PENDING' ? 'orange' : 'red'}
          style={{ borderRadius: '6px' }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: t('requests.claimed_by'),
      dataIndex: 'claimed_by_name',
      key: 'claimed_by_name',
      render: (text) =>
        text ? (
          <span style={{ fontWeight: 500 }}>{text}</span>
        ) : (
          <span style={{ color: isDark ? 'rgba(255,255,255,0.3)' : '#ccc' }}>-</span>
        ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_, record) => {
        const isOwner = record.claimed_by === user?.id
        const canAct = isOwner || user?.role === 'SUPER_ADMIN'

        return (
          <Space wrap>
            {record.status === 'OPEN' && (
              <Button
                type="primary"
                size="small"
                icon={<UserAddOutlined />}
                onClick={() => handleClaim(record)}
              >
                {t('requests.claim')}
              </Button>
            )}
            {record.status === 'CLAIMED' && canAct && (
              <Button
                size="small"
                icon={<PlayCircleOutlined />}
                onClick={() => handleStart(record)}
                style={{ background: '#722ed1', color: '#fff', border: 'none' }}
              >
                {t('requests.start')}
              </Button>
            )}
            {record.status === 'IN_PROGRESS' && canAct && (
              <Button
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => handleReady(record)}
                style={{ background: '#13c2c2', color: '#fff', border: 'none' }}
              >
                {t('requests.ready')}
              </Button>
            )}
            {record.status === 'READY' && canAct && (
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleDone(record)}
                style={{ background: '#52c41a', border: 'none' }}
              >
                {t('requests.done')}
              </Button>
            )}
          </Space>
        )
      },
    },
  ]

  // Stats
  const openCount = requests.filter((r) => r.status === 'OPEN').length
  const inProgressCount = requests.filter((r) => r.status === 'CLAIMED' || r.status === 'IN_PROGRESS').length
  const readyCount = requests.filter((r) => r.status === 'READY').length
  const doneCount = requests.filter((r) => r.status === 'DONE').length

  return (
    <div>
      <Title level={2} style={{ margin: '0 0 24px 0', color: isDark ? '#fff' : '#1a1a2e' }}>
        {t('nav.requests')}
      </Title>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <Card
          style={{
            borderRadius: '12px',
            background: isDark ? 'rgba(250, 140, 22, 0.1)' : 'rgba(250, 140, 22, 0.05)',
            border: '1px solid rgba(250, 140, 22, 0.3)',
            flex: '1 1 100px',
          }}
          styles={{ body: { padding: '16px', textAlign: 'center' } }}
        >
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#fa8c16' }}>{openCount}</div>
          <div style={{ fontSize: '11px', color: isDark ? 'rgba(255,255,255,0.6)' : '#666' }}>
            {t('requests.open')}
          </div>
        </Card>
        <Card
          style={{
            borderRadius: '12px',
            background: isDark ? 'rgba(114, 46, 209, 0.1)' : 'rgba(114, 46, 209, 0.05)',
            border: '1px solid rgba(114, 46, 209, 0.3)',
            flex: '1 1 100px',
          }}
          styles={{ body: { padding: '16px', textAlign: 'center' } }}
        >
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#722ed1' }}>{inProgressCount}</div>
          <div style={{ fontSize: '11px', color: isDark ? 'rgba(255,255,255,0.6)' : '#666' }}>
            {t('requests.in_progress')}
          </div>
        </Card>
        <Card
          style={{
            borderRadius: '12px',
            background: isDark ? 'rgba(19, 194, 194, 0.1)' : 'rgba(19, 194, 194, 0.05)',
            border: '1px solid rgba(19, 194, 194, 0.3)',
            flex: '1 1 100px',
          }}
          styles={{ body: { padding: '16px', textAlign: 'center' } }}
        >
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#13c2c2' }}>{readyCount}</div>
          <div style={{ fontSize: '11px', color: isDark ? 'rgba(255,255,255,0.6)' : '#666' }}>
            {t('requests.ready_label')}
          </div>
        </Card>
        <Card
          style={{
            borderRadius: '12px',
            background: isDark ? 'rgba(82, 196, 26, 0.1)' : 'rgba(82, 196, 26, 0.05)',
            border: '1px solid rgba(82, 196, 26, 0.3)',
            flex: '1 1 100px',
          }}
          styles={{ body: { padding: '16px', textAlign: 'center' } }}
        >
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#52c41a' }}>{doneCount}</div>
          <div style={{ fontSize: '11px', color: isDark ? 'rgba(255,255,255,0.6)' : '#666' }}>
            {t('requests.done_label')}
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
        <Table
          columns={columns}
          dataSource={requests}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  )
}
