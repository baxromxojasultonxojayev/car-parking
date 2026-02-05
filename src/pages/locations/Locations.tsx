'use client'

import { useState } from 'react'
import { Card, Table, Button, Space, Modal, Form, Input, Typography, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '../../store/themeStore'
import { useDataStore } from '../../store/dataStore'
import type { ColumnsType } from 'antd/es/table'
import { Location } from '../../types'
import dayjs from 'dayjs'

const { Title } = Typography

export const Locations = () => {
  const { t } = useTranslation()
  const { theme } = useThemeStore()
  const { locations, addLocation, updateLocation, deleteLocation } = useDataStore()
  const isDark = theme === 'dark'

  const [modalOpen, setModalOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [form] = Form.useForm()

  const handleAdd = () => {
    setEditingLocation(null)
    form.resetFields()
    setModalOpen(true)
  }

  const handleEdit = (record: Location) => {
    setEditingLocation(record)
    form.setFieldsValue({ name: record.name })
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: t('common.confirm'),
      content: t('locations.confirm_delete'),
      onOk: () => {
        deleteLocation(id)
        message.success(t('common.deleted'))
      },
    })
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (editingLocation) {
        updateLocation(editingLocation.id, values)
        message.success(t('common.updated'))
      } else {
        addLocation({
          name: values.name,
          created_at: new Date().toISOString(),
        })
        message.success(t('common.created'))
      }
      setModalOpen(false)
    } catch (error) {
      // Validation failed
    }
  }

  const columns: ColumnsType<Location> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (text) => (
        <span style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#888', fontSize: '12px' }}>#{text}</span>
      ),
    },
    {
      title: t('locations.name'),
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: isDark ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EnvironmentOutlined style={{ color: '#667eea', fontSize: '16px' }} />
          </div>
          <span style={{ fontWeight: 500 }}>{text}</span>
        </div>
      ),
    },
    {
      title: t('locations.created_at'),
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => dayjs(date).format('DD.MM.YYYY HH:mm'),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: '#667eea' }}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            style={{ color: '#ff4d4f' }}
          />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: isDark ? '#fff' : '#1a1a2e' }}>
          {t('nav.locations')}
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t('locations.add')}
        </Button>
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
          dataSource={locations}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingLocation ? t('locations.edit') : t('locations.add')}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText={t('common.save')}
        cancelText={t('common.cancel')}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '16px' }}>
          <Form.Item
            name="name"
            label={t('locations.name')}
            rules={[{ required: true, message: t('common.required') }]}
          >
            <Input placeholder={t('locations.name_placeholder')} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
