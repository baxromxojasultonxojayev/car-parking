'use client'

import { useState } from 'react'
import { Card, Table, Button, Space, Modal, Form, Input, Select, Typography, message } from 'antd'
import { PlusOutlined, CarOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '../../store/themeStore'
import { useDataStore } from '../../store/dataStore'
import { useAuthStore } from '../../store/authStore'
import { StatusTag } from '../../components/common/StatusTag'
import type { ColumnsType } from 'antd/es/table'
import { Session } from '../../types'
import dayjs from 'dayjs'

const { Title } = Typography

export const Sessions = () => {
  const { t } = useTranslation()
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { sessions, tickets, boxes, createSession, updateSessionStatus, updateBoxStatus, assignTicket } = useDataStore()
  const isDark = theme === 'dark'

  const [modalOpen, setModalOpen] = useState(false)
  const [parkModalOpen, setParkModalOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [form] = Form.useForm()
  const [parkForm] = Form.useForm()

  const isValet = user?.role === 'VALET'

  const availableTickets = tickets.filter((t) => t.state === 'AVAILABLE')
  const freeBoxes = boxes.filter((b) => b.status === 'FREE')

  const handleCreate = () => {
    form.resetFields()
    setModalOpen(true)
  }

  const handleSaveSession = async () => {
    try {
      const values = await form.validateFields()
      const ticket = tickets.find((t) => t.id === values.ticket_id)

      createSession({
        ticket_id: values.ticket_id,
        ticket_serial: ticket?.serial || '',
        vehicle_plate: values.vehicle_plate,
        customer_name: values.customer_name,
        customer_phone: values.customer_phone,
        status: 'CREATED',
      })

      // Assign ticket
      assignTicket(values.ticket_id, Date.now().toString(), values.vehicle_plate)

      message.success(t('sessions.created'))
      setModalOpen(false)
    } catch (error) {
      // Validation failed
    }
  }

  const handlePark = (session: Session) => {
    setSelectedSession(session)
    parkForm.resetFields()
    setParkModalOpen(true)
  }

  const handleSavePark = async () => {
    try {
      const values = await parkForm.validateFields()
      const box = boxes.find((b) => b.id === values.box_id)

      updateSessionStatus(selectedSession!.id, 'PARKED', values.box_id, box?.code)
      updateBoxStatus(values.box_id, 'BUSY')

      message.success(t('sessions.parked'))
      setParkModalOpen(false)
    } catch (error) {
      // Validation failed
    }
  }

  const handleCancel = (session: Session) => {
    Modal.confirm({
      title: t('common.confirm'),
      content: t('sessions.confirm_cancel'),
      onOk: () => {
        updateSessionStatus(session.id, 'CANCELLED')
        message.success(t('sessions.cancelled'))
      },
    })
  }

  const columns: ColumnsType<Session> = [
    {
      title: t('sessions.ticket'),
      dataIndex: 'ticket_serial',
      key: 'ticket_serial',
      render: (text) => (
        <span style={{ fontWeight: 500, fontFamily: 'monospace', color: '#722ed1' }}>{text}</span>
      ),
    },
    {
      title: t('sessions.vehicle_plate'),
      dataIndex: 'vehicle_plate',
      key: 'vehicle_plate',
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
      title: t('sessions.customer'),
      dataIndex: 'customer_name',
      key: 'customer_name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          {record.customer_phone && (
            <div style={{ fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.5)' : '#888' }}>
              {record.customer_phone}
            </div>
          )}
        </div>
      ),
    },
    {
      title: t('sessions.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusTag status={status} />,
    },
    {
      title: t('sessions.box'),
      dataIndex: 'parking_box_code',
      key: 'parking_box_code',
      render: (text) =>
        text ? (
          <span style={{ fontWeight: 500, color: '#52c41a' }}>{text}</span>
        ) : (
          <span style={{ color: isDark ? 'rgba(255,255,255,0.3)' : '#ccc' }}>-</span>
        ),
    },
    {
      title: t('sessions.created_at'),
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => dayjs(date).format('DD.MM.YYYY HH:mm'),
      responsive: ['md'],
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status === 'CREATED' && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handlePark(record)}
              >
                {t('sessions.park')}
              </Button>
              <Button
                size="small"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleCancel(record)}
              >
                {t('sessions.cancel')}
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <Title level={2} style={{ margin: 0, color: isDark ? '#fff' : '#1a1a2e' }}>
          {t('nav.sessions')}
        </Title>
        {(isValet || user?.role === 'SUPER_ADMIN') && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            {t('sessions.create')}
          </Button>
        )}
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
          dataSource={sessions}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Create Session Modal */}
      <Modal
        title={t('sessions.create')}
        open={modalOpen}
        onOk={handleSaveSession}
        onCancel={() => setModalOpen(false)}
        okText={t('common.save')}
        cancelText={t('common.cancel')}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '16px' }}>
          <Form.Item
            name="ticket_id"
            label={t('sessions.ticket')}
            rules={[{ required: true, message: t('common.required') }]}
          >
            <Select placeholder={t('sessions.select_ticket')}>
              {availableTickets.map((ticket) => (
                <Select.Option key={ticket.id} value={ticket.id}>
                  {ticket.serial}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="vehicle_plate"
            label={t('sessions.vehicle_plate')}
            rules={[{ required: true, message: t('common.required') }]}
          >
            <Input placeholder="01A123BC" style={{ textTransform: 'uppercase' }} />
          </Form.Item>
          <Form.Item
            name="customer_name"
            label={t('sessions.customer')}
            rules={[{ required: true, message: t('common.required') }]}
          >
            <Input placeholder={t('sessions.customer_placeholder')} />
          </Form.Item>
          <Form.Item name="customer_phone" label={t('sessions.phone')}>
            <Input placeholder="+998901234567" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Park Session Modal */}
      <Modal
        title={t('sessions.select_box')}
        open={parkModalOpen}
        onOk={handleSavePark}
        onCancel={() => setParkModalOpen(false)}
        okText={t('sessions.park')}
        cancelText={t('common.cancel')}
      >
        <Form form={parkForm} layout="vertical" style={{ marginTop: '16px' }}>
          <Form.Item
            name="box_id"
            label={t('sessions.box')}
            rules={[{ required: true, message: t('common.required') }]}
          >
            <Select placeholder={t('sessions.select_box')}>
              {freeBoxes.map((box) => (
                <Select.Option key={box.id} value={box.id}>
                  {box.code}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
