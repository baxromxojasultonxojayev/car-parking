'use client'

import { Card, Table, Typography, Tag } from 'antd'
import { DollarOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '../../store/themeStore'
import { useDataStore } from '../../store/dataStore'
import type { ColumnsType } from 'antd/es/table'
import { Payment } from '../../types'
import dayjs from 'dayjs'

const { Title } = Typography

const providerColors: Record<string, string> = {
  CASH: '#52c41a',
  CARD: '#1890ff',
  PAYME: '#00b5ad',
  CLICK: '#2db7f5',
}

export const Payments = () => {
  const { t } = useTranslation()
  const { theme } = useThemeStore()
  const { payments } = useDataStore()
  const isDark = theme === 'dark'

  const columns: ColumnsType<Payment> = [
    {
      title: t('payments.request_id'),
      dataIndex: 'request_id',
      key: 'request_id',
      render: (text) => (
        <span style={{ fontWeight: 500, fontFamily: 'monospace', color: '#667eea' }}>#{text}</span>
      ),
    },
    {
      title: t('payments.amount'),
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DollarOutlined style={{ color: '#52c41a' }} />
          <span style={{ fontWeight: 600, fontSize: '15px' }}>
            {amount.toLocaleString()} <span style={{ fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.5)' : '#888' }}>UZS</span>
          </span>
        </div>
      ),
    },
    {
      title: t('payments.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag
          color={status === 'PAID' ? 'green' : status === 'PENDING' ? 'orange' : 'red'}
          style={{ borderRadius: '6px', fontWeight: 500 }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: t('payments.provider'),
      dataIndex: 'provider',
      key: 'provider',
      render: (provider) => (
        <Tag
          color={providerColors[provider] || 'default'}
          style={{ borderRadius: '6px', fontWeight: 500 }}
        >
          {provider}
        </Tag>
      ),
    },
    {
      title: t('payments.paid_at'),
      dataIndex: 'paid_at',
      key: 'paid_at',
      render: (date) =>
        date ? (
          dayjs(date).format('DD.MM.YYYY HH:mm')
        ) : (
          <span style={{ color: isDark ? 'rgba(255,255,255,0.3)' : '#ccc' }}>-</span>
        ),
    },
  ]

  // Stats
  const paidPayments = payments.filter((p) => p.status === 'PAID')
  const pendingPayments = payments.filter((p) => p.status === 'PENDING')
  const totalPaid = paidPayments.reduce((sum, p) => sum + p.amount, 0)
  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div>
      <Title level={2} style={{ margin: '0 0 24px 0', color: isDark ? '#fff' : '#1a1a2e' }}>
        {t('nav.payments')}
      </Title>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <Card
          style={{
            borderRadius: '12px',
            background: isDark
              ? 'linear-gradient(135deg, rgba(82, 196, 26, 0.15) 0%, rgba(82, 196, 26, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(82, 196, 26, 0.1) 0%, rgba(82, 196, 26, 0.02) 100%)',
            border: '1px solid rgba(82, 196, 26, 0.3)',
            flex: '1 1 200px',
          }}
          styles={{ body: { padding: '20px' } }}
        >
          <div style={{ fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.6)' : '#666', marginBottom: '4px' }}>
            {t('payments.total_paid')}
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#52c41a' }}>
            {totalPaid.toLocaleString()} <span style={{ fontSize: '14px' }}>UZS</span>
          </div>
          <div style={{ fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.4)' : '#888', marginTop: '4px' }}>
            {paidPayments.length} {t('payments.transactions')}
          </div>
        </Card>
        <Card
          style={{
            borderRadius: '12px',
            background: isDark
              ? 'linear-gradient(135deg, rgba(250, 140, 22, 0.15) 0%, rgba(250, 140, 22, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(250, 140, 22, 0.1) 0%, rgba(250, 140, 22, 0.02) 100%)',
            border: '1px solid rgba(250, 140, 22, 0.3)',
            flex: '1 1 200px',
          }}
          styles={{ body: { padding: '20px' } }}
        >
          <div style={{ fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.6)' : '#666', marginBottom: '4px' }}>
            {t('payments.total_pending')}
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#fa8c16' }}>
            {totalPending.toLocaleString()} <span style={{ fontSize: '14px' }}>UZS</span>
          </div>
          <div style={{ fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.4)' : '#888', marginTop: '4px' }}>
            {pendingPayments.length} {t('payments.transactions')}
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
        <Table columns={columns} dataSource={payments} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  )
}
