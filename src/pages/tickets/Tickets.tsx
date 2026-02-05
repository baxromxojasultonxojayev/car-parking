'use client'

import { useState } from 'react'
import { Card, Table, Button, Space, Modal, InputNumber, Typography, message } from 'antd'
import { PlusOutlined, StopOutlined, TagsOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '../../store/themeStore'
import { useDataStore } from '../../store/dataStore'
import { StatusTag } from '../../components/common/StatusTag'
import type { ColumnsType } from 'antd/es/table'
import { Ticket } from '../../types'

const { Title } = Typography

export const Tickets = () => {
  const { t } = useTranslation()
  const { theme } = useThemeStore()
  const { tickets, generateTickets, retireTicket } = useDataStore()
  const isDark = theme === 'dark'

  const [generateModalOpen, setGenerateModalOpen] = useState(false)
  const [ticketCount, setTicketCount] = useState(10)

  const handleGenerate = () => {
    generateTickets(ticketCount)
    message.success(t('tickets.generated', { count: ticketCount }))
    setGenerateModalOpen(false)
    setTicketCount(10)
  }

  const handleRetire = (id: string) => {
    Modal.confirm({
      title: t('common.confirm'),
      content: t('tickets.confirm_retire'),
      onOk: () => {
        retireTicket(id)
        message.success(t('tickets.retired'))
      },
    })
  }

  const columns: ColumnsType<Ticket> = [
    {
      title: t('tickets.serial'),
      dataIndex: 'serial',
      key: 'serial',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: isDark ? 'rgba(114, 46, 209, 0.2)' : 'rgba(114, 46, 209, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TagsOutlined style={{ color: '#722ed1', fontSize: '16px' }} />
          </div>
          <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{text}</span>
        </div>
      ),
    },
    {
      title: t('tickets.state'),
      dataIndex: 'state',
      key: 'state',
      render: (state) => <StatusTag status={state} />,
    },
    {
      title: t('tickets.assigned_session'),
      dataIndex: 'assigned_session_plate',
      key: 'assigned_session_plate',
      render: (plate) =>
        plate ? (
          <span
            style={{
              background: isDark ? 'rgba(255,255,255,0.1)' : '#f0f0f0',
              padding: '2px 8px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontWeight: 600,
            }}
          >
            {plate}
          </span>
        ) : (
          <span style={{ color: isDark ? 'rgba(255,255,255,0.3)' : '#ccc' }}>-</span>
        ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          {record.state !== 'RETIRED' && (
            <Button
              type="text"
              icon={<StopOutlined />}
              onClick={() => handleRetire(record.id)}
              style={{ color: '#ff4d4f' }}
              disabled={record.state === 'ASSIGNED'}
            >
              {t('tickets.retire')}
            </Button>
          )}
        </Space>
      ),
    },
  ]

  // Stats
  const availableCount = tickets.filter((t) => t.state === 'AVAILABLE').length
  const assignedCount = tickets.filter((t) => t.state === 'ASSIGNED').length
  const returnedCount = tickets.filter((t) => t.state === 'RETURNED').length
  const retiredCount = tickets.filter((t) => t.state === 'RETIRED').length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <Title level={2} style={{ margin: 0, color: isDark ? '#fff' : '#1a1a2e' }}>
          {t('nav.tickets')}
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setGenerateModalOpen(true)}>
          {t('tickets.generate')}
        </Button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <Card
          style={{
            borderRadius: '12px',
            background: isDark ? 'rgba(82, 196, 26, 0.1)' : 'rgba(82, 196, 26, 0.05)',
            border: '1px solid rgba(82, 196, 26, 0.3)',
            flex: '1 1 100px',
          }}
          styles={{ body: { padding: '16px', textAlign: 'center' } }}
        >
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#52c41a' }}>{availableCount}</div>
          <div style={{ fontSize: '11px', color: isDark ? 'rgba(255,255,255,0.6)' : '#666' }}>
            {t('tickets.available')}
          </div>
        </Card>
        <Card
          style={{
            borderRadius: '12px',
            background: isDark ? 'rgba(24, 144, 255, 0.1)' : 'rgba(24, 144, 255, 0.05)',
            border: '1px solid rgba(24, 144, 255, 0.3)',
            flex: '1 1 100px',
          }}
          styles={{ body: { padding: '16px', textAlign: 'center' } }}
        >
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#1890ff' }}>{assignedCount}</div>
          <div style={{ fontSize: '11px', color: isDark ? 'rgba(255,255,255,0.6)' : '#666' }}>
            {t('tickets.assigned')}
          </div>
        </Card>
        <Card
          style={{
            borderRadius: '12px',
            background: isDark ? 'rgba(250, 140, 22, 0.1)' : 'rgba(250, 140, 22, 0.05)',
            border: '1px solid rgba(250, 140, 22, 0.3)',
            flex: '1 1 100px',
          }}
          styles={{ body: { padding: '16px', textAlign: 'center' } }}
        >
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#fa8c16' }}>{returnedCount}</div>
          <div style={{ fontSize: '11px', color: isDark ? 'rgba(255,255,255,0.6)' : '#666' }}>
            {t('tickets.returned')}
          </div>
        </Card>
        <Card
          style={{
            borderRadius: '12px',
            background: isDark ? 'rgba(140, 140, 140, 0.1)' : 'rgba(140, 140, 140, 0.05)',
            border: '1px solid rgba(140, 140, 140, 0.3)',
            flex: '1 1 100px',
          }}
          styles={{ body: { padding: '16px', textAlign: 'center' } }}
        >
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#8c8c8c' }}>{retiredCount}</div>
          <div style={{ fontSize: '11px', color: isDark ? 'rgba(255,255,255,0.6)' : '#666' }}>
            {t('tickets.retired_label')}
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
        <Table columns={columns} dataSource={tickets} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        title={t('tickets.generate')}
        open={generateModalOpen}
        onOk={handleGenerate}
        onCancel={() => setGenerateModalOpen(false)}
        okText={t('tickets.generate')}
        cancelText={t('common.cancel')}
      >
        <div style={{ marginTop: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
            {t('tickets.count')}
          </label>
          <InputNumber
            min={1}
            max={100}
            value={ticketCount}
            onChange={(value) => setTicketCount(value || 10)}
            style={{ width: '100%' }}
          />
        </div>
      </Modal>
    </div>
  )
}
